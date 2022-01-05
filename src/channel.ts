/* eslint-disable @typescript-eslint/no-misused-promises */
import { ShopwareMessageTypes } from './messages.types';
import { serializeMessageData, deserializeMessageData } from './_internals/function-serializer';
import { generateUniqueId } from './_internals/utils';
import { extensions, sendPrivileged, handlePrivileged } from './privileges/privilege-resolver';
import { ShopwareMessageTypePrivileges } from './privileges';
import MissingPrivilegesError from './privileges/missing-privileges-error';

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
const sourceRegistry: Set<Window> = new Set();

/**
 * ----------------
 * MAIN FUNCTIONS FOR EXPORT
 * ----------------
 */

/**
 * With this method you can send actions or you can request data:
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param data The matching data for the type
 * @returns A promise with the response data in the given responseType 
 */
export function send<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
  type: MESSAGE_TYPE,
  data: MessageDataType<MESSAGE_TYPE>,
  targetWindow?: Window
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

  // Replace methods etc. so that they are working in JSON format
  serializeMessageData<MESSAGE_TYPE>(messageData);

  // Convert message data to string for message sending
  const message = JSON.stringify(messageData);  

  // Set value if send was resolved
  let isResolved = false;
  const timeoutMs = 7000;

  return new Promise((resolve, reject) => {
    const callbackHandler = function(event: MessageEvent<string>):void {    
      if (typeof event.data !== 'string') {
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

      // Only execute when callbackId matches
      if (shopwareResponseData._callbackId !== callbackId) {
        return;
      }

      // Only execute if response value exists
      if (!shopwareResponseData.hasOwnProperty('_response')) {
        return;
      }
      
      // Remove event so that in only execute once
      window.removeEventListener('message', callbackHandler);

      // Only return the data if the request is not timed out
      if (!isResolved) {
        isResolved = true;

        // Return the data
        resolve(shopwareResponseData._response);
      }
    };

    window.addEventListener('message', callbackHandler);

    let corsRestriction = true;

    try {
      corsRestriction = !window.parent.origin;
    } catch {
      // Silent catch to prevent cross origin frame exception
    }

    // @ts-expect-error - Cypress tests run inside iframe. Therefore same level communication is not possible
    const parentWindow = !corsRestriction && window.parent.__CYPRESS__ ? window : window.parent;
    const targetOrigin = corsRestriction ? document.referrer : window.parent.origin;

    targetWindow ? targetWindow.postMessage(message, targetOrigin) : parentWindow.postMessage(message, targetOrigin);

    // Send timeout when noone sends data back or handler freezes
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
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
function handle<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(
  type: MESSAGE_TYPE,
  method: (data: MessageDataType<MESSAGE_TYPE>, additionalInformation: { _event_: MessageEvent<string>}) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType'],
  extensions: extensions
)
  : () => void
{
  const handleListener = async function(event: MessageEvent<string>): Promise<void> {
    // Message type needs privileges to be handled
    if (ShopwareMessageTypePrivileges[type] && Object.keys(ShopwareMessageTypePrivileges[type]).length) {
      if (!extensions) {
        return;
      }
      
      const missingPrivileges = handlePrivileged(type, extensions, event.origin);
      if (missingPrivileges !== null) {
        return;
      }
    }

    if (typeof event.data !== 'string') {
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

    // Check if messageData type matches the type argument
    if (shopwareMessageData._type !== type) {
      return;
    }

    // Deserialize methods etc. so that they are callable in JS
    deserializeMessageData<MESSAGE_TYPE>(shopwareMessageData);   

    const responseValue = await Promise.resolve(method(
      shopwareMessageData._data,
      { _event_: event }
    ));

    const responseMessage: ShopwareMessageResponseData<MESSAGE_TYPE> = {
      _callbackId: shopwareMessageData._callbackId,
      _type: shopwareMessageData._type,
      _response: responseValue ?? null,
    };

    const stringifiedResponseMessage = JSON.stringify(responseMessage);

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

export function handleFactory(extensions: extensions) {
  return <MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
    type: MESSAGE_TYPE,
    method: (data: MessageDataType<MESSAGE_TYPE>, additionalInformation: { _event_: MessageEvent<string>}) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType'],
  ): () => void => handle(type, method, extensions);
}

export function publish<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
  type: MESSAGE_TYPE,
  data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType'],
)
:Promise<(void | Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | null)[]>
{
  const sendPromises = [...sourceRegistry].map((source) => {    
    // Disable error handling because not every window need to react to the data
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return send(type, data, source).catch(() => {});
  });

  return Promise.all(sendPromises);
}

export function subscribe<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(
  type: MESSAGE_TYPE,
  method: (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => void | Promise<unknown>
): () => void {
  return handle(type, method, {});
}

/**
 * Factory method which creates a sender so that the type doesn't need to be
 * defined and can be hidden. Also this allows to use a send method without
 * a required second argument if the default options are defined.
 */

// SENDER WITH OPTIONAL ARGUMENTS (WHEN ALL BASE ARGUMENTS ARE DEFINED)
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(messageType: MESSAGE_TYPE, baseMessageOptions: MessageDataType<MESSAGE_TYPE>)
:(messageOptions?: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]["responseType"]>

// SENDER WITH PARTIAL ARGUMENTS (ARGUMENTS DEFINED IN BASE OPTIONS ARE OMITTED)
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes, BASE_OPTIONS extends Partial<MessageDataType<MESSAGE_TYPE>>>
(messageType: MESSAGE_TYPE, baseMessageOptions: BASE_OPTIONS)
:(messageOptions: Omit<MessageDataType<MESSAGE_TYPE>, keyof BASE_OPTIONS>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]["responseType"]>

// SENDER WITH FULL ARGUMENTS (WHEN NO BASE ARGUMENTS ARE DEFINED)
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(messageType: MESSAGE_TYPE)
:(messageOptions: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]["responseType"]>

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
  return (method: (data: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => {
    return handle(messageType, method, {});
  };
}

/**
 * Factory method which creates a handler so that the type don't need to be 
 * defined and can be hidden.
 */
export function createSubscriber<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (method: (data: ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => void | Promise<unknown>) => {
    return subscribe(messageType, method);
  };
}

/**
 * ----------------
 * IIFE for default handler
 * ----------------
 */

(async (): Promise<void> => {
  // Handle registrations at current window
  handle('__registerWindow__', (_, additionalOptions) => {
    if (additionalOptions._event_.source) {
      sourceRegistry.add(additionalOptions._event_.source as Window);
    } else {
      sourceRegistry.add(window);
    }
  }, {});

  // Register at parent window
  await send('__registerWindow__', {});
})().catch((e) => console.error(e));

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