import { send, handle, createSender, createHandler } from './channel';

describe('Test the channel bridge from iFrame to admin', () => {
  it('should send "reload" command to the admin', (done) => {
    const removeListener = handle('reload', (result) => {
      expect(result).toEqual({});
      
      removeListener();
      done();
    })

    send('reload', {});
  });

  it('should send "reload" command to the admin also without options', (done) => {
    const removeListener = handle('reload', (result) => {
      expect(result).toEqual({});
      
      removeListener();
      done();
    })

    // safety check if non-ts user aren't providing options
    // @ts-expect-error
    send('reload');
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
    const reload = createSender('reload', {});
    const handleReload = createHandler('reload');

    const removeListener = handleReload(() => {})

    reload().then(() => {      
      removeListener();

      done();
    })
  });
});