import { hasType } from '../utils';
import Criteria from '../../data/Criteria';
import type { SerializerFactory } from './index';

/* eslint-disable */
const CriteriaSerializer: SerializerFactory = () => ({
    name: 'criteria',

    serialize: ({ value, customizerMethod }): any => {
      if (value instanceof Criteria) {
        return {
          __type__: '__Criteria__',
          data: customizerMethod(value.getCriteriaData()),
        };
      }
    },

    deserialize: ({ value, customizerMethod }): any => {
      // When object is containing a criteria wrapper
      if (hasType('__Criteria__', value) && typeof value['data'] === 'object') {
        // The original values
        const serializedData = value.data;
  
        // Create new criteria object
        const deserializedCriteria = new Criteria();
  
        // Hydrate the criteria with the orignal values
        deserializedCriteria.setPage(serializedData.page);
        deserializedCriteria.setLimit(serializedData.limit);
        deserializedCriteria.setTerm(serializedData.term);
        // @ts-expect-error
        serializedData.filters.forEach((filter) => {
          deserializedCriteria.addFilter(filter);
        });
        deserializedCriteria.setIds(serializedData.ids);
        // @ts-expect-error
        serializedData.queries.forEach(({ query, score }) => {
          deserializedCriteria.addQuery(query, score);
        });
        // @ts-expect-error
        serializedData.associations.forEach((association) => {
          // Associations need also to be deserialized
          // @ts-expect-error
          deserializedCriteria.associations.push(customizerMethod(association));
        });
        // @ts-expect-error
        serializedData.postFilter.forEach((filter) => {
          deserializedCriteria.addPostFilter(filter);
        });
        // @ts-expect-error
        serializedData.sortings.forEach((sorting) => {
          deserializedCriteria.addSorting(sorting);
        });
        // @ts-expect-error
        serializedData.aggregations.forEach((aggregation) => {
          deserializedCriteria.addAggregation(aggregation);
        });
        // @ts-expect-error
        serializedData.grouping.forEach((group) => {
          deserializedCriteria.addGrouping(group);
        });
        // @ts-expect-error
        serializedData.fields.forEach((field) => {
          deserializedCriteria.addFields(field);
        });
        // @ts-expect-error
        serializedData.groupFields.forEach((groupField) => {
          deserializedCriteria.addGroupField(groupField);
        });
        if (serializedData.includes) {
          deserializedCriteria.addIncludes(serializedData.includes);
        }
        deserializedCriteria.setTotalCountMode(serializedData.totalCountMode);
  
        // Return new Criteria object
        return deserializedCriteria;
      }
    }
});

export default CriteriaSerializer;
