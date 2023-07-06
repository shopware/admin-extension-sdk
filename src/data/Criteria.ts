import cloneDeep from 'lodash/cloneDeep';

export const enum TotalCountMode {
    /* No total count will be selected. Should be used if no pagination required (fastest) */
    'NO_TOTAL_COUNT' = 0,
    /* Exact total count will be selected. Should be used if an exact pagination is required (slow) */
    'EXACT_TOTAL_COUNT' = 1,
    /* Fetches limit * 5 + 1. Should be used if pagination can work with "next page exists" (fast) */
    'PAGINATION_TOTAL_COUNT' = 2,
}

interface Filters {
    contains: {
        type: 'contains',
        field: string,
        value: string,
    },
    prefix: {
        type: 'prefix',
        field: string,
        value: string,
    },
    suffix: {
        type: 'suffix',
        field: string,
        value: string,
    },
    equalsAny: {
        type: 'equalsAny',
        field: string,
        value: string,
    },
    equals: {
        type: 'equals',
        field: string,
        value: string|number|boolean|null,
    },
    range: {
        type: 'range',
        field: string,
        parameters: {
            lte?: string,
            lt?: string,
            gte?: string,
            gt?: string,
        },
    },
    not: {
        type: 'not',
        operator: 'and'|'AND'|'or'|'OR',
        queries: SingleFilter[],
    },
    multi: {
        type: 'multi',
        operator: 'and'|'AND'|'or'|'OR',
        queries: SingleFilter[],
    },
}

interface Aggregations {
    histogram: {
        type: 'histogram',
        name: string,
        field: string,
        interval: string|null,
        format: string|null,
        aggregation: Aggregation|null,
        timeZone: string|null,
    },
    terms: {
        type: 'terms',
        name: string,
        field: string,
        limit: number|null,
        sort: Sorting|null,
        aggregation: Aggregation|null,
    },
    sum: {
        type: 'sum',
        name: string,
        field: string,
    },
    stats: {
        type: 'stats',
        name: string,
        field: string,
    },
    min: {
        type: 'min',
        name: string,
        field: string,
    },
    max: {
        type: 'max',
        name: string,
        field: string,
    },
    count: {
        type: 'count',
        name: string,
        field: string,
    },
    avg: {
        type: 'avg',
        name: string,
        field: string,
    },
}

type ValueOf<T> = T[keyof T]
type SingleFilter = ValueOf<Filters>;
type Aggregation = ValueOf<Aggregations>;
interface Filter {
    type: 'filter',
    name: string,
    filter: SingleFilter[],
    aggregation: Aggregation[],
}
interface Include {
    [entityName: string]: string[],
}
interface Association {
    association: string,
    criteria: Criteria,
}
interface Query {
    score: number,
    query: SingleFilter,
    [scoreField: string]: unknown,
}
interface Sorting {
    field: string,
    order: 'ASC'|'DESC',
    naturalSorting: boolean,
    type?: string,
}
type GroupField = string;
interface RequestParams {
    ids?: string,
    page?: number,
    limit?: number,
    term?: string,
    query?: Query[],
    filter?: SingleFilter[],
    'post-filter'?: SingleFilter[],
    sort?: Sorting[],
    aggregations?: Aggregation[],
    groupFields?: GroupField[],
    grouping?: string[],
    fields?: string[],
    associations?: {
        [association: string]: RequestParams,
    },
    includes?: Include,
    'total-count-mode'?: TotalCountMode,
}

let defaultPage: null|number = 1;
let defaultLimit: null|number = null;

export function setDefaultValues(options: { page?: number|null, limit?: number|null}): void {
  if (options.page) {
    defaultPage = options.page;
  }

  if (options.limit) {
    defaultLimit = options.limit;
  }
}

export default class Criteria {
  page: number | null;

  limit: number | null;

  term: string | null;

  filters: SingleFilter[];

  ids: string[];

  queries: Query[];

  associations: Association[];

  postFilter: SingleFilter[];

  sortings: Sorting[];

  aggregations: Aggregation[];

  grouping: string[];

  fields: string[];

  groupFields: GroupField[];

  totalCountMode: TotalCountMode | null;

  includes: Include | null;

  constructor(page: number|null = defaultPage, limit: number|null = defaultLimit) {
    this.page = page;
    this.limit = limit;
    this.term = null;
    this.filters = [];
    this.includes = null;
    this.ids = [];
    this.queries = [];
    this.associations = [];
    this.postFilter = [];
    this.sortings = [];
    this.aggregations = [];
    this.grouping = [];
    this.groupFields = [];
    this.fields = [];
    this.totalCountMode = TotalCountMode.EXACT_TOTAL_COUNT;
  }

  static fromCriteria(criteria: Criteria): Criteria {
    return cloneDeep(criteria);
  }

  /**
   * Parses the current criteria and generates an object which can be provided to the api
   */
  parse(): RequestParams {
    const params: RequestParams = {};

    if (this.ids.length > 0) {
      params.ids = this.ids.join('|');
    }
    if (this.page !== null) {
      params.page = this.page;
    }
    if (this.limit !== null) {
      params.limit = this.limit;
    }
    if (this.term !== null) {
      params.term = this.term;
    }
    if (this.queries.length > 0) {
      params.query = this.queries;
    }
    if (this.filters.length > 0) {
      params.filter = this.filters;
    }
    if (this.postFilter.length > 0) {
      params['post-filter'] = this.postFilter;
    }
    if (this.sortings.length > 0) {
      params.sort = this.sortings;
    }
    if (this.aggregations.length > 0) {
      params.aggregations = this.aggregations;
    }
    if (this.groupFields.length > 0) {
      params.groupFields = this.groupFields;
    }
    if (this.grouping.length > 0) {
      params.grouping = this.grouping;
    }
    if (this.fields.length > 0) {
      params.fields = this.fields;
    }
    if (this.associations.length > 0) {
      params.associations = {};

      this.associations.forEach((item) => {
        if (!params.associations) {return;}
        params.associations[item.association] = item.criteria.parse();
      });
    }
    if (this.includes !== null) {
      params.includes = this.includes;
    }

    if (this.totalCountMode !== null) {
      params['total-count-mode'] = this.totalCountMode;
    }

    return params;
  }

  /**
   * Allows to provide a list of ids which are used as a filter
   */
  setIds(ids: string[]): this {
    this.ids = ids;
    return this;
  }

  /**
   * Allows to configure the total value of a search result.
   * 0 - no total count will be selected. Should be used if no pagination required (fastest)
   * 1 - exact total count will be selected. Should be used if an exact pagination is required (slow)
   * 2 - fetches limit * 5 + 1. Should be used if pagination can work with "next page exists" (fast)
   */
  setTotalCountMode(mode: TotalCountMode): this {
    if (typeof mode !== 'number') {
      this.totalCountMode = null;
    }

    this.totalCountMode = (mode < 0 || mode > 2) ? null : mode;
    return this;
  }

