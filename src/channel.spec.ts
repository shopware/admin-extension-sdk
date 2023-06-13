import flushPromises from 'flush-promises';
import type {
  send as sendType,
  handle as handleType,
  createSender as createSenderType,
  createHandler as createHandlerType,
  subscribe as subscribeType,
  publish as publishType,
  setExtensions as setExtensionsType,
} from './channel';
import MissingPrivilegesError from './privileges/missing-privileges-error';

// Channel send timout + 1000
jest.setTimeout(8000);

let send: typeof sendType;
let handle: typeof handleType;
let createSender: typeof createSenderType;
let createHandler: typeof createHandlerType;
let subscribe: typeof subscribeType;
let publish: typeof publishType;
let setExtensions: typeof setExtensionsType;

describe('Test the channel bridge from iFrame to admin', () => {
  beforeAll(async () => {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin === '') {
        event.stopImmediatePropagation();
        const eventWithOrigin: MessageEvent = new MessageEvent('message', {
          data: event.data,
          origin: window.location.href,
        });
        window.dispatchEvent(eventWithOrigin);
      }
    });

    const channel = await import('./channel');
    send = channel.send;
    handle = channel.handle;
    createSender = channel.createSender;
    createHandler = channel.createHandler;
    subscribe = channel.subscribe;
    publish = channel.publish;
    setExtensions = channel.setExtensions;

    setExtensions({
      'test-extension': {
        baseUrl: 'http://localhost',
        permissions: {},
      },
    });
  });

  beforeEach(() => {
    // reset extensions
    setExtensions({});
  })

  it('should send "reload" command to the admin', (done) => {
    const removeListener = handle('windowReload', (result) => {
      expect(result).toEqual({});

      removeListener();
      done();
    })

    send('windowReload', {});
  });

  it('should send "reload" command to the admin also without options', (done) => {
    const removeListener = handle('windowReload', (result) => {
      expect(result).toEqual({});

      removeListener();
      done();
    })

    // safety check if non-ts user aren't providing options
    // @ts-expect-error
    send('windowReload');
  });

  it('should get value back from admin', async () => {
    const PAGE_TITLE = 'Awesome page title';

    const removeListener = handle('getPageTitle', () => {
      return PAGE_TITLE;
    })

    const pageTitle = await send('getPageTitle', {})
    expect(pageTitle).toEqual(PAGE_TITLE);

    removeListener();
  });

  it('should create a sender and handler with required options', async () => {
    const getPageTitle = createSender('getPageTitle');
    const handlePageTitle = createHandler('getPageTitle');

    const PAGE_TITLE = 'Awesome page title';

    const removeListener = handlePageTitle(() => {
      return PAGE_TITLE;
    })

    const pageTitle = await getPageTitle({})
    expect(pageTitle).toEqual(PAGE_TITLE);

    removeListener();
  });

  it('should create a sender and handler with optional options', async () => {
    const reload = createSender('windowReload', {});
    const handleReload = createHandler('windowReload');

    const removeListener = handleReload(() => {})

    await reload();

    removeListener();
  });

  it('should convert functions in options and call them on the handler side', (done) => {
    const buttonMethodMock = jest.fn(() => {});
    const dispatchNotification = createSender('notificationDispatch');
    const handleNotification = createHandler('notificationDispatch');

    const removeListener = handleNotification(async ({ actions }) => {
      if (!actions || actions?.length <= 0) {
        fail('The notification handler does not get any actions from the sender');
        return;
      }

      const firstAction = actions[0];

      if(!firstAction.method) {
        fail('"method" in the firstAction is undefined');
      }

      expect(typeof firstAction.method).toBe('function');

      expect(buttonMethodMock).toHaveBeenCalledTimes(0);
      await firstAction.method();
      expect(buttonMethodMock).toHaveBeenCalledTimes(1);
    })

    dispatchNotification({
      title: 'Notification with action',
      message: 'The action should contain a callable method',
      actions: [
        {
          label: 'Button with method',
          method: () => buttonMethodMock()
        }
      ]
    }).then(() => {
      removeListener();

      done();
    })
  });

  it('should convert functions in options and call them on the handler side with arguments and return value', async () => {
    const methodMock = jest.fn((firstNumber, secondNumber) => {
      return firstNumber * secondNumber;
    });
    const sendMultiply = createSender('_multiply');
    const handleMultiply = createHandler('_multiply');

    const removeListener = handleMultiply(({ firstNumber, secondNumber }) => {
      return Promise.resolve(methodMock(firstNumber, secondNumber))
    })

    const result = await sendMultiply({ firstNumber: 7, secondNumber: 8 })
    expect(result).toEqual(56);

    removeListener();
  });

  it('should get data from published messages when subscribed', async () => {
    const localeMethodMock = jest.fn();
    const fallbackLocaleMethodMock = jest.fn();

    const removeSubscription = subscribe('contextLocale', ({ locale, fallbackLocale }) => {
      localeMethodMock(locale);
      fallbackLocaleMethodMock(fallbackLocale);
    })

    expect(localeMethodMock).toHaveBeenCalledTimes(0);
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(0);

    publish('contextLocale', {
      locale: 'en-GB',
      fallbackLocale: 'en-GB',
    })

    await flushPromises();

    expect(localeMethodMock).toHaveBeenCalledTimes(1);
    expect(localeMethodMock).toHaveBeenLastCalledWith('en-GB');
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(1);
    expect(fallbackLocaleMethodMock).toHaveBeenLastCalledWith('en-GB');

    publish('contextLocale', {
      locale: 'de-DE',
      fallbackLocale: 'en-GB',
    })

    await flushPromises();

    expect(localeMethodMock).toHaveBeenCalledTimes(2);
    expect(localeMethodMock).toHaveBeenLastCalledWith('de-DE');
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(2);
    expect(fallbackLocaleMethodMock).toHaveBeenLastCalledWith('en-GB');

    removeSubscription();

    publish('contextLocale', {
      locale: 'nl-NL',
      fallbackLocale: 'en-GB',
    })

    await flushPromises();

    expect(localeMethodMock).toHaveBeenCalledTimes(2);
    expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(2);
  });

  it('should reject send with missing privileges', () => {
    send('_privileges', {}).catch(e => {
      const expectedError = new MissingPrivilegesError('_privileges', ['additional:not_entity_related', 'create:user', 'read:user', 'update:user', 'delete:user']);

      expect(e.message).toEqual(expectedError.message)
    })
  });

  it('should not call handle callback with missing extensions', () => {
    const callback = jest.fn();
    const removeHandle = handle('_privileges', callback)

    // Simulate a postMessage call from an iFrame
    window.dispatchEvent(new Event('message'))

    removeHandle();

    expect(callback).toHaveBeenCalledTimes(0)
  });

  it('should not call handle callback with missing privileges', () => {
    const url = 'http://example.com';
    const callback = jest.fn();
    // change the extensions for this test
    setExtensions({});
    const removeHandle = handle('_privileges', callback, )

    const event = new Event('message');

    // Simulate a postMessage call from an iFrame with a none registered origin
    window.dispatchEvent(event)

    // Simulate a postMessage call from an iFrame
    // @ts-expect-error
    event.origin = url;
    window.dispatchEvent(event)

    removeHandle();

    expect(callback).toHaveBeenCalledTimes(0)
  });
});
