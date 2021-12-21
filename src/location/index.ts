import { send } from '../channel';

// TODO: add documentation
export const is = (location: string): boolean => {
  const params = new URLSearchParams(window.location.search);

  return params.get('location-id') === location;
}

export const updateHeight = (height?: number): Promise<void|null> => {
  if (height) {
    return send('locationUpdateHeight', { height });
  }

  // if no height is defined then send the current document height
  const currentHeight = document.documentElement.scrollHeight;
  return send('locationUpdateHeight', { height: currentHeight });
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
}