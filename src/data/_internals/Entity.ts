import cloneDeep from 'lodash/cloneDeep';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let setterMethod = (draft: Record<any, any>, property: string, value: unknown): void => {
  draft[property] = value;
};

/**
 * @internal
 */
export function assignSetterMethod(newSetterMethod: (draft: unknown, property: string, value: unknown) => void): void {
  setterMethod = newSetterMethod;
}

type Entities = EntitySchema.Entities;

interface EntityOptions<EntityName extends keyof Entities> {
    originData?: Entities[EntityName],
    isDirty?: boolean,
    isNew?: boolean,
}

class EntityClass<EntityName extends keyof Entities> {
  id: string;

  _origin: Entities[EntityName];

  _entityName: EntityName;

  _draft: Entities[EntityName];

  _isDirty: boolean;

  _isNew: boolean;

  constructor(
    id: string,
    entityName: EntityName,
    data: Entities[EntityName],
    options: EntityOptions<EntityName> = {},
  ) {
    this.id = id;
    this._origin = options.originData ? cloneDeep(options.originData) : cloneDeep(data);
    this._entityName = entityName;
    this._draft = data;
    this._isDirty = options.isDirty ?? false;
    this._isNew = options.isNew ?? false;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    // @ts-expect-error - the proxy contains the draft and the entity class
    return new Proxy(this._draft, {
      get(_, property): unknown {
        if (property in that._draft) {
          // @ts-expect-error - the proxy contains the draft and the entity class
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
   * Identifier method for the entity class. Needed when some reactive data layer (Vue) converts the EntityClass to a
   * plain object. With this identifier method we can (de)serialie it back to the correct entity class.
   */
  __identifier__(): string {
    return 'Entity';
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
  getOrigin(): Entities[EntityName] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._origin;
  }

  /**
   * Allows to access the draft value. The draft value contains all local changes of the entity
   */
  getDraft(): Entities[EntityName] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._draft;
  }

  /**
   * Allows to access the entity name. The entity name is used as unique identifier `product`, `media`, ...
   */
  getEntityName(): string {
    return this._entityName as string;
  }
}

type EntityType<EntityName extends keyof Entities> = Entities[EntityName] & EntityClass<EntityName>;

interface EntityConstructor {
  new<EntityName extends keyof Entities>(
    id: string,
    entityName: EntityName,
    data: Entities[EntityName],
    options?: EntityOptions<EntityName>,
  ): EntityType<EntityName>,
}

const Entity = function Entity<EntityName extends keyof Entities>(
  id: string,
  entityName: EntityName,
  data: Entities[EntityName],
  options?: EntityOptions<EntityName>,
) {
  return new EntityClass(id, entityName, data, options);
} as unknown as EntityConstructor;

export default Entity;
export type { EntityType as Entity };
