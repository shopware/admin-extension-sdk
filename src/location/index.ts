import { send } from '../channel';
import { getLocationId } from '../_internals/utils';



// TODO: add documentation (+ "body {overflow: hidden}" notice for views)
export const is = (location: string): boolean => {
  return getLocationId() === location;
}

export const updateHeight = (height?: number): Promise<void|null> => {
  if (height) {
    return send('locationUpdateHeight', {
      height,
      locationId: getLocationId(),
    });
  }

  // if no height is defined then send the current document height
  const currentHeight = document.documentElement.offsetHeight;

  return send('locationUpdateHeight', {
    height: currentHeight,
    locationId: getLocationId(),
  });
};

let resizeObserver: ResizeObserver | null = null;

export const startAutoResizer = ():void => {
  // create an Observer instance
  resizeObserver = new ResizeObserver(() => {
    void updateHeight();
  })

  // start observing a DOM node
  resizeObserver.observe(document.body)
}

export const stopAutoResizer = ():void => {
  if (resizeObserver) {
    resizeObserver.unobserve(document.body);
    resizeObserver.disconnect();
  }
}

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