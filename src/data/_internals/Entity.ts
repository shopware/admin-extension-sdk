import { cloneDeep } from 'lodash-es';

type draft = {
  [key: string]: unknown,
};

let setterMethod = (draft: draft, property: string, value: unknown): void => {
  draft[property] = value;
};

/**
 * @internal
 */
export function assignSetterMethod(newSetterMethod: (draft: draft, property: string, value: unknown) => void): void {
  setterMethod = newSetterMethod;
}

export default class Entity {
  id: string;

  _origin: unknown;

  _entityName: string;

  _draft: {[key: string]: unknown};

  _isDirty: boolean;

  _isNew: boolean;

  constructor(id: string, entityName: string, data: draft) {
    this.id = id;
    this._origin = cloneDeep(data);
    this._entityName = entityName;
    this._draft = data;
    this._isDirty = false;
    this._isNew = false;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    // @ts-expect-error Proxy is not an instance of this class
    return new Proxy(this._draft, {
      get(_, property): unknown {
        if (property in that._draft) {
          // @ts-expect-error Its unsure if the property exists on the this alias
          return that._draft[property];
        }

        // @ts-expect-error Its unsure if the property exists on the this alias
        return that[property];
      },

      set(_, property, value): boolean {
        setterMethod(that._draft, property as string, value);
        that._isDirty = true;

        return true;
      },
    });
  }

  /**
   * Marks the entity as new. New entities will be provided as create request to the server
   */
  markAsNew(): void {
    this._isNew = true;
  }

  /**
   * Allows to check if the entity is a new entity and should be provided as create request to the server
   */
  isNew(): boolean {
    return this._isNew;
  }

  /**
   * Allows to check if the entity changed
   */
  getIsDirty(): boolean {
    return this._isDirty;
  }

  /**
   * Allows access the origin entity value. The origin value contains the server values
   */
  getOrigin(): unknown {
    return this._origin;
  }

  /**
   * Allows to access the draft value. The draft value contains all local changes of the entity
   */
  getDraft(): unknown {
    return this._draft;
  }

  /**
   * Allows to access the entity name. The entity name is used as unique identifier `product`, `media`, ...
   */
  getEntityName(): string {
    return this._entityName;
  }
}
