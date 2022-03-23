import { send } from '../channel';
import type Criteria from './Criteria';
import type { ApiContext } from './_internals/EntityCollection';
import type EntityCollection from './_internals/EntityCollection';
import type { Entity } from './_internals/Entity';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (entityName: string) => ({
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
  entityName: string,
  id: string,
  context?: ApiContext,
  criteria?: Criteria,
}

export type repositorySearch = {
  responseType: EntityCollection,
  entityName: string,
  criteria?: Criteria,
  context?: ApiContext,
}

export type repositorySave = {
  responseType: void,
  entityName: string,
  entity: Entity,
  context?: ApiContext,
}

export type repositoryClone = {
  responseType: unknown,
  entityName: string,
  entityId: string,
  context?: ApiContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  behavior?: any,
}

export type repositoryHasChanges = {
  responseType: boolean,
  entityName: string,
  entity: Entity,
}

export type repositorySaveAll = {
  responseType: void,
  entityName: string,
  entities: EntityCollection,
  context?: ApiContext,
}

export type repositoryDelete = {
  responseType: void,
  entityName: string,
  entityId: string,
  context?: ApiContext,
}

export type repositoryCreate = {
  responseType: Entity,
  entityName: string,
  entityId?: string,
  context?: ApiContext,
}
