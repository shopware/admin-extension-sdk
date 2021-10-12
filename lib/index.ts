import * as sendTypes from './send-types';

export {sendTypes};

/**
 * This type contains the data of the type without the responseType
 * @internal
 */
export type SendDataType<TYPE extends keyof ShopwareSendTypes> = Omit<ShopwareSendTypes[TYPE], 'responseType'>;

/**
 * This is the structure of the data which will be send with {@link send}
 * @internal
 */
export type ShopwareMessageSendData<SEND_TYPE extends keyof ShopwareSendTypes> = {
  type: SEND_TYPE,
  data: SendDataType<SEND_TYPE>,
  callbackId: string
}

/**
 * This is the structure of the data which will be send back when the admin gives a response
 * @internal
 */
export type ShopwareMessageResponseData<SEND_TYPE extends keyof ShopwareSendTypes> = {
  type: SEND_TYPE,
  response: ShopwareSendTypes[SEND_TYPE]['responseType'],
  callbackId: string
}

/**
 * Contains all shopware {@link send-types}.
 * @internal
 */
 export type ShopwareSendTypes = {
  getPageTitle: sendTypes.getPageTitle,
  createAlert: sendTypes.createAlert,
  redirect: sendTypes.redirect,
  reload: sendTypes.reload,
}

/**
 * With this method you can send actions:
 * 
 * ```javascript
 *  send('redirect', {
 *    url: 'https://www.shopware.com',
 *    newTab: true,
 *  })
 * ```
 * 
 * or you can request data:
 * ```javascript
 * send('getPageTitle', {}).then((pageTitle) => {
 *   console.log(pageTitle)
 * })
 * ```
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param data The matching data for the type
 * @returns A promise with the response data in the given responseType 
 */
export function send<SEND_TYPE extends keyof ShopwareSendTypes>(type: SEND_TYPE, data: SendDataType<SEND_TYPE>): Promise<ShopwareSendTypes[SEND_TYPE]['responseType']> {
  // generate a unique callback ID. This here is only for simple demonstration purposes
  const callbackId = String(Math.floor(Math.random() * Date.now()));

  // set fallback data when no data is defined
  const sendData = data ?? {};

  // generate the message with the callbackId
  const messageData: ShopwareMessageSendData<SEND_TYPE> = {
    type,
    data: sendData,
    callbackId: callbackId
  }
  const message = JSON.stringify(messageData);

  return new Promise((resolve) => {
    const callbackHandler = function(event: MessageEvent) {      
      if (typeof event.data !== 'string') {
        return;
      }

      let data;
      // try to parse the json file
      try {
        data = JSON.parse(event.data);
      } catch {
        // fail silently when message is not a valid json file
        return;
      }

      // only execute when callbackId matches
      if (data.callbackId !== callbackId) {
        return;
      }

      // only execute if response value exists
      if (!data.hasOwnProperty('response')) {
        return;
      }
      
      // remove event so that in only execute once
      window.removeEventListener('message', callbackHandler);

      // return the data
      resolve(data.response);
    }

    window.addEventListener('message', callbackHandler);
    window.parent.postMessage(message, '*');
  })
}

/**
 * 
 * @param type Choose a type of action from the {@link send-types}
 * @param method This method should return the response value
 * @returns The return value is a cancel function to stop listening to the events
 */
export function on<SEND_TYPE extends keyof ShopwareSendTypes>(type: SEND_TYPE, method: (data: SendDataType<SEND_TYPE>) => ShopwareSendTypes[SEND_TYPE]['responseType']): () => void {
  const onListener = function(event: MessageEvent) {    
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
    if (shopwareMessageData.type !== type) {
      return;
    }

    const responseMessage: ShopwareMessageResponseData<any> = {
      callbackId: shopwareMessageData.callbackId,
      type: shopwareMessageData.type,
      response: method(shopwareMessageData.data) ?? null
    }

    event.source?.postMessage(JSON.stringify(responseMessage), {
      targetOrigin: '*'
    });
  }

  // start listening directly
  window.addEventListener('message', onListener);

  // return a cancel method
  return () => window.removeEventListener('message', onListener);
}

function isMessageData(eventData: object): eventData is ShopwareMessageSendData<any> {
  const shopwareMessageData = eventData as ShopwareMessageSendData<any>;

  return shopwareMessageData.type
         && shopwareMessageData.data
         && shopwareMessageData.callbackId;
}