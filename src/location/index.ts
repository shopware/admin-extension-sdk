import { send } from '../channel';
import { getLocationId } from '../_internals/utils';

// TODO: add documentation (+ "body {overflow: hidden}" notice for views)
export const is = (location: string): boolean => {
  return getLocationId() === location;
};

export const get = (): string => {
  return getLocationId() ?? '';
};

export const isIframe = (): boolean => {
  return window !== window.parent;
};

export const updateHeight = (height?: number): Promise<void|null> => {
  if (height) {
    return send('locationUpdateHeight', {
      height,
      locationId: getLocationId(),
    });
  }

  // If no height is defined then send the current document height
  const currentHeight = document.documentElement.offsetHeight;

  return send('locationUpdateHeight', {
    height: currentHeight,
    locationId: getLocationId(),
  });
};

let resizeObserver: ResizeObserver | null = null;

export const startAutoResizer = ():void => {
  // Create an Observer instance
  resizeObserver = new ResizeObserver(() => {
    void updateHeight();
  });

  // Start observing a DOM node
  resizeObserver.observe(document.body);
};

export const stopAutoResizer = ():void => {
  if (resizeObserver) {
    resizeObserver.unobserve(document.body);
    resizeObserver.disconnect();
  }
};

export const updateUrl = (url: URL): Promise<void|null> => {
  return send('locationUpdateUrl', {
    hash: url.hash,
    pathname: url.pathname,
    searchParams: [...url.searchParams.entries()],
    locationId: getLocationId(),
  });
};

let urlUpdateInterval: null|number = null;

export const startAutoUrlUpdater = ():void => {
  let prevUrl: string|undefined = undefined;

  if (urlUpdateInterval) {
    clearInterval(urlUpdateInterval);
  }

  urlUpdateInterval = setInterval(() => {
    const currUrl = window.location.href;

    if (currUrl !== prevUrl) {
      prevUrl = currUrl;
      void updateUrl(new URL(currUrl));
    }
  }, 50) as unknown as number;
};

export const stopAutoUrlUpdater = ():void => {
  if (urlUpdateInterval) {
    clearInterval(urlUpdateInterval);
  }
};

export const MAIN_HIDDEN = 'sw-main-hidden';

export type locationUpdateHeight = {
  responseType: void,

  /**
   * The height of the iFrame
   */
  height: number,

  /**
   * The locationID of the current element
   */
  locationId: string | null,
}

export type locationUpdateUrl = {
  responseType: void,

  /**
   * The hash of the url
   * 
   * @example
   * #/sw/dashboard
   */
  hash: string,

  /**
   * The pathname of the url
   *
   * @example
   * /
   */
  pathname: string,

  /**
   * The searchParams of the url
   * 
   * @example
   * [
   *  ['foo', 'bar'],
   *  ['baz', 'qux'],
   * ]
   */
  searchParams: Array<[string, string]>,

  /**
   * The locationID of the current element
   */
  locationId: string | null,
}
