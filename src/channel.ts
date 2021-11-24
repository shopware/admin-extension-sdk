import { ShopwareMessageTypes } from './messages.types';

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
  _callbackId: string
}

/**
 * This is the structure of the data which will be send back when the admin gives a response
 * @internal
 */
export type ShopwareMessageResponseData<MESSAGE_TYPE extends keyof ShopwareMessageTypes> = {
  _type: MESSAGE_TYPE,
  _response: ShopwareMessageTypes[MESSAGE_TYPE]['responseType'],
  _callbackId: string
}

/**
 * With this method you can send actions or you can request data:
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param data The matching data for the type
 * @returns A promise with the response data in the given responseType 
 */
export function send<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(type: MESSAGE_TYPE, data: MessageDataType<MESSAGE_TYPE>): Promise<ShopwareMessageTypes[MESSAGE_TYPE]['responseType']> {
  // generate a unique callback ID. This here is only for simple demonstration purposes
  const callbackId = String(Math.floor(Math.random() * Date.now()));

  // set fallback data when no data is defined
  const sendData = data ?? {};

  // generate the message with the callbackId
  const messageData: ShopwareMessageSendData<MESSAGE_TYPE> = {
    _type: type,
    _data: sendData,
    _callbackId: callbackId
  }
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
        shopwareResponseData = JSON.parse(event.data);
      } catch {
        // fail silently when message is not a valid json file
        return;
      }

      // check if messageData is valid
      if (!isMessageResponseData(shopwareResponseData)) {
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
    window.parent.postMessage(message, window.parent.origin);
  })
}

/**
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
export function handle<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(type: MESSAGE_TYPE, method: (data: MessageDataType<MESSAGE_TYPE>) => ShopwareMessageTypes[MESSAGE_TYPE]['responseType']): () => void {
  const handleListener = function(event: MessageEvent<string>) {    
    if (typeof event.data !== 'string') {
      return;
    }

    let shopwareMessageData;

    // try to parse the json file
    try {
      shopwareMessageData = JSON.parse(event.data);
    } catch {
      // fail silently when message is not a valid json file
      return;
    }

    // check if messageData is valid
    if (!isMessageData(shopwareMessageData)) {
      return;
    }

    // check if messageData type matches the type argument
    if (shopwareMessageData._type !== type) {
      return;
    }

    const responseMessage: ShopwareMessageResponseData<any> = {
      _callbackId: shopwareMessageData._callbackId,
      _type: shopwareMessageData._type,
      _response: method(shopwareMessageData._data) ?? null
    }

    const stringifiedResponseMessage = JSON.stringify(responseMessage);

    if (event.source) {
      // if event source exists then send it back to original source
      event.source.postMessage(stringifiedResponseMessage, {
        // @ts-expect-error - event.source.origin is not correctly defined in TS
        targetOrigin: event.source.origin ?? '*'
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

function isMessageData(eventData: object): eventData is ShopwareMessageSendData<any> {
  const shopwareMessageData = eventData as ShopwareMessageSendData<any>;

  return shopwareMessageData._type
         && shopwareMessageData._data
         && shopwareMessageData._callbackId;
}

function isMessageResponseData(eventData: object): eventData is ShopwareMessageResponseData<any> {
  const shopwareMessageData = eventData as ShopwareMessageResponseData<any>;

  return shopwareMessageData._type
         && shopwareMessageData.hasOwnProperty('_response')
         && shopwareMessageData._callbackId;
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
  return (method: (data: MessageDataType<MESSAGE_TYPE>) => ShopwareMessageTypes[MESSAGE_TYPE]['responseType']) => handle(messageType, method);
}