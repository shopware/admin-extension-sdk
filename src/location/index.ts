// TODO: add documentation
export const is = (location: string): boolean => {
  const params = new URLSearchParams(window.location.search);

  return params.get('location-id') === location;
}

export const MAIN_HIDDEN = 'sw-main-hidden';