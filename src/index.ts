import * as window from './window';
import * as notification from './notification';
import * as context from './context';
import * as componentSection from './ui/componentSection';
import tabs from './ui/tabs';
import * as cms from './ui/cms';
import * as location from './location';
import * as menu from './ui/menu';
import * as settings from './ui/settings';
import * as mainModule from './ui/mainModule';
import * as module from './ui/module';
import * as modal from './ui/modal';
import * as actionButton from './ui/actionButton';
import * as webhook from './app/action';
import * as data from './data';
import type EntityCollectionType from './data/_internals/EntityCollection';
import type { Entity as EntityType } from './data/_internals/Entity';
import composables from './data/composables';

const app = {
  webhook,
};

const ui = {
  componentSection,
  tabs,
  menu,
  settings,
  mainModule,
  module,
  modal,
  actionButton,
};

/**
 * The main export which will be available by direct imports.
 */
export {
  window,
  notification,
  context,
  ui,
  cms,
  location,
  app,
  data,
  composables,
};

/**
 * Declare global EntitySchema namespace for allowing to extend the entity definitions
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace EntitySchema {
    type EntityCollection<EntityName extends keyof EntitySchema.Entities> = EntityCollectionType<EntityName>;
    type Entity<EntityName extends keyof EntitySchema.Entities> = EntityType<EntityName>;

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Entities {
      /* This will be extended by the entity-schema */
      private_example_entity: private_example_entity,
      private_example_entity_two: private_example_entity_two,
    }

    interface private_example_entity {
      id: string,
    }

    interface private_example_entity_two {
      id: string,
    }
  }
}
