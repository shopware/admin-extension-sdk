export function generateUniqueId(): string {
  return String(Date.now().toString(36) + Math.random().toString(36).substr(2));
}

/* eslint-disable */
export function traverseObject(this: any, traversableObject: any, processor: (parentEntry: any, key: string, value: any) => void) {
  for (let index in traversableObject) {
    const currentEntry = traversableObject[index];

    processor.apply(this, [traversableObject, index, currentEntry]);

    if (isObject(currentEntry)) {
      traverseObject(currentEntry, processor);
    }
  }
}

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