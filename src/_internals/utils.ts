export function generateUniqueId(): string {
  return String(Math.floor(Math.random() * Date.now()));
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