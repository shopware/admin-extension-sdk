import Criteria from "../../data/Criteria";
import SerializerFactory from './index';
import { handle, send } from '../../channel';

const { serialize, deserialize } = SerializerFactory({
  handle: handle,
  send: send,
})

describe('Criteria Serializer', () => {
  it('should serialize and deserialize the criteria', () => {
    const myCriteria = new Criteria();

    const messageData = {
      title: 'Test title',
      myCriteria: myCriteria,
    }

    const serializedMessageData = serialize(messageData);

    expect(serializedMessageData.myCriteria).toBeInstanceOf(Object);
    expect(serializedMessageData).toEqual({
      title: 'Test title',
      myCriteria: {
        __type__: '__Criteria__',
        data: {
          page: 1,
          limit: null,
          term: null,
          filters: [],
          ids: [],
          queries: [],
          associations: [],
          postFilter: [],
          sortings: [],
          aggregations: [],
          grouping: [],
          fields: [],
          groupFields: [],
          totalCountMode: 1,
          includes: null
        }
      }
    })

    const deserializedMessageData = deserialize(serializedMessageData, new MessageEvent(''));

    expect(deserializedMessageData.title).toEqual('Test title');
    expect(deserializedMessageData.myCriteria).toBeInstanceOf(Criteria);
  });

  it('should serialize the criteria with different page and limit', () => {
    const myCriteria = new Criteria();
    myCriteria.setPage(50);
    myCriteria.setLimit(500);

    const messageData = {
      title: 'Test title',
      myCriteria: myCriteria,
    }

    const serializedMessageData = serialize(messageData);

    expect(serializedMessageData).toEqual({
      title: 'Test title',
      myCriteria: {
        __type__: '__Criteria__',
        data: {
          page: 50,
          limit: 500,
          term: null,
          filters: [],
          ids: [],
          queries: [],
          associations: [],
          postFilter: [],
          sortings: [],
          aggregations: [],
          grouping: [],
          fields: [],
          groupFields: [],
          totalCountMode: 1,
          includes: null
        }
      }
    })

    const deserializedMessageData = deserialize(serializedMessageData, new MessageEvent(''));

    expect(deserializedMessageData.title).toEqual('Test title');
    expect(deserializedMessageData.myCriteria).toBeInstanceOf(Criteria);

    expect(deserializedMessageData.myCriteria.getPage()).toEqual(50);
    expect(deserializedMessageData.myCriteria.getLimit()).toEqual(500);
  });

  it('should serialize the criteria with correct values', () => {
    const myCriteria = new Criteria();

    myCriteria.setTerm('Hello world')

    myCriteria.addFilter(
      Criteria.equals('name', 'Hello world'),
    );

    myCriteria.addFilter(
      Criteria.multi('and', [
        Criteria.equals('defaultFolderId', 'exampleDefaultFolderId'),
        Criteria.not(
          'or',
          [
            Criteria.equals('id', 'exampleFolderId')
          ]
        ),
      ])
    );

    myCriteria.setIds([
      'idOne',
      'idTwo'
    ])

    myCriteria.addQuery(
      Criteria.contains('group.name', 'exampleGroup'),
      500
    );

    myCriteria.addAssociation('product.name');

    myCriteria.addPostFilter(Criteria.equals('isActive', true));

    myCriteria.addSorting(Criteria.sort('createdAt', 'DESC', true));

    myCriteria.addAggregation(Criteria.max('maxPosition', 'order'))

    myCriteria.addGrouping('name');

    myCriteria.addFields('description');

    myCriteria.addGroupField('manufacturer');

    myCriteria.setTotalCountMode(2);

    myCriteria.addIncludes({
      'product': ['name', 'description']
    })

    myCriteria.addIncludes({
      'manufacturer': ['name', 'shortName']
    })

    const messageData = {
      title: 'Test title',
      myCriteria: myCriteria,
    }

    const originalParsedCriteria = myCriteria.parse();

    const serializedMessageData = serialize(messageData);

    expect(serializedMessageData).toEqual({
      title: 'Test title',
      myCriteria: {
        __type__: '__Criteria__',
        data: {
          page: 1,
          limit: null,
          term: 'Hello world',
          filters: [
            {
              field: 'name',
              type: 'equals',
              value: 'Hello world'
            },
            {
              type: 'multi',
              operator: 'and',
              queries: [
                {
                  field: 'defaultFolderId',
                  type: 'equals',
                  value: 'exampleDefaultFolderId'
                },
                {
                  type: 'not',
                  operator: 'or',
                  queries: [
                    {
                      field: 'id',
                      type: 'equals',
                      value: 'exampleFolderId'
                    }
                  ]
                }
              ]
            }
          ],
          ids: [
            'idOne',
            'idTwo'
          ],
          queries: [
            {
              score: 500,
              query: {
                field: 'group.name',
                type: 'contains',
                value: 'exampleGroup'
              }
            }
          ],
          associations: [
            {
              association: 'product',
              criteria: {
                __type__: '__Criteria__',
                data: {
                  page: null,
                  limit: null,
                  term: null,
                  filters: [],
                  ids: [],
                  queries: [],
                  postFilter: [],
                  sortings: [],
                  grouping: [],
                  fields: [],
                  groupFields: [],
                  totalCountMode: 1,
                  includes: null,
                  aggregations: [],
                  associations: [
                    {
                      association: 'name',
                      criteria: {
                        __type__: '__Criteria__',
                        data: {
                          page: null,
                          limit: null,
                          term: null,
                          filters: [],
                          ids: [],
                          queries: [],
                          associations: [],
                          postFilter: [],
                          sortings: [],
                          aggregations: [],
                          grouping: [],
                          fields: [],
                          groupFields: [],
                          totalCountMode: 1,
                          includes: null
                        }
                      }
                    }
                  ],
                }
              }
            }
          ],
          postFilter: [
            {
              field: 'isActive',
              type: 'equals',
              value: true
            }
          ],
          sortings: [
            {
              field: 'createdAt',
              naturalSorting: true,
              order: 'DESC',
            }
          ],
          aggregations: [
            {
              field: 'order',
              name: 'maxPosition',
              type: 'max'
            }
          ],
          grouping: [
            'name'
          ],
          fields: [
            'description'
          ],
          groupFields: [
            'manufacturer'
          ],
          totalCountMode: 2,
          includes: {
            product: ['name', 'description'],
            manufacturer: ['name', 'shortName'],
          }
        }
      }
    })

    const deserializedMessageData = deserialize(serializedMessageData, new MessageEvent(''));

    expect(deserializedMessageData.title).toEqual('Test title');
    expect(deserializedMessageData.myCriteria).toBeInstanceOf(Criteria);

    expect(deserializedMessageData.myCriteria.parse()).toEqual(originalParsedCriteria);
  });
});
