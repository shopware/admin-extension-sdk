import Criteria from '../Criteria';
import type { Entity } from './Entity';

type ApiAuthToken = {
    access: string,
    expiry: number,
    refresh: string,
}

export interface ApiContext {
    apiPath: null | string,
    apiResourcePath: null | string,
    assetsPath: null | string,
    authToken: null | ApiAuthToken,
    basePath: null | string,
    pathInfo: null | string,
    inheritance: null | boolean,
    installationPath: null | string,
    languageId: null | string,
    language: null | {
        name: string,
    },
    apiVersion: null | string,
    liveVersionId: null | string,
    systemLanguageId: null | string,
}

type Entities = EntitySchema.Entities;

export default class EntityCollection<EntityName extends keyof Entities> extends Array<Entity<EntityName>> {
  entity: EntityName;

  source: string;

  context: ApiContext;

  criteria: Criteria|null;

  aggregations: string[]|null;

  total: number|null;

  first: () => Entity<EntityName>|null;

  last: () => Entity<EntityName>|null;

  remove: (id: string) => boolean;

  has: (id: string) => boolean;

  get: (id: string) => Entity<EntityName>|null;

  getAt: (index: number) => Entity<EntityName>|null;

  getIds: () => string[];

  add: (e: Entity<EntityName>) => void;

  addAt: (e: Entity<EntityName>, indexAt: number) => void;

  moveItem: (oldIndex: number, newIndex: number) => Entity<EntityName>|null;

  __identifier__: () => string;

  constructor(
    source: string,
    entityName: EntityName,
    context: ApiContext,
    criteria: Criteria|null = null,
    entities: Entity<EntityName>[] = [],
    total: number|null = null,
    aggregations: string[]|null = null,
  ) {
    super();

    this.entity = entityName;
    this.source = source;
    this.context = context;
    this.criteria = criteria;
    this.aggregations = aggregations;
    this.total = total;

    this.push(...entities);

    /**
     * Identifier method for the EntityCollection class. Needed when some reactive data layer (Vue) converts the EntityCollection to a
     * plain array. With this identifier method we can (de)serialie it back to the correct EntityCollection.
     */
    this.__identifier__ = (): string => {
      return 'EntityCollection';
    };

    /**
     * Returns the first item of the collection.
     * Returns null if the collection is empty
     */
    this.first = function firstEntityOfCollection(): Entity<EntityName>|null {
      if (this.length <= 0) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this[0];
    };

    /**
     * Returns the last item of the collection.
     * Returns null if the collection is empty.
     */
    this.last = function lastEntityOfCollection(): Entity<EntityName>|null {
      if (this.length <= 0) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this[this.length - 1];
    };

    /**
     * Removes an entity from the collection. The entity is identified by the provided id
     * Returns true if the entity removed, false if the entity wasn't found
     */
    this.remove = function removeEntityFromCollection(id): boolean {
      const itemIndex = this.findIndex(i => i.id === id);

      if (itemIndex < 0) {
        return false;
      }

      this.splice(itemIndex, 1);
      return true;
    };

    /**
     * Checks if the provided id is inside the collection
     */
    this.has = function hasEntityInCollection(id: string): boolean {
      return this.some(i => i.id === id);
    };

    /**
     * Returns the entity for the provided id, null if the entity is not inside the collection
     */
    this.get = function getEntityByIdOfCollection(id: string): Entity<EntityName>|null {
      const item = this.find(i => i.id === id);

      if (typeof item !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return item;
      }
      return null;
    };

    /**
     * Returns the entity at the given index position.
     */
    this.getAt = function getEntityAtIndexOfCollection(index: number): Entity<EntityName>|null {
      const item = this[index];

      if (typeof item !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return item;
      }
      return null;
    };

    /**
     * Returns all ids of the internal entities
     */
    this.getIds = function getEntityIdsOfCollection(): string[] {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.map(i => i.id);
    };

    /**
     * Adds a new item to the collection
     */
    this.add = function addEntityToCollection(e: Entity<EntityName>): void {
      this.push(e);
    };

    /**
     * Adds an entity to the collection at the given position.
     */
    this.addAt = function addEntityAtIndexOfCollection(e: Entity<EntityName>, insertIndex: number): void {
      if (typeof insertIndex === 'undefined') {
        this.add(e);
        return;
      }

      this.splice(insertIndex, 0, e);
    };

    /**
     * Move an item of the collection from an old index to a new index position.
     */
    this.moveItem = function moveEntityToNewIndexInCollection(
      oldIndex: number,
      newIndex: number|null = null,
    ): Entity<EntityName>|null {
      if (newIndex === null) {
        newIndex = this.length;
      }

      if (oldIndex < 0 || oldIndex >= this.length) {
        return null;
      }

      if (newIndex === oldIndex) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.getAt(oldIndex);
      }

      const movedItem = this.find((_, index) => index === oldIndex);
      if (typeof movedItem === 'undefined') {
        return null;
      }

      const remainingItems = this.filter((_, index) => index !== oldIndex);

      const orderedItems = [
        ...remainingItems.slice(0, newIndex),
        movedItem,
        ...remainingItems.slice(newIndex),
      ];

      this.splice(0, this.length, ...orderedItems);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return movedItem;
    };

    /**
     * Filters an EntityCollection and preserves its type. Resets criteria and total since it would mismatch.
     */
    // @ts-expect-error Overloads Array function therefore types mismatch
    this.filter = function filterEntityCollection(
      callback: (e: Entity<EntityName>, index: number) => boolean,
      scope: unknown,
    ): EntityCollection<EntityName> {
      const filtered = (Object.getPrototypeOf(this) as EntityCollection<EntityName>)
        .filter.call(this, callback, scope);
      return new EntityCollection(
        this.source,
        this.entity,
        this.context,
        this.criteria,
        filtered,
        this.total,
        this.aggregations,
      );
    };
  }

  /**
   * Returns a new collection from given one with
   */
  static fromCollection<StaticEntityName extends keyof Entities>(
    collection: EntityCollection<StaticEntityName>,
  ): EntityCollection<StaticEntityName> {
    return new EntityCollection(
      collection.source,
      collection.entity,
      collection.context,
      collection.criteria === null ? collection.criteria : Criteria.fromCriteria(collection.criteria),
      collection,
      collection.total,
      collection.aggregations,
    );
  }
}
