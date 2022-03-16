import Criteria from './Criteria';
import Entity from './_internals/Entity';
import EntityCollection from './_internals/EntityCollection';
import repository from './repository';

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
