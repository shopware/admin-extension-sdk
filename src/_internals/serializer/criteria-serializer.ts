import {traverseObject, hasType} from '../utils';
import Criteria from '../../data/Criteria';

/* eslint-disable */
function serialize<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  serializeCriteriasWithPlaceholder(messageData);
}

function deserialize<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  deserializeCriterias(messageData);
}

function serializeCriteriasWithPlaceholder<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  traverseObject(messageData, (parentEntry, key, value) => {
    if (value instanceof Criteria) {
      parentEntry[key] = {
        __type__: '__Criteria__',
        data: value.getCriteriaData()
      }
    }
  });
}

function deserializeCriterias<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  traverseObject(messageData, (parentEntry, key, value) => {
    // when object is containing a criteria wrapper
    if (hasType('__Criteria__', value) && typeof value['data'] === 'object') {
      // the original values
      const serializedData = parentEntry[key].data;

      // create new criteria object
      const deserializedCriteria = new Criteria();

      // hydrate the criteria with the orignal values
      deserializedCriteria.setPage(serializedData.page);
      deserializedCriteria.setLimit(serializedData.limit);
      deserializedCriteria.setTerm(serializedData.term);
      // @ts-expect-error
      serializedData.filters.forEach((filter) => {
        deserializedCriteria.addFilter(filter);
      })
      deserializedCriteria.setIds(serializedData.ids);
      // @ts-expect-error
      serializedData.queries.forEach(({ query, score }) => {
        deserializedCriteria.addQuery(query, score);
      })
      // @ts-expect-error
      serializedData.associations.forEach((association) => {
        // associations need also to be deserialized
        deserializeCriterias(association);
        // @ts-expect-error
        deserializedCriteria.associations.push(association);
      })
      // @ts-expect-error
      serializedData.postFilter.forEach((filter) => {
        deserializedCriteria.addPostFilter(filter);
      })
      // @ts-expect-error
      serializedData.sortings.forEach((sorting) => {
        deserializedCriteria.addSorting(sorting);
      })
      // @ts-expect-error
      serializedData.aggregations.forEach((aggregation) => {
        deserializedCriteria.addAggregation(aggregation);
      })
      // @ts-expect-error
      serializedData.grouping.forEach((group) => {
        deserializedCriteria.addGrouping(group);
      })
      // @ts-expect-error
      serializedData.fields.forEach((field) => {
        deserializedCriteria.addFields(field);
      })
      // @ts-expect-error
      serializedData.groupFields.forEach((groupField) => {
        deserializedCriteria.addGroupField(groupField);
      })
      if (serializedData.includes) {
        deserializedCriteria.addIncludes(serializedData.includes);
      }
      deserializedCriteria.setTotalCountMode(serializedData.totalCountMode);

      // return new Criteria object
      parentEntry[key] = deserializedCriteria;
    }
  });
}

export default {
  name: 'criteria',
  serialize,
  deserialize,
};
