import { send, on } from './index';

declare global {
  interface Window {
    send: typeof send
    on: typeof on
  }
}

describe('Test the communication between app and admin', () => {
  it('should send "reload" command to the admin', (done) => {
    const removeListener = on('reload', (result) => {
      expect(result).toEqual({});
      
      removeListener();
      done();
    })

    send('reload', {});
  });

  it('should get value back from admin', (done) => {
    const PAGE_TITLE = 'Awesome page title';

    const removeListener = on('getPageTitle', () => {
      return PAGE_TITLE;
    })

    send('getPageTitle', {}).then((pageTitle) => {
      expect(pageTitle).toEqual(PAGE_TITLE);

      removeListener();
      done();
    })
  });
});