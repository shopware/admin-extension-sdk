import { test, expect } from '@playwright/test';
import { setup } from './test.utils';
import type * as sw from '../src/index';
import type { sw_internal } from './testpage/app';

declare global {
  interface Window {
    sw: typeof sw;
    sw_internal: sw_internal
  }
}

// Fail on console errors
test.beforeEach(({ page }, testInfo) => {
  page.on('console', (msg) => {
    console.log('LOG IN PAGE: ', msg.text());

    if (msg.type() === 'error') {
      expect(msg.text()).toBeUndefined();
    }
  })
})

test.describe('Test setup', () => {
  test('check if setup process works correctly', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await expect(mainFrame.locator('h1')).toContainText('Main window');
    await expect(subFrame.locator('h1')).toContainText('Sub window');
  });
})

test.describe('Main communication test', () => {
  test('check if 2 windows are in the source registry', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // check if sourceRegistry contains the window
    const sourceRegistryLength = await mainFrame.evaluate(() => {
      return [...window._swsdk.sourceRegistry].length;
    })

    expect(sourceRegistryLength).toEqual(2);
  });

  test('get value from mainFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // respond to multiply with value 42
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('_multiply', () => {
        return 42;
      })
    })

    // ask value from subFrame
    const result = await subFrame.evaluate(async () => {
      return await window.sw_internal.send('_multiply', {
        firstNumber: 5,
        secondNumber: 5,
      })
    })

    expect (result).toEqual(42);
  });

  test('get value from mainFrame with additional data', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // respond to multiply with value 42
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('_multiply', ({ firstNumber, secondNumber }) => {
        return firstNumber * secondNumber;
      })
    })

    // ask value from subFrame
    const testMatrix = [
      [7,8,56],
      [5,5,25],
      [2,33,66],
    ];

    await Promise.all(testMatrix.map(async (testScenario) => {
      expect(await subFrame.evaluate(async ([firstNumber, secondNumber]) => {
        return await window.sw_internal.send('_multiply', { firstNumber, secondNumber})
      }, testScenario)).toEqual(testScenario[2]);
    }));
  });

  test('call method in subFrame from mainFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle the methods from incoming events
    await mainFrame.evaluate(async () => {
      window.sw_internal.handle('notificationDispatch', ({ actions }) => {
        if (!actions) return;

        actions.forEach(({ method }) => {
          if (!method) return;

          method();
        })
      })
    })

    // call from subFrame with methods
    await subFrame.evaluate(async () => {
      // @ts-expect-error
      window.methodOneWasCalled = false;
      // @ts-expect-error
      window.methodTwoWasCalled = false;

      // @ts-expect-error
      window.methodTwo = () => {
        // @ts-expect-error
        window.methodTwoWasCalled = true;
      }

      await window.sw.notification.dispatch({
        title: 'Example message',
        message: 'Hello world',
        actions: [
          {
            label: 'Method 1',
            method: () => {
              // @ts-expect-error
              window.methodOneWasCalled = true;
            }
          },
          {
            label: 'Method 2',
            // @ts-expect-error
            method: window.methodTwo
          }
        ]
      })
    });

    // @ts-expect-error
    const methodOneWasCalled = await subFrame.evaluate(() => window.methodOneWasCalled);
    // @ts-expect-error
    const methodTwoWasCalled = await subFrame.evaluate(() => window.methodTwoWasCalled);

    expect(methodOneWasCalled).toBe(true);
    expect(methodTwoWasCalled).toBe(true);
  })

  test('do not call method in subFrame from mainFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle the methods from incoming events
    await mainFrame.evaluate(async () => {
      window.sw_internal.handle('notificationDispatch', () => {
        // Do nothing with the incoming message
      })
    })

    // call from subFrame with methods
    await subFrame.evaluate(async () => {
      // @ts-expect-error
      window.methodOneWasCalled = false;
      // @ts-expect-error
      window.methodTwoWasCalled = false;

      // @ts-expect-error
      window.methodTwo = () => {
        // @ts-expect-error
        window.methodTwoWasCalled = true;
      }

      await window.sw.notification.dispatch({
        title: 'Example message',
        message: 'Hello world',
        actions: [
          {
            label: 'Method 1',
            method: () => {
              // @ts-expect-error
              window.methodOneWasCalled = true;
            }
          },
          {
            label: 'Method 2',
            // @ts-expect-error
            method: window.methodTwo
          }
        ]
      })
    });

    // @ts-expect-error
    const methodOneWasCalled = await subFrame.evaluate(() => window.methodOneWasCalled);
    // @ts-expect-error
    const methodTwoWasCalled = await subFrame.evaluate(() => window.methodTwoWasCalled);

    expect(methodOneWasCalled).toBe(false);
    expect(methodTwoWasCalled).toBe(false);
  })
});

test.describe('Context tests', () => {
  test('get language', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // create handler in main window
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('contextLanguage', () => {
        return {
          languageId: 'LANGUAGE_ID',
          systemLanguageId: 'SYSTEM_LANGUAGE_ID'
        }
      })
    })

    // get value from sub window
    const { systemLanguageId, languageId } = await subFrame.evaluate(async () => {
      return await window.sw.context.getLanguage();
    })

    await expect(systemLanguageId).toEqual('SYSTEM_LANGUAGE_ID');
    await expect(languageId).toEqual('LANGUAGE_ID');
  });

  test('subscribe language', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // subscribe to value from sub window
    await subFrame.evaluate(async () => {
      return await window.sw.context.subscribeLanguage(({languageId, systemLanguageId}) => {
        // @ts-expect-error
        window.result = { languageId, systemLanguageId };
      });
    })

    // publish in main window
    await mainFrame.evaluate(async () => {
      // publish language
      await window.sw_internal.publish('contextLanguage', {
        languageId: 'EXAMPLE_LANGUAGE_ID',
        systemLanguageId: 'EXAMPLE_SYSTEM_LANGUAGE_ID',
      });
    })

    // get receiving value
    const { languageId, systemLanguageId } = await subFrame.evaluate(() => {
      // @ts-expect-error
      return window.result;
    })

    // check if receiving value matches
    expect(languageId).toBe('EXAMPLE_LANGUAGE_ID');
    expect(systemLanguageId).toBe('EXAMPLE_SYSTEM_LANGUAGE_ID');
  });
});

test.describe('Serializing tests', () => {
  test('send criteria to iFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle incoming criteria
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('_criteriaTest', ({ title, myCriteria }) => {
        // check if myCriteria is a real Criteria object
        if (!(myCriteria instanceof window.sw_internal.Criteria)) {
          return {
            title: 'myCriteria is not a Criteria instance',
            myCriteria,
          }
        }

        return {
          title,
          myCriteria,
        };
      })
    })

    // send criteria from subFrame
    const result = await subFrame.evaluate(async () => {
      const criteriaExample = new window.sw_internal.Criteria();

      const result = await window.sw_internal.send('_criteriaTest', {
        title: 'Criteria testing',
        myCriteria: criteriaExample,
      })

      return {
        title: result.title,
        // the criteria check needs to be done inside the frame
        isCriteriaInstance: result.myCriteria instanceof window.sw_internal.Criteria
      };
    })

    // check if criteria is a real criteria object
    expect (result.title).toEqual('Criteria testing');
    expect (result.isCriteriaInstance).toBe(true);
  });

  test('send entity collection to iFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle incoming collection
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('_collectionTest', ({ title, collection}) => {
        // check if collection is a real collection object
        if (!(collection instanceof window.sw_internal.Collection)) {
          return {
            title: 'collection is not a EntityCollection instance',
            collection,
          };
        }

        const first = collection.first();
        if (!first || typeof first.getDraft !== 'function') {
          return {
            title: 'First element is not an Entity instance',
            collection,
          };
        }

        const last = collection.last();
        if (!last || typeof last.getDraft !== 'function') {
          return {
            title: 'Last element is not an Entity instance',
            collection,
          };
        }

        return {
          title,
          collection,
        };
      })
    })

    // send collection from subFrame
    const result = await subFrame.evaluate(async () => {
      const collection = new window.sw_internal.Collection(
          'playwright',
          'test',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
      );
      const subCollection = new window.sw_internal.Collection(
          'playwright',
          'test',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
      );
      subCollection.add(new window.sw_internal.Entity('1', 'test', {}));
      subCollection.add(new window.sw_internal.Entity('2', 'test', {}));
      collection.add(new window.sw_internal.Entity('1', 'test', {}));
      collection.add(new window.sw_internal.Entity('2', 'test', {
        foo: new window.sw_internal.Entity('exampleId', 'foo', {
          anotherCollection: subCollection,
        })
      }));

      const result = await window.sw_internal.send('_collectionTest', {
        title: 'Collection testing',
        collection,
      })

      return {
        title: result.title,
        isCollectionInstance: result.collection instanceof window.sw_internal.Collection,
        // @ts-expect-error
        nestedEntityIsEntity: typeof result.collection[1].foo.getDraft === 'function',
        // @ts-expect-error
        nestedCollectionIsCollection: result.collection[1].foo.anotherCollection instanceof window.sw_internal.Collection,
      };
    })

    // check if collection is a real collection object
    expect (result.title).toEqual('Collection testing');
    expect (result.isCollectionInstance).toBe(true);
    expect (result.nestedEntityIsEntity).toBe(true);
    expect (result.nestedCollectionIsCollection).toBe(true);
  });

  test('send empty entity collection in entity to iFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle incoming collection
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('_entityTest', ({ title, entity}) => {
        // check if entity is a real entity
        if (!entity || typeof entity.getDraft !== 'function') {
          return {
            title: 'First element is not an Entity instance',
            entity,
          };
        }

        return {
          title,
          entity,
        };
      })
    })

    // send collection from subFrame
    const result = await subFrame.evaluate(async () => {
      const collection = new window.sw_internal.Collection(
          'playwright',
          'test',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
      );
      const subCollection = new window.sw_internal.Collection(
          'playwright',
          'test',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
      );
      subCollection.add(new window.sw_internal.Entity('1', 'test', {}));
      collection.add(new window.sw_internal.Entity('1', 'test', {}));
      collection.add(new window.sw_internal.Entity('2', 'test', {
        foo: new window.sw_internal.Entity('exampleId', 'foo', {
          anotherCollection: subCollection,
        })
      }));

      const mainEntity = new window.sw_internal.Entity('1', 'test', {
        collection,
        subCollection,
      })

      const result = await window.sw_internal.send('_entityTest', {
        title: 'Entity testing',
        entity: mainEntity,
      })

      return {
        title: result.title,
        entity: result.entity,
        // @ts-expect-error
        anotherCollectionIsCollection: result.entity.collection.get('2').foo.anotherCollection instanceof window.sw_internal.Collection,
        // @ts-expect-error
        originCollectionIsCollection: result.entity.collection.get('2').foo.getOrigin().anotherCollection instanceof window.sw_internal.Collection
      };
    })

    // check if collection is a real collection object
    expect (result.title).toEqual('Entity testing');
    expect (result.anotherCollectionIsCollection).toEqual(true);
    expect (result.originCollectionIsCollection).toEqual(true);
  });

  test('should not mutate original data when serializing', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle incoming criteria
    await mainFrame.evaluate(() => {
      window.sw_internal.handle('_collectionTest', ({ title, collection}) => {
        return { title, collection };
      })
    })

    // send criteria from subFrame
    const result = await subFrame.evaluate(async () => {
      const collection = new window.sw_internal.Collection(
          'playwright',
          'test',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
      );
      collection.add(new window.sw_internal.Entity('1', 'test', {
        foo: 'bar',
      }));

      const sendObject = {
        title: 'Serializing mutation testing',
        collection: collection,
      }

      const result = await window.sw_internal.send('_collectionTest', sendObject)

      return {
        title: result.title,
        collection: result.collection,
        // @ts-expect-error
        wasNotMutated: sendObject.collection.__type__ === undefined
      };
    })

    // check if collection is a real collection object
    expect (result.title).toEqual('Serializing mutation testing');
    expect (result.wasNotMutated).toEqual(true);
  });
});

test.describe('Privilege tests', () => {
  test('promise rejection with string', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await mainFrame.evaluate(() => {
      window.sw_internal.handle('repositorySearch', () => {
        return Promise.reject('Test Reason');
      })
    })

    const result = await subFrame.evaluate(async () => {
      return await window.sw_internal.send('repositorySearch', {entityName: 'product'})
    }).catch(e => e);

    expect(result instanceof Error).toBe(true);
    expect(result.message.includes('Test Reason')).toBe(true);
  });

  test('promise rejection with error', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await mainFrame.evaluate(() => {
      const error = new Error();
      // @ts-expect-error
      error.response = {
        data: {
          errors: [
            {
              code: 'FRAMEWORK__MISSING_PRIVILEGE_ERROR',
              detail: JSON.stringify({
                message: 'foo',
                missingPrivileges: ['product:read'],
              })
            }
          ]
        }
      };

      window.sw_internal.handle('repositorySearch', () => {
        return Promise.reject(error);
      })
    })

    const result = await subFrame.evaluate(async () => {
      return await window.sw_internal.send('repositorySearch', {entityName: 'product'})
    }).catch(e => e);

    expect(result instanceof Error).toBe(true);
    expect(result.message.includes('Your app is missing the privileges product:read for action "repositorySearch".')).toBe(true);
  });

  test('should not handle callback with missing privileges', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await mainFrame.evaluate(() => {
      window.sw_internal.setExtensions({
        foo: {
          baseUrl: 'http://localhost:8182',
          permissions: {
            create: ['notification']
          }
        }
      });

      window.sw_internal.handle('_privileges', () => {})
    })

    const response = await subFrame.evaluate(() => {
      return window.sw_internal.send('_privileges', {})
        .then((response) => ({
          response: response,
          errorMessage: 'No error happened',
          isMissingPrivilesErrorInstance: false,
        }))
        .catch((error) => ({
          response: error,
          errorMessage: error.toString(),
          isMissingPrivilesErrorInstance: error instanceof window.sw_internal.MissingPrivilegesError
        }))
    });

    expect(response.errorMessage).toEqual(`Error: Your app is missing the privileges additional:not_entity_related, create:user, read:user, update:user, delete:user for action "_privileges".`);
    expect(response.isMissingPrivilesErrorInstance).toBe(true);
  });

  test('should not accept entity data without correct privileges (create,read,update,delete)', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await mainFrame.evaluate(() => {
      window.sw_internal.setExtensions({
        example: {
          baseUrl: 'http://localhost:8182',
          permissions: {
            read: ['product']
          }
        }
      });

      window.sw_internal.handle('_collectionTest', () => {
        const collection = new window.sw_internal.Collection(
          'playwright',
          'product',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
        );

        collection.add(new window.sw_internal.Entity('productEntityId', 'product', {
          name: 'Amazing T-Shirt',
          foo: new window.sw_internal.Entity('manufacturerEntityId', 'manufacturer', {
            name: 'Shopware AG',
          })
        }));

        return {
          title: 'Collection privilege test',
          collection: collection,
        }
      })
    })

    const response = await subFrame.evaluate(async () => {
      const collection = new window.sw_internal.Collection(
        'playwright',
        'product',
        // @ts-expect-error
        {},
        new window.sw_internal.Criteria(),
      );

      collection.add(new window.sw_internal.Entity('productEntityId', 'product', {
        name: 'Amazing SDK T-Shirt',
        foo: new window.sw_internal.Entity('manufacturerEntityId', 'manufacturer', {
          name: 'Best manufacturer ever',
        })
      }));

      try {
        const result = await window.sw_internal.send('_collectionTest', {
          title: 'From SDK',
          collection: collection,
        });

        return {
          response: result,
          errorMessage: 'No error happened',
        }
      } catch (error) {
        return {
          response: error,
          errorMessage: error.toString(),
          isMissingPrivilesErrorInstance: error instanceof window.sw_internal.MissingPrivilegesError
        }
      }
    });

    expect(response.errorMessage).toEqual(`Error: Your app is missing the privileges create:product, delete:product, update:product, create:manufacturer, delete:manufacturer, read:manufacturer, update:manufacturer for action "_collectionTest".`);
    expect(response.isMissingPrivilesErrorInstance).toBe(true);
  });

  test('should accept entity data without correct privileges when on the same origin (for plugins)', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await mainFrame.evaluate(() => {
      window.sw_internal.setExtensions({
        example: {
          baseUrl: 'http://localhost:8182',
          permissions: {
            read: ['product']
          }
        }
      });

      window.sw_internal.handle('_collectionTest', () => {
        const collection = new window.sw_internal.Collection(
          'playwright',
          'product',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
        );

        collection.add(new window.sw_internal.Entity('productEntityId', 'product', {
          name: 'Amazing T-Shirt',
          foo: new window.sw_internal.Entity('manufacturerEntityId', 'manufacturer', {
            name: 'Shopware AG',
          })
        }));

        return {
          title: 'Collection privilege test',
          collection: collection,
        }
      })
    })

    const response = await mainFrame.evaluate(async () => {
      const collection = new window.sw_internal.Collection(
        'playwright',
        'product',
        // @ts-expect-error
        {},
        new window.sw_internal.Criteria(),
      );

      collection.add(new window.sw_internal.Entity('productEntityId', 'product', {
        name: 'Amazing SDK T-Shirt',
        foo: new window.sw_internal.Entity('manufacturerEntityId', 'manufacturer', {
          name: 'Best manufacturer ever',
        })
      }));

      try {
        const result = await window.sw_internal.send('_collectionTest', {
          title: 'From SDK',
          collection: collection,
        });

        return {
          response: result,
          errorMessage: 'No error happened',
          isMissingPrivilesErrorInstance: false,
        }
      } catch (error) {
        return {
          response: error,
          errorMessage: error.toString(),
          isMissingPrivilesErrorInstance: error instanceof window.sw_internal.MissingPrivilegesError
        }
      }
    });

    expect(response.response).toEqual({
      collection: [
        {
          foo: {
            name: 'Shopware AG',
          },
          name: 'Amazing T-Shirt',
        }
      ],
      title: 'Collection privilege test',
    });
    expect(response.errorMessage).toEqual('No error happened');
    expect(response.isMissingPrivilesErrorInstance).toBe(false);
  });

  test('should not send entity data without correct privileges (read)', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    await mainFrame.evaluate(() => {
      window.sw_internal.setExtensions({
        example: {
          baseUrl: 'http://localhost:8182',
          permissions: {
            read: ['product']
          }
        }
      });

      window.sw_internal.handle('_collectionTest', () => {
        const collection = new window.sw_internal.Collection(
          'playwright',
          'product',
          // @ts-expect-error
          {},
          new window.sw_internal.Criteria(),
        );

        collection.add(new window.sw_internal.Entity('productEntityId', 'product', {
          name: 'Amazing T-Shirt',
          foo: new window.sw_internal.Entity('manufacturerEntityId', 'manufacturer', {
            name: 'Shopware AG',
          })
        }));

        return {
          title: 'Collection privilege test',
          collection: collection,
        }
      })
    })

    const response = await subFrame.evaluate(async () => {
      try {
        // @ts-expect-error
        const result = await window.sw_internal.send('_collectionTest', {});

        return {
          response: result,
          errorMessage: 'No error happened',
        }
      } catch (error) {
        return {
          response: error,
          errorMessage: error.toString(),
          isMissingPrivilesErrorInstance: error instanceof window.sw_internal.MissingPrivilegesError
        }
      }
    });

    expect(response.errorMessage).toEqual(`Error: Your app is missing the privileges read:manufacturer for action "_collectionTest".`);
    expect(response.isMissingPrivilesErrorInstance).toBe(true);
  });

  test('should not send entity data without correct privileges in data handling (read)', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // subscribe to dataset publish
    await subFrame.evaluate(async () => {
      await window.sw.data.subscribe('e2e-test', (data) => {
        // @ts-expect-error
        window.result = { data: data.data };
      });
    })

    // publish dataset
    await mainFrame.evaluate(async () => {
      window.sw_internal.setExtensions({
        example: {
          baseUrl: 'http://localhost:8182',
          permissions: {
            read: ['manufacturer']
          }
        }
      });

      const exampleProduct = new window.sw_internal.Entity('exampleProductEntityId', 'product', {
        name: 'T-Shirt',
        description: 'An awesome T-Shirt'
      });

      await window.sw.data.register({
        id: 'e2e-test',
        data: exampleProduct,
      });
    })

    // get receiving value
    const result = await subFrame.evaluate(() => {
      return {
        // @ts-expect-error
        isError: window.result.data instanceof window.sw_internal.MissingPrivilegesError,
        // @ts-expect-error
        errorText: window.result.data.toString(),
      };
    })

    // check if receiving value matches
    expect(result.isError).toBe(true);
    expect(result.errorText).toBe('Error: Your app is missing the privileges read:product for action "datasetSubscribe".');
  });

  test('should send entity data with correct privileges in data handling (read)', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // subscribe to dataset publish
    await subFrame.evaluate(async () => {
      await window.sw.data.subscribe('e2e-test', (data) => {
        // @ts-expect-error
        window.result = { data: data.data };
      });
    })

    // publish dataset
    await mainFrame.evaluate(async () => {
      window.sw_internal.setExtensions({
        example: {
          baseUrl: 'http://localhost:8182',
          permissions: {
            read: ['product']
          }
        }
      });

      const exampleProduct = new window.sw_internal.Entity('exampleProductEntityId', 'product', {
        name: 'T-Shirt',
        description: 'An awesome T-Shirt'
      });

      await window.sw.data.register({
        id: 'e2e-test',
        data: exampleProduct,
      });
    })

    // get receiving value
    const result = await subFrame.evaluate(() => {
      return {
        // @ts-expect-error
        isError: window.result.data instanceof window.sw_internal.MissingPrivilegesError,
        // @ts-expect-error
        data: window.result.data,
      };
    })

    // check if receiving value matches
    expect(result.isError).toBe(false);
    expect(result.data).toEqual({
      name: 'T-Shirt',
      description: 'An awesome T-Shirt'
    });
  });
})

test.describe('data handling', () => {
  test('dataset registration', async ({ page }) => {
    const { mainFrame } = await setup({ page });

    // publish dataset
    const data = await mainFrame.evaluate(async () => {
      await window.sw.data.register({
        id: 'e2e-test',
        data: 'test-string',
      });

      return Object.fromEntries(window._swsdk.datasets);
    })

    expect(data.hasOwnProperty('e2e-test')).toBe(true);
    expect(data['e2e-test']).toBe('test-string');
  });

  test('dataset subscriber without selector', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // subscribe to dataset publish
    await subFrame.evaluate(async () => {
      return await window.sw.data.subscribe('e2e-test', (data) => {
        // @ts-expect-error
        window.result = { data: data.data };
      });
    })

    // publish dataset
    await mainFrame.evaluate(async () => {
      await window.sw.data.register({
        id: 'e2e-test',
        data: 'test-string',
      });
    })

    // get receiving value
    const { data } = await subFrame.evaluate(() => {
      // @ts-expect-error
      return window.result;
    })

    // check if receiving value matches
    expect(data).toBe('test-string');
  });

  test('dataset subscriber with selector', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // subscribe to dataset publish
    await subFrame.evaluate(async () => {
      return await window.sw.data.subscribe('product_detail', (data) => {
        // @ts-expect-error
        window.result = { data: data.data };
      }, {
        selectors: ['name']
      });
    })

    // publish dataset
    await mainFrame.evaluate(async () => {
      await window.sw.data.register({
        id: 'product_detail',
        data: {
          name: 'T-Shirt',
          description: 'An awesome T-Shirt'
        },
      });
    })

    // get receiving value
    const { data } = await subFrame.evaluate(() => {
      // @ts-expect-error
      return window.result;
    })

    // check if receiving value matches
    expect(data).toEqual({
      name: 'T-Shirt',
    });
  });

  test('dataset update', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // publish dataset and subscribe for changes
    const data = await mainFrame.evaluate(async () => {
      await window.sw.data.register({
        id: 'e2e-test',
        data: 'test-string',
      });

      window.sw.data.updateSubscriber(
        'e2e-test',
        (data) => {
          // @ts-expect-error
          window.result = data.data;
        }
      );

      return Object.fromEntries(window._swsdk.datasets);
    })

    expect(data.hasOwnProperty('e2e-test')).toBe(true);
    expect(data['e2e-test']).toBe('test-string');

    // update value from subframe
    await subFrame.evaluate(async () => {
      await window.sw.data.update({
        id: 'e2e-test',
        data: 'updated-string',
      });
    });

    // get updated value in main frame
    const result = await mainFrame.evaluate(() => {
      // @ts-expect-error
      return window.result;
    })

    expect(result).toBe('updated-string');
  });

  test('dataset get', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // Simulate handle of get
    await mainFrame.evaluate(async () => {
      window.sw.data.handleGet((data) => {
        return 'test-string';
      });
    })

    // Get dataset
    const data = await subFrame.evaluate(async () => {
      return await window.sw.data.get('e2e-test').then((data) => {
        return data;
      });
    })

    // check if receiving value matches
    expect(data).toBe('test-string');
  });
})
