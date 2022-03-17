export function generateUniqueId(): string {
  return String(Date.now().toString(36) + Math.random().toString(36).substr(2));
}

/* eslint-disable */
export function isObject(value: unknown): value is any {
  return value !== null && typeof value === 'object';
}

export function getLocationId():string|null {
  const params = new URLSearchParams(window.location.search);

  return params.get('location-id');
}

export function getWindowSrc():string {
    const location = window.location as Location;
    const urlObject = new URL(location.pathname, location.origin);

    return urlObject.toString();
}

export function hasType(type: string, obj: any): boolean {
  return isObject(obj) && obj.__type__ && obj.__type__ === type;
}