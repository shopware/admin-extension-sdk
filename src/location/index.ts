import { send } from '../channel';

function getLocationId():string|null {
  const params = new URLSearchParams(window.location.search);

  return params.get('location-id');
}

// TODO: add documentation
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
  const currentHeight = document.documentElement.scrollHeight;

  return send('locationUpdateHeight', {
    height: currentHeight,
    locationId: getLocationId(),
  });
};

// TODO: add startAutoResizer to update the height automatically
// TODO: add stopAutoResizer to stop the auto-update of the height

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