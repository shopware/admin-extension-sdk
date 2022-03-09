import Criteria from './Criteria';
import Entity from './BaseEntity';

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

export default abstract class BaseEntityCollection extends Array<Entity> {
  abstract entity: string;

  abstract source: string;

  abstract context: ApiContext;

  abstract criteria: Criteria|null;

  abstract aggregations: string[]|null;

  abstract total: number|null;

  abstract first: () => Entity|null;

  abstract last: () => Entity|null;

  abstract remove: (id: string) => boolean;

  abstract has: (id: string) => boolean;

  abstract get: (id: string) => Entity|null;

  abstract getAt: (index: number) => Entity|null;

  abstract getIds: () => string[];

  abstract add: (e: Entity) => void;

  abstract addAt: (e: Entity, indexAt: number) => void;

  abstract moveItem: (oldIndex: number, newIndex: number) => Entity|null;
}
