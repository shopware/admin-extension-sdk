/* eslint-disable @typescript-eslint/no-misused-promises */
import { ShopwareMessageTypes } from './messages.types';
import { serializeMessageData, deserializeMessageData } from './_internals/function-serializer';
import { generateUniqueId } from './_internals/utils';

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
  // generate a unique callback ID. This here is only for simple demonstration purposes
  const callbackId = generateUniqueId();

  // set fallback data when no data is defined
  const sendData = data ?? {};

  // generate the message with the callbackId
  const messageData: ShopwareMessageSendData<MESSAGE_TYPE> = {
    _type: type,
    _data: sendData,
    _callbackId: callbackId,
  }

  // replace methods etc. so that they are working in JSON format
  serializeMessageData<MESSAGE_TYPE>(messageData)

  // convert message data to string for message sending
  const message = JSON.stringify(messageData);  

  return new Promise((resolve) => {
    const callbackHandler = function(event: MessageEvent<string>) {    
      if (typeof event.data !== 'string') {
        console.log('event.data', event.data)
        return;
      }

      let shopwareResponseData;
      // try to parse the json file
      try {
        shopwareResponseData = JSON.parse(event.data) as unknown;
      } catch {
        // fail silently when message is not a valid json file
        return;
      }

      // check if messageData is valid
      if (!isMessageResponseData<MESSAGE_TYPE>(shopwareResponseData)) {
        return;
      }

      // only execute when callbackId matches
      if (shopwareResponseData._callbackId !== callbackId) {
        return;
      }

      // only execute if response value exists
      if (!shopwareResponseData.hasOwnProperty('_response')) {
        return;
      }
      
      // remove event so that in only execute once
      window.removeEventListener('message', callbackHandler);

      // return the data
      resolve(shopwareResponseData._response);
    }

    window.addEventListener('message', callbackHandler);
    targetWindow 
        ? targetWindow.postMessage(message, window.parent.origin)
        : window.parent.postMessage(message, window.parent.origin);
  })
}

/**
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
export function handle<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
  (
    type: MESSAGE_TYPE,
    method: (data: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType']
    )
  : () => void
  {
  const handleListener = async function(event: MessageEvent<string>) {    
    if (typeof event.data !== 'string') {
      return;
    }

    let shopwareMessageData;

    // try to parse the json file
    try {
      shopwareMessageData = JSON.parse(event.data) as unknown;
    } catch {
      // fail silently when message is not a valid json file
      return;
    }

    // check if messageData is valid
    if (!isMessageData<MESSAGE_TYPE>(shopwareMessageData)) {
      return;
    }

    // check if messageData type matches the type argument
    if (shopwareMessageData._type !== type) {
      return;
    }

    // deserialize methods etc. so that they are callable in JS
    deserializeMessageData<MESSAGE_TYPE>(shopwareMessageData)

    const responseValue = await Promise.resolve(method(shopwareMessageData._data));

    const responseMessage: ShopwareMessageResponseData<MESSAGE_TYPE> = {
      _callbackId: shopwareMessageData._callbackId,
      _type: shopwareMessageData._type,
      _response: responseValue ?? null,
    }

    const stringifiedResponseMessage = JSON.stringify(responseMessage);

    if (event.source) {
      // if event source exists then send it back to original source
      event.source.postMessage(stringifiedResponseMessage, {
        // @ts-expect-error - event.source.origin is not correctly defined in TS
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        targetOrigin: event.source.origin ?? '*',
      });
    } else {
      // if no event source exists then it should send to same window
      window.postMessage(stringifiedResponseMessage, window.origin)
    }
  }

  // start listening directly
  window.addEventListener('message', handleListener);

  // return a cancel method
  return () => window.removeEventListener('message', handleListener);
}

/**
 * Function overloading for these two cases:
 * 
 * 1. case: createSender('reload', {})  ==> no option parameter required in usage
 * 2. case: createSender('redirect')  ==> option parameter required in usage
 * 
 * */
 export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
 (messageType: MESSAGE_TYPE, baseMessageOptions: MessageDataType<MESSAGE_TYPE>)
 :(messageOptions?: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]["responseType"]>
export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
 (messageType: MESSAGE_TYPE)
 :(messageOptions: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]["responseType"]>

export function createSender<MESSAGE_TYPE extends keyof ShopwareMessageTypes>
(messageType: MESSAGE_TYPE, baseMessageOptions?: MessageDataType<MESSAGE_TYPE>)
{
 return (messageOptions: MessageDataType<MESSAGE_TYPE>) => send(messageType, { ...baseMessageOptions, ...messageOptions});
}

export function createHandler<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE) {
 return (method: (data: MessageDataType<MESSAGE_TYPE>) => Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> | ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => handle(messageType, method);
}

/**
 * ----------------
 * INTERNAL HELPER FUNCTIONS
 * ----------------
 */

/**
 * check if the data is valid message data
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