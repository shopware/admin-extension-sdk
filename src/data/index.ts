import { createHandler, createSender, subscribe as createSubscriber } from '../channel';
import Criteria from './Criteria';
import Entity from './_internals/Entity';
import EntityCollection from './_internals/EntityCollection';
import repository from './repository';

// Internal function to create a filterable subscriber
function createFilteredSubscriber(type: 'datasetSubscribe' | 'datasetUpdate') {
  return (id: string, callback: (data: {id: string, data: unknown}) => void | Promise<unknown>): unknown => {
    const wrapper = (data: {id: string, data: unknown}): void => {
      if (data && data.id === id) {
        const returnValue = callback(data);

        if (returnValue) {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          returnValue.catch(() => {});
        }
      }
    };

    return createSubscriber(type, wrapper as (data: unknown) => void | Promise<unknown>);
  };
}

/**
 * Methods used by extension developers to get and update data
 */
export const subscribe = createFilteredSubscriber('datasetSubscribe');
export const get = createSender('datasetGet');
export const update = createSender('datasetUpdate');

/**
 * Internal methods used by the administration
 */
export const register = createSender('datasetRegistration');
export const updateSubscriber = createFilteredSubscriber('datasetUpdate');
export const handleGet = createHandler('datasetGet');

// Register sends message to all registered
export type datasetRegistration = {
  responseType: {
    id: string,
    data: unknown,
  },

  id: string,

  data: unknown,
}

export type datasetSubscribe = {
  responseType: unknown,

  id: string,

  data: unknown,
}

export type datasetUpdate = {
  responseType: unknown,

  id: string,

  data: unknown,
}

export type datasetGet = {
  responseType: unknown,

  id: string,

  data: unknown,
}

const Classes: {
  Criteria: typeof Criteria,
  Entity: typeof Entity,
  EntityCollection: typeof EntityCollection,
} = {
  Criteria,
  Entity: Entity,
  EntityCollection,
};

export {
  repository,
  Classes,
};
