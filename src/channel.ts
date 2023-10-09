/* eslint-disable @typescript-eslint/no-misused-promises */
import type { ShopwareMessageTypes } from './messages.types';
import { generateUniqueId } from './_internals/utils';
import type { extension } from './privileges/privilege-resolver';
import { sendPrivileged, handlePrivileged } from './privileges/privilege-resolver';
import { ShopwareMessageTypePrivileges } from './privileges';
import MissingPrivilegesError from './privileges/missing-privileges-error';
import SerializerFactory from './_internals/serializer';
import createError from './_internals/error-handling/error-factory';
import validate from './_internals/validator/index';
import type { datasetRegistration } from './data';
import { selectData } from './data/_internals/selectData';
import sdkVersion from './_internals/sdkVersion';

const packageVersion = sdkVersion as string;

const { serialize, deserialize } = SerializerFactory({
  handle: handle,
  send: send,
});

export type extensions = {
  [key: string]: extension,
}

export const adminExtensions: extensions = {};

export function setExtensions(extensions: extensions): void {
  Object.entries(extensions).forEach(([key, value]) => {
    // @ts-expect-error = we fill up the values later
    adminExtensions[key] = {};

    Object.entries(value).forEach(([valueKey, valueContent]) => {
      // @ts-expect-error = we defined the key beforehand
      adminExtensions[key][valueKey] = valueContent;
    });
  });
}

/**
 * ----------------
 * GENERAL TYPES
 * ----------------
 */

/**
 * This type contains the data of the type without the responseType
 * @internal
 */
export type MessageDataType<TYPE extends keyof ShopwareMessageTypes> = Omit<ShopwareMessageTypes[TYPE], 'responseType'>;

/**
 * This is the structure of the data which will be send with {@link send}
 * @internal
 */
export type ShopwareMessageSendData<MESSAGE_TYPE extends keyof ShopwareMessageTypes> = {
  _type: MESSAGE_TYPE,
  _data: MessageDataType<MESSAGE_TYPE>,
  _callbackId: string,
}

/**
 * This is the structure of the data which will be send back when the admin gives a response
 * @internal
 */
export type ShopwareMessageResponseData<MESSAGE_TYPE extends keyof ShopwareMessageTypes> = {
  _type: MESSAGE_TYPE,
  _response: ShopwareMessageTypes[MESSAGE_TYPE]['responseType'] | null,
  _callbackId: string,
}

/**
 * ----------------
 * DATA STORES FOR REGISTRIES
 * ----------------
 */
const sourceRegistry: Set<{
  source: Window,
  origin: string,
  sdkVersion: string|undefined,
}> = new Set();

const subscriberRegistry: Set<{
  id: string,
  selectors: string[] | undefined,
  source: Window,
  origin: string,
}> = new Set();

/**
 * ----------------
 * MAIN FUNCTIONS FOR EXPORT
 * ----------------
 */

/**
 * With this method you can send actions or you can request data:
 *
 * @param type Choose a type of action from the send-types
 * @param data The matching data for the type
 * @returns A promise with the response data in the given responseType
 */
export function send<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
  type: MESSAGE_TYPE,
  data: MessageDataType<MESSAGE_TYPE>,
  _targetWindow?: Window,
  _origin?: string
): Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType'] | null> {
  const missingPriviliges = sendPrivileged(type);
  if (missingPriviliges !== null) {
    const missingPrivilegesError = new MissingPrivilegesError(type, missingPriviliges);

    return Promise.reject(missingPrivilegesError);
  }

  // Generate a unique callback ID. This here is only for simple demonstration purposes
  const callbackId = generateUniqueId();

  // Set fallback data when no data is defined
  const sendData = data ?? {};

  // Generate the message with the callbackId
  const messageData: ShopwareMessageSendData<MESSAGE_TYPE> = {
    _type: type,
    _data: sendData,
    _callbackId: callbackId,
  };

  let serializedData = serialize(messageData) as ShopwareMessageSendData<MESSAGE_TYPE>;

  // Validate if send value contains entity data where the app has no privileges for
  if (_origin) {
    const validationErrors = validate({
      serializedData: serializedData,
      origin: _origin,
      privilegesToCheck: ['read'],
      type: type,
    });

    if (validationErrors) {
      // Datasets need the id for matching the response
      if ([
        'datasetSubscribe',
        'datasetUpdate',
        'datasetRegistration',
        'datasetGet',
      ].includes(serializedData._type)) {
        serializedData = serialize({
          _type: serializedData._type,
          _callbackId: serializedData._callbackId,
          _data: {
            // @ts-expect-error - We know with the includes that it has an ID
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: serializedData._data.id,
            data: validationErrors,
          },
        }) as ShopwareMessageSendData<MESSAGE_TYPE>;
      }
      // Everything else can overwrite the response
      else {
        serializedData = serialize({
          _type: serializedData._type,
          _callbackId: serializedData._callbackId,
          _data: validationErrors,
        }) as ShopwareMessageSendData<MESSAGE_TYPE>;
      }

    }
  }

  // Convert message data to string for message sending
  const message = JSON.stringify(serializedData);

  // Set value if send was resolved
  let isResolved = false;
  const timeoutMs = 7000;

  return new Promise((resolve, reject) => {
    const callbackHandler = function(event: MessageEvent<string>):void {
      if (typeof event.data !== 'string') {
        return;
      }

      // Only execute when callbackId matches
      if (event.data.indexOf(`"_callbackId":"${callbackId}"`) === -1) {
        return;
      }

      let shopwareResponseData;
      // Try to parse the json file
      try {
        shopwareResponseData = JSON.parse(event.data) as unknown;
      } catch {
        // Fail silently when message is not a valid json file
        return;
      }

      // Check if messageData is valid
      if (!isMessageResponseData<MESSAGE_TYPE>(shopwareResponseData)) {
        return;
      }

      // Only execute if response value exists
      if (!shopwareResponseData.hasOwnProperty('_response')) {
        return;
      }

      // Deserialize methods etc. so that they are callable in JS
      const deserializedResponseData = deserialize(shopwareResponseData, event) as ShopwareMessageResponseData<MESSAGE_TYPE>;

      // Remove event so that in only execute once
      window.removeEventListener('message', callbackHandler);

      // Only return the data if the request is not timed out
      if (!isResolved) {
        isResolved = true;

        const response = deserializedResponseData._response;

        // @ts-expect-error To not specify a possible error on every message type ignore it here.
        if (response instanceof Error) {
          reject(response);

          return;
        }

        // Return the data
        resolve(response);
      }
    };

    window.addEventListener('message', callbackHandler);

    let corsRestriction = true;

    try {
      corsRestriction = !window.parent.origin;
    } catch {
      // Silent catch to prevent cross origin frame exception
    }

    let targetOrigin = corsRestriction ? document.referrer : window.parent.origin;

    // If _origin was provided then update the targetOrigin
    if (_origin) {
      targetOrigin = _origin;
    }

    // Send the data to the target window
    _targetWindow ? _targetWindow.postMessage(message, targetOrigin) : window.parent.postMessage(message, targetOrigin);

    // Send timeout when no one sends data back or handler freezes
    setTimeout(() => {
      // Only runs when is not resolved
      if (isResolved) {
        return;
      }

      reject('Send timeout expired. It could be possible that no handler for the postMessage request exists or that the handler freezed.');
    }, timeoutMs);
  });
}

/**
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
export function handle<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(
  type: MESSAGE_TYPE,
  method: (data: MessageDataType<MESSAGE_TYPE>, additionalInformation: { _event_: MessageEvent<string>}) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType']
)
  : () => void
{
  const handleListener = async function(event: MessageEvent<string>): Promise<void> {
    // Message type needs privileges to be handled
    if (ShopwareMessageTypePrivileges[type] && Object.keys(ShopwareMessageTypePrivileges[type]).length) {
      if (!adminExtensions) {
        return;
      }

      const missingPrivileges = handlePrivileged(type, event.origin);
      if (missingPrivileges !== null) {
        return;
      }
    }

    if (typeof event.data !== 'string') {
      return;
    }

    // Check if messageData type matches the type argument
    if (event.data.indexOf(`"_type":"${type}"`) === -1) {
      return;
    }

    let shopwareMessageData;

    // Try to parse the json file
    try {
      shopwareMessageData = JSON.parse(event.data) as unknown;
    } catch {
      // Fail silently when message is not a valid json file
      return;
    }

    // Check if messageData is valid
    if (!isMessageData<MESSAGE_TYPE>(shopwareMessageData)) {
      return;
    }

    // Deserialize methods etc. so that they are callable in JS
    const deserializedMessageData = deserialize(shopwareMessageData, event) as ShopwareMessageSendData<MESSAGE_TYPE>;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const responseValue = await Promise.resolve((() => {
      const responseValidationTypes = [
        'datasetSubscribe',
        'datasetGet',
        'datasetUpdate',
        // Test value
        '_collectionTest',
      ];

      if (!responseValidationTypes.includes(type)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return method(
          deserializedMessageData._data,
          { _event_: event }
        );
      }

      /*
       * Validate incoming handle messages for privileges
       * in Entity and Entity Collection
       */
      const validationErrors = validate({
        serializedData: shopwareMessageData,
        origin: event.origin,
        type: type,
        privilegesToCheck: ['create', 'delete', 'update', 'read'],
      });

      if (validationErrors) {
        return validationErrors;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return method(
        deserializedMessageData._data,
        { _event_: event }
      );
    })()).catch(e => createError(type, e));

    const responseMessage: ShopwareMessageResponseData<MESSAGE_TYPE> = {
      _callbackId: deserializedMessageData._callbackId,
      _type: deserializedMessageData._type,
      _response: responseValue ?? null,
    };

    // Replace methods etc. so that they are working in JSON format
    const serializedResponseMessage = ((): ShopwareMessageResponseData<MESSAGE_TYPE> => {
      let serializedMessage = serialize(responseMessage) as ShopwareMessageResponseData<MESSAGE_TYPE>;
      const messageValidationTypes = [
        'datasetSubscribe',
        'datasetGet',
        // Test value
        '_collectionTest',
      ];

      if (!messageValidationTypes.includes(type)) {
        return serializedMessage;
      }

      // Validate if response value contains entity data where the app has no privileges for
      const validationErrors = validate({
        serializedData: serializedMessage,
        origin: event.origin,
        privilegesToCheck: ['read'],
        type: type,
      });

      if (validationErrors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        serializedMessage._response = validationErrors;
        serializedMessage = serialize(serializedMessage) as ShopwareMessageResponseData<MESSAGE_TYPE>;
      }

      return serializedMessage;
    })();

    const stringifiedResponseMessage = JSON.stringify(serializedResponseMessage);

    if (event.source) {
      // If event source exists then send it back to original source
      event.source.postMessage(stringifiedResponseMessage, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        targetOrigin: event.origin ?? '*',
      });
    } else {
      // If no event source exists then it should send to same window
      window.postMessage(stringifiedResponseMessage, window.origin);
    }
  };

  // Start listening directly
  window.addEventListener('message', handleListener);

  // Return a cancel method
  return ():void => window.removeEventListener('message', handleListener);
}

export function publish<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
  type: MESSAGE_TYPE,
  data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType'],
  sources: {
    source: Window,
    origin: string,
    sdkVersion: string | undefined,
  }[] = [...sourceRegistry].map(({source, origin, sdkVersion}) => ({
    source,
    origin,
    sdkVersion,
  }))
)
:void
{
  sources.forEach(({ source, origin }) => {
    // Disable error handling because not every window need to react to the data
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return send(type, data, source, origin).catch(() => {});
  });
}

export function subscribe<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
  type: MESSAGE_TYPE,
  method: (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => void | Promise<unknown>
): () => void {
  return handle(type, method);
}

/**
 * Factory method which creates a sender so that the type doesn't need to be
 * defined and can be hidden. Also this allows to use a send method without
 * a required second argument if the default options are defined.
 */

// SENDER WITH OPTIONAL ARGUMENTS (WHEN ALL BASE ARGUMENTS ARE DEFINED)
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(messageType: MESSAGE_TYPE, baseMessageOptions: MessageDataType<MESSAGE_TYPE>)
:(messageOptions?: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']>

// SENDER WITH PARTIAL ARGUMENTS (ARGUMENTS DEFINED IN BASE OPTIONS ARE OMITTED)
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes, BASE_OPTIONS extends Partial<MessageDataType<MESSAGE_TYPE>>>
(messageType: MESSAGE_TYPE, baseMessageOptions: BASE_OPTIONS)
:(messageOptions: Omit<MessageDataType<MESSAGE_TYPE>, keyof BASE_OPTIONS>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']>

// SENDER WITH FULL ARGUMENTS (WHEN NO BASE ARGUMENTS ARE DEFINED)
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(messageType: MESSAGE_TYPE)
:(messageOptions: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']>

// MAIN FUNCTION WHICH INCLUDES ALL POSSIBILITES
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(messageType: MESSAGE_TYPE, baseMessageOptions?: MessageDataType<MESSAGE_TYPE>)
{
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (messageOptions: MessageDataType<MESSAGE_TYPE>) => {
    return send(messageType, { ...baseMessageOptions, ...messageOptions});
  };
}

/**
 * Factory method which creates a handler so that the type don't need to be
 * defined and can be hidden.
 */
export function createHandler<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (method: (data: MessageDataType<MESSAGE_TYPE>, additionalInformation: {
    _event_: MessageEvent<string>,
  }) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => {
    return handle(messageType, method);
  };
}

/**
 * Factory method which creates a handler so that the type don't need to be
 * defined and can be hidden.
 */
export function createSubscriber<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (method: (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => void | Promise<unknown>, id?: string) => {
    if (!id) {
      return subscribe(messageType, method);
    }

    const wrapper = (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']): void => {
      if (data.id === id) {
        void method(data);
      }
    };

    return subscribe(messageType, wrapper);
  };
}

const datasets = new Map<string, unknown>();

/**
 * ----------------
 * IIFE for default handler
 * ----------------
 */

(async (): Promise<void> => {
  // Handle registrations at current window
  handle('__registerWindow__', ({ sdkVersion }, additionalOptions) => {
    let source: Window | undefined;
    let origin: string | undefined;

    if (additionalOptions._event_.source) {
      source = additionalOptions._event_.source as Window;
      origin = additionalOptions._event_.origin;
    } else {
      source = window;
      origin = window.origin;
    }

    sourceRegistry.add({
      source,
      origin,
      sdkVersion,
    });
  });

  handle('datasetSubscribeRegistration', (data, { _event_ }) => {
    let source: Window | undefined;
    let origin: string | undefined;
  
    if (_event_.source) {
      source = _event_.source as Window;
      origin = _event_.origin;
    } else {
      source = window;
      origin = window.origin;
    }
  
    subscriberRegistry.add({
      id: data.id,
      source: source,
      origin: origin,
      selectors: data.selectors,
    });

    // When initial data exists directly send it to the subscriber
    const dataset = datasets.get(data.id);

    if (dataset) {
      const selectedData = selectData(dataset, data.selectors, 'datasetSubscribe', origin);

      if (selectedData instanceof MissingPrivilegesError) {
        console.error(selectedData);
        return;
      }

      void send('datasetSubscribe', {
        id: data.id,
        data: selectedData,
        selectors: data.selectors,
      }, source, origin);
    }
  });

  // Register at parent window
  await send('__registerWindow__', {
    sdkVersion: packageVersion,
  });
})().catch((e) => console.error(e));

// New dataset registered
export async function processDataRegistration(data: Omit<datasetRegistration, 'responseType'>): Promise<void> {
  datasets.set(data.id, data.data);

  // Only publish whole data to sources that don't have a sdkVersion (for backwards compatibility)
  publish('datasetSubscribe', data, [
    ...[...sourceRegistry].filter(({ sdkVersion }) => !sdkVersion),
  ]);

  // Publish selected data to sources that are inside the subscriberRegistry
  subscriberRegistry.forEach(({ id, selectors, source, origin }) => {
    if (id !== data.id) {
      return;
    }

    const selectedData = selectData(data.data, selectors, 'datasetSubscribe', origin);

    if (selectedData instanceof MissingPrivilegesError) {
      console.error(selectedData);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    send('datasetSubscribe', { id, data: selectedData, selectors }, source, origin).catch(() => {});
  });

  return Promise.resolve();
}

/**
 * Add utils to global window object for
 * testing
 */
 declare global {
  interface Window {
    _swsdk: {
      sourceRegistry: typeof sourceRegistry,
      subscriberRegistry: typeof subscriberRegistry,
      datasets: typeof datasets,
      adminExtensions: typeof adminExtensions,
    },
  }
}

window._swsdk = {
  sourceRegistry,
  subscriberRegistry,
  datasets,
  adminExtensions,
};

/**
 * ----------------
 * INTERNAL HELPER FUNCTIONS
 * ----------------
 */

/**
 * Check if the data is valid message data
 */
function isMessageData<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(eventData: unknown): eventData is ShopwareMessageSendData<MESSAGE_TYPE> {
  const shopwareMessageData = eventData as ShopwareMessageSendData<MESSAGE_TYPE>;

  return !!shopwareMessageData._type
         && !!shopwareMessageData._data
         && !!shopwareMessageData._callbackId;
}

// ShopwareMessageTypes[MESSAGE_TYPE]['responseType']
function isMessageResponseData<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(eventData: unknown): eventData is ShopwareMessageResponseData<MESSAGE_TYPE> {
  const shopwareMessageData = eventData as ShopwareMessageResponseData<MESSAGE_TYPE>;

  return !!shopwareMessageData._type
         && !!shopwareMessageData.hasOwnProperty('_response')
         && !!shopwareMessageData._callbackId;
}