  setPage(page: number): this {
    this.page = page;
    return this;
  }

  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }

  setTerm(term: string): this {
    this.term = term;
    return this;
  }

  addFilter(filter: SingleFilter): this {
    this.filters.push(filter);

    return this;
  }

  addIncludes(include: Include): this {
    Object.entries(include).forEach(([entityName, includeValues]) => {
      if (this.includes === null) {
        this.includes = {};
      }
      if (!this.includes[entityName]) {
        this.includes[entityName] = [];
      }

      this.includes[entityName].push(...includeValues);
    });

    return this;
  }

  /**
   * Adds the provided filter as post filter.
   * Post filter will be considered for the documents query but not for the aggregations.
   */
  addPostFilter(filter: SingleFilter): this {
    this.postFilter.push(filter);
    return this;
  }

  /**
   * Allows to add different sortings for the criteria, to sort the entity result.
   */
  addSorting(sorting: Sorting): this {
    this.sortings.push(sorting);
    return this;
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Query\ScoreQuery.
   * These queries are used to search for documents and score them with a ranking
   */
  addQuery(filter: SingleFilter, score: number, scoreField: string|null = null): this {
    const query: Query = { score: score, query: filter };

    if (scoreField) {
      query[scoreField] = scoreField;
    }

    this.queries.push(query);

    return this;
  }

  /**
   * @param {Object} groupField
   */
  addGroupField(groupField: GroupField): this {
    this.groupFields.push(groupField);
    return this;
  }

  /**
   * Allows grouping the result by a specific field
   */
  addGrouping(field: string): this {
    this.grouping.push(field);

    return this;
  }

  /**
   * Allows loading partial fields for the result.
   */
  addFields(...field: string[]): this {
    this.fields.push(...field);

    return this;
  }

  /**
   * @param {Object} aggregation
   */
  addAggregation(aggregation: Aggregation): this {
    this.aggregations.push(aggregation);
    return this;
  }

  /**
   * Ensures that a criterion is created for each segment of the passed path.
   * Existing Criteria objects are not overwritten.
   * Returns the own instance
   */
  addAssociation(path: string): this {
    const parts = path.split('.');

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let criteria = this;
    parts.forEach((part) => {
      // @ts-expect-error - returns another instance of this
      criteria = criteria.getAssociation(part);
    });

    return this;
  }

  /**
   * Ensures that a criterion is created for each segment of the passed path.
   * Returns the criteria instance of the last path segment
   */
  getAssociation(path: string): Criteria {
    const parts = path.split('.');

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let criteria = this;
    parts.forEach((part) => {
      if (!criteria.hasAssociation(part)) {
        criteria.associations.push({
          association: part,
          criteria: new Criteria(null, null),
        });
      }

      // @ts-expect-error - returns another instance of this
      criteria = criteria.getAssociationCriteria(part);
    });

    return criteria;
  }

  getAssociationCriteria(part: string): Criteria|null {
    let criteria = null;

    this.associations.forEach((association) => {
      if (association.association === part) {
        criteria = association.criteria;
      }
    });

    return criteria;
  }

  getLimit(): number {
    return this.limit ?? 0;
  }

  getPage(): number {
    return this.page ?? 0;
  }

  getCriteriaData(): {
      page: Criteria['page'],
      limit: Criteria['limit'],
      term: Criteria['term'],
      filters: Criteria['filters'],
      ids: Criteria['ids'],
      queries: Criteria['queries'],
      associations: Criteria['associations'],
      postFilter: Criteria['postFilter'],
      sortings: Criteria['sortings'],
      aggregations: Criteria['aggregations'],
      grouping: Criteria['grouping'],
      fields: Criteria['fields'],
      groupFields: Criteria['groupFields'],
      totalCountMode: Criteria['totalCountMode'],
      includes: Criteria['includes'],
      } {
    return {
      page: this.page,
      limit: this.limit,
      term: this.term,
      filters: this.filters,
      ids: this.ids,
      queries: this.queries,
      associations: this.associations,
      postFilter: this.postFilter,
      sortings: this.sortings,
      aggregations: this.aggregations,
      grouping: this.grouping,
      fields: this.fields,
      groupFields: this.groupFields,
      totalCountMode: this.totalCountMode,
      includes: this.includes,
    };
  }

  hasAssociation(property: string): boolean {
    return this.associations.some((assocation) => {
      return assocation.association === property;
    });
  }

  /**
   * Resets the sorting parameter
   */
  resetSorting(): void {
    this.sortings = [];
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\AvgAggregation
   * Allows to calculate the avg value for the provided field
   */
  static avg(name: string, field: string): Aggregations['avg'] {
    return { type: 'avg', name, field };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\CountAggregation
   * Allows to calculate the count value for the provided field
   */
  static count(name: string, field: string): Aggregations['count'] {
    return { type: 'count', name, field };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\MaxAggregation
   * Allows to calculate the max value for the provided field
   */
  static max(name: string, field: string): Aggregations['max'] {
    return { type: 'max', name, field };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\MinAggregation
   * Allows to calculate the min value for the provided field
   */
  static min(name: string, field: string): Aggregations['min'] {
    return { type: 'min', name, field };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\StatsAggregation
   * Allows to calculate the sum, max, min, avg, count values for the provided field
   */
  static stats(name: string, field: string): Aggregations['stats'] {
    return { type: 'stats', name, field };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\SumAggregation
   * Allows to calculate the sum value for the provided field
   */
  static sum(name: string, field: string): Aggregations['sum'] {
    return { type: 'sum', name, field };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\TermsAggregation
   * Allows to fetch term buckets for the provided field
   */
  static terms(
    name: string,
    field: string,
    limit: number|null = null,
    sort: Sorting|null = null,
    aggregation: Aggregation|null = null,
  ): Aggregations['terms'] {
    return { type: 'terms', name, field, limit, sort, aggregation };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\FilterAggregation
   * Allows to filter an aggregation result
   */
  static filter(name: string, filter: SingleFilter[], aggregation: Aggregation[]): Filter {
    return { type: 'filter', name, filter, aggregation };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\DateHistogramAggregation
   * Allows to fetch date buckets for the provided date interval
   */
  static histogram(
    name: string,
    field: string,
    interval: string | null,
    format: string | null,
    aggregation: Aggregation | null,
    timeZone: string | null,
  ): Aggregations['histogram'] {
    return { type: 'histogram', name, field, interval, format, aggregation, timeZone };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting.
   * Allows to sort the documents by the provided field
   */
  static sort(field: string, order:Sorting['order'] = 'ASC', naturalSorting = false): Sorting {
    return { field, order, naturalSorting };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting.
   * Allows to sort the documents by the provided field naturally
   */
  static naturalSorting(field: string, order:Sorting['order'] = 'ASC'): Sorting {
    return { field, order, naturalSorting: true };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\CountSorting.
   * Allows to sort the documents by counting associations via the provided field
   *
   * Sql representation: `ORDER BY COUNT({field}) {order}`
   */
  static countSorting(field: string, order:Sorting['order'] = 'ASC'): Sorting {
    return { field, order, naturalSorting: false, type: 'count' };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter.
   * This allows to filter documents where the value are contained in the provided field.
   *
   * Sql representation: `{field} LIKE %{value}%`
   */
  static contains(field: string, value: string): Filters['contains'] {
    return { type: 'contains', field, value };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\PrefixFilter.
   * This allows to filter documents where the value marks the beginning of the provided field.
   *
   * Sql representation: `{field} LIKE {value}%`
   */
  static prefix(field: string, value: string): Filters['prefix'] {
    return { type: 'prefix', field, value };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\SuffixFilter.
   * This allows to filter documents where the value marks the end of the provided field.
   *
   * Sql representation: `{field} LIKE %{value}`
   */
  static suffix(field: string, value: string): Filters['suffix'] {
    return { type: 'suffix', field, value };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter.
   * This allows to filter documents where the field matches one of the provided values
   *
   * Sql representation: `{field} IN ({value}, {value})`
   */
  static equalsAny(field: string, value: (string|number|boolean|null)[]): Filters['equalsAny'] {
    return { type: 'equalsAny', field, value: value.join('|') };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter.
   * This allows to filter documents where the field matches a defined range
   *
   * Sql representation: `{field} >= {value}`, `{field} <= {value}`, ...
   */
  static range(field: string, range: Filters['range']['parameters']): Filters['range'] {
    return { type: 'range', field, parameters: range };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter.
   * This allows to filter documents where the field matches a defined range
   *
   * Sql representation: `{field} = {value}`
   */
  static equals(field: string, value: string|number|boolean|null): Filters['equals'] {
    return { type: 'equals', field, value };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter.
   * This allows to filter documents which not matches for the provided filters
   * All above listed queries can be provided (equals, equalsAny, range, contains)
   *
   * Sql representation: `NOT({query} {operator} {query} {operator} {query})`
   *
   * @param {string} operator - and/or
   * @param {array} queries
   *
   * @returns {Object}
   */
  static not(operator: Filters['not']['operator'], queries: SingleFilter[] = []): Filters['not'] {
    return { type: 'not', operator: operator, queries: queries };
  }

  /**
   * @see \Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter.
   * This allows to filter documents which matches for the provided filters
   * All above listed queries can be provided (equals, equalsAny, range, contains)
   *
   * Sql representation: `({query} {operator} {query} {operator} {query})`
   *
   * @param {string} operator - and/or
   * @param {array} queries
   *
   * @returns {Object}
   */
  static multi(operator: Filters['multi']['operator'], queries: SingleFilter[] = []): Filters['multi'] {
    return { type: 'multi', operator, queries };
  }
}
