import { send, handle, createSender, createHandler } from './channel';

describe('Test the channel bridge from iFrame to admin', () => {
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

  it('should get value back from admin', (done) => {
    const PAGE_TITLE = 'Awesome page title';

    const removeListener = handle('getPageTitle', () => {
      return PAGE_TITLE;
    })

    send('getPageTitle', {}).then((pageTitle) => {
      expect(pageTitle).toEqual(PAGE_TITLE);

      removeListener();
      done();
    })
  });

  it('should create a sender and handler with required options', (done) => {
    const getPageTitle = createSender('getPageTitle');
    const handlePageTitle = createHandler('getPageTitle');

    const PAGE_TITLE = 'Awesome page title';

    const removeListener = handlePageTitle(() => {
      return PAGE_TITLE;
    })

    getPageTitle({}).then((pageTitle) => {
      expect(pageTitle).toEqual(PAGE_TITLE);

      removeListener();
      done();
    })
  });

  it('should create a sender and handler with optional options', (done) => {
    const reload = createSender('windowReload', {});
    const handleReload = createHandler('windowReload');

    const removeListener = handleReload(() => {})

    reload().then(() => {      
      removeListener();

      done();
    })
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

  it('should convert functions in options and call them on the handler side with arguments and return value', (done) => {
    const methodMock = jest.fn((firstNumber, secondNumber) => {
      return firstNumber * secondNumber;
    });
    const sendMultiply = createSender('_multiply');
    const handleMultiply = createHandler('_multiply');

    const removeListener = handleMultiply(({ firstNumber, secondNumber }) => {
      return Promise.resolve(methodMock(firstNumber, secondNumber))
    })

    sendMultiply({ firstNumber: 7, secondNumber: 8 })
      .then((result) => {
        expect(result).toEqual(56);

        removeListener();
        done();
      })
  });
});