import { createHandler, createSender, processDataRegistration, send, subscribe as createSubscriber } from '../channel';
import Criteria from './Criteria';
import Entity from './_internals/Entity';
import EntityCollection from './_internals/EntityCollection';
import repository from './repository';

// Internal function to create a filterable subscriber
function createFilteredSubscriber(type: 'datasetSubscribe' | 'datasetUpdate') {
  return (
    id: string,
    callback: (data: {id: string, data: unknown}) => void | Promise<unknown>,
    options?: {
      selectors?: string[],
    }
  ): unknown => {
    if (type === 'datasetSubscribe') {
      // Send message to admin that this window wants to subscribe to a dataset
      void send('datasetSubscribeRegistration', {
        id,
        selectors: options?.selectors,
      });
    }

    const wrapper = (data: {id: string, data: unknown, selectors?: string[]}): void => {
      if (data?.id !== id) {
        return;
      }

      if (data.selectors && data.selectors.length > 0) {
        // Compare if the selectors match independent of the order
        if (options?.selectors?.sort().join(',') !== data.selectors.sort().join(',')) {
          return;
        }
      }

      const returnValue = callback(data);

      if (returnValue) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        returnValue.catch(() => {});
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
export const register = processDataRegistration;
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

  selectors?: string[],
}

/**
 * Will be used for giving the admin the information that 
 * a window wants to subscribe to a dataset
 */
export type datasetSubscribeRegistration = {
  responseType: unknown,

  id: string,

  selectors?: string[],
}

export type datasetUpdate = {
  responseType: unknown,

  id: string,

  data: unknown,
}

export type datasetGet = {
  responseType: unknown,

  id: string,

  data?: unknown,

  selectors?: string[],
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
