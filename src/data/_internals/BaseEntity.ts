export default abstract class BaseEntity {
  abstract id: string;

  abstract _origin: unknown;

  abstract _entityName: string;

  abstract _draft: {[key: string]: unknown};

  abstract _isDirty: boolean;

  abstract _isNew: boolean;

  /**
   * Marks the entity as new. New entities will be provided as create request to the server
   */
  abstract markAsNew(): void

  /**
   * Allows to check if the entity is a new entity and should be provided as create request to the server
   */
  abstract isNew(): boolean

  /**
   * Allows to check if the entity changed
   */
  abstract getIsDirty(): boolean

  /**
   * Allows access the origin entity value. The origin value contains the server values
   */
  abstract getOrigin(): unknown

  /**
   * Allows to access the draft value. The draft value contains all local changes of the entity
   */
  abstract getDraft(): unknown

  /**
   * Allows to access the entity name. The entity name is used as unique identifier `product`, `media`, ...
   */
  abstract getEntityName(): string
}
