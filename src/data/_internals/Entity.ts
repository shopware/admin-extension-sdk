import cloneDeep from 'lodash/cloneDeep';

export interface draft  {
  [key: string]: unknown,
}

let setterMethod = (draft: draft, property: string, value: unknown): void => {
  draft[property] = value;
};

/**
 * @internal
 */
export function assignSetterMethod(newSetterMethod: (draft: draft, property: string, value: unknown) => void): void {
  setterMethod = newSetterMethod;
}

interface EntityOptions {
  originData?: draft,
  isDirty?: boolean,
  isNew?: boolean,
}

class EntityClass {
  id: string;

  _origin: draft;

  _entityName: string;

  _draft: {[key: string]: unknown};

  _isDirty: boolean;

  _isNew: boolean;

  constructor(id: string, entityName: string, data: draft, options: EntityOptions = {}) {
    this.id = id;
    this._origin = options.originData ? cloneDeep(options.originData) : cloneDeep(data);
    this._entityName = entityName;
    this._draft = data;
    this._isDirty = options.isDirty ?? false;
    this._isNew = options.isNew ?? false;
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
  getOrigin(): draft {
    return this._origin;
  }

  /**
   * Allows to access the draft value. The draft value contains all local changes of the entity
   */
  getDraft(): draft {
    return this._draft;
  }

  /**
   * Allows to access the entity name. The entity name is used as unique identifier `product`, `media`, ...
   */
  getEntityName(): string {
    return this._entityName;
  }
}

/* eslint-disable */
type EntityType<DATA extends Record<string, unknown>> = DATA & EntityClass & Record<string, any>;

const Entity = function EntityConstructor(id: string, entityName: string, data: draft, options?: EntityOptions) {
  return new EntityClass(id, entityName, data, options);
} as any as { new<DATA extends draft>(id: string, entityName: string, data: DATA, options?: EntityOptions): EntityType<DATA> }

export default Entity;
export type Entity = EntityClass;
