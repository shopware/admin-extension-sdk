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
      const handle = window.sw_internal.handleFactory({});

      handle('_multiply', () => {
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
      const handle = window.sw_internal.handleFactory({});

      handle('_multiply', ({ firstNumber, secondNumber }) => {
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
      const handle = window.sw_internal.handleFactory({});

      handle('notificationDispatch', ({ actions }) => {
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
      const handle = window.sw_internal.handleFactory({});

      handle('notificationDispatch', () => {
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
      const handle = window.sw_internal.handleFactory({});

      handle('contextLanguage', () => {
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

  test('send criteria to iFrame', async ({ page }) => {
    const { mainFrame, subFrame } = await setup({ page });

    // handle incoming criteria
    await mainFrame.evaluate(() => {
      const handle = window.sw_internal.handleFactory({});

      handle('_criteriaTest', ({ title, myCriteria }) => {
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
      const handle = window.sw_internal.handleFactory({});

      handle('_collectionTest', ({ title, collection}) => {
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
      // @ts-expect-error
      collection.add(new window.sw_internal.Entity('1', 'test', {}));
      // @ts-expect-error
      collection.add(new window.sw_internal.Entity('2', 'test', {}));

      const result = await window.sw_internal.send('_collectionTest', {
        title: 'Collection testing',
        collection,
      })

      return {
        title: result.title,
        isCollectionInstance: result.collection instanceof window.sw_internal.Collection
      };
    })

    // check if collection is a real collection object
    expect (result.title).toEqual('Collection testing');
    expect (result.isCollectionInstance).toBe(true);
  });
})
