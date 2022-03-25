import { send } from '../channel';
import type Criteria from './Criteria';
import type { ApiContext } from './_internals/EntityCollection';
import type EntityCollection from './_internals/EntityCollection';
import type { Entity } from './_internals/Entity';
import type { entityName } from '.';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (entityName: entityName) => ({
  search: (criteria: Criteria, context?: ApiContext): Promise<EntityCollection | null> => {
    return send('repositorySearch', { entityName, context, criteria });
  },
  get: (id: string, context?: ApiContext, criteria?: Criteria): Promise<Entity | null> => {
    return send('repositoryGet', { entityName, id, context, criteria });
  },
  save: (entity: Entity, context?: ApiContext): Promise<void | null> => {
    return send('repositorySave', { entityName, entity, context });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone: (entityId: string, context?: ApiContext, behavior?: any): Promise<unknown | null> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return send('repositoryClone', { entityName, entityId, context, behavior });
  },
  hasChanges: (entity: Entity): Promise<boolean | null> => {
    return send('repositoryHasChanges', { entityName, entity });
  },
  saveAll: (entities: EntityCollection, context?: ApiContext): Promise<unknown | null> => {
    return send('repositorySaveAll', { entityName, entities, context });
  },
  delete: (entityId: string, context?: ApiContext): Promise<void | null> => {
    return send('repositoryDelete', { entityName, entityId, context });
  },
  create: (context?: ApiContext, entityId?: string): Promise<Entity | null> => {
    return send('repositoryCreate', { entityName, entityId, context });
  },
});

export type repositoryGet = {
  responseType: Entity | null,
  entityName: entityName,
  id: string,
  context?: ApiContext,
  criteria?: Criteria,
}

export type repositorySearch = {
  responseType: EntityCollection,
  entityName: entityName,
  criteria?: Criteria,
  context?: ApiContext,
}

export type repositorySave = {
  responseType: void,
  entityName: entityName,
  entity: Entity,
  context?: ApiContext,
}

export type repositoryClone = {
  responseType: unknown,
  entityName: entityName,
  entityId: string,
  context?: ApiContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  behavior?: any,
}

export type repositoryHasChanges = {
  responseType: boolean,
  entityName: entityName,
  entity: Entity,
}

export type repositorySaveAll = {
  responseType: void,
  entityName: entityName,
  entities: EntityCollection,
  context?: ApiContext,
}

export type repositoryDelete = {
  responseType: void,
  entityName: entityName,
  entityId: string,
  context?: ApiContext,
}

export type repositoryCreate = {
  responseType: Entity,
  entityName: entityName,
  entityId?: string,
  context?: ApiContext,
}
