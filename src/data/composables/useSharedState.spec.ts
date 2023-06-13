import type { useSharedState as useSharedStateType } from './useSharedState';
import { BroadcastChannel } from 'worker_threads';
import Vue from 'vue';
import flushPromises from 'flush-promises';
import localforage from 'localforage';

Vue.config.devtools = false;
Vue.config.productionTip = false;

let useSharedState: typeof useSharedStateType;

function mockLoadComposableInApp(composable: () => any) {
  let result: any;

  const app = new Vue({
    setup() {
      result = composable();
      
      return () => {};
    },
  });

  app.$mount(document.createElement('div'));

  return [result, app];
}

describe('useSharedState composable', () => {
  const storeMock = localforage.createInstance({
    name: 'adminExtensionSDK',
    storeName: 'persistentSharedValueStore',
  });

  beforeAll(async () => {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin === '') {
        event.stopImmediatePropagation();
        const eventWithOrigin: MessageEvent = new MessageEvent('message', {
          data: event.data,
          origin: window.location.href,
        });
        window.dispatchEvent(eventWithOrigin);
      }
    });
    
    useSharedState =  await (await import('./useSharedState')).useSharedState;
    const setExtensions = await (await import('../../channel')).setExtensions;

    setExtensions({
      'test-extension': {
        baseUrl: 'http://localhost',
        permissions: {},
      },
    });
  })

  beforeEach(async () => {
    // @ts-expect-error - Mocking BroadcastChannel
    global.BroadcastChannel = BroadcastChannel;

    const localStorageMock = (function () {
      let store = {};
    
      return {
        getItem(key: any) {
          // @ts-expect-error - Mocking localStorage
          return store[key] ?? null;
        },
    
        setItem(key: any, value: any) {
          // @ts-expect-error - Mocking localStorage
          store[key] = value;
        },
    
        clear() {
          store = {};
        },
    
        removeItem(key: any) {
          // @ts-expect-error - Mocking localStorage
          delete store[key];
        },
    
        getAll() {
          return store;
        },
      };
    })();
    
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  afterEach(async () => {
    window.localStorage.clear();
  });

  [
    {
      key: 'age',
      initialValue: 0,
    },
    {
      key: 'age',
      initialValue: 27,
    },
    {
      key: 'name',
      initialValue: 'John Doe',
    },
  ].forEach(({ key, initialValue }) => {
    it(`should return a shared state value for key "${key}" with initial value "${initialValue}"`, () => {
      const [result, app] = mockLoadComposableInApp(() => useSharedState(key, initialValue));

      expect(result.value).toBe(initialValue);

      app.$destroy();
    });
  });

  [
    {
      key: 'age',
      initialValue: 0,
      storeValue: 27,
    },
    {
      key: 'age',
      initialValue: 27,
      storeValue: 0,
    },
    {
      key: 'name',
      initialValue: 'John Doe',
      storeValue: 'Jane Doe',
    },
  ].forEach(({ key, initialValue, storeValue }) => {
    it(`should load the value from the localforage for key "${key}" with initial value "${initialValue}" and store value ${storeValue}`, async () => {
      await storeMock.setItem(key, storeValue);

      const [result, app] = mockLoadComposableInApp(() => useSharedState(key, initialValue));

      expect(result.value).toBe(initialValue);

      // wait until the value is loaded from the localforage
      await flushPromises();

      expect(result.value).toBe(storeValue);

      app.$destroy();
    });
  });

  [
    {
      key: 'age',
      initialValue: 0,
      updatedValue: 27,
    },
    {
      key: 'age',
      initialValue: 27,
      updatedValue: 0,
    },
    {
      key: 'name',
      initialValue: 'John Doe',
      updatedValue: 'Jane Doe',
    },
  ].forEach(({ key, initialValue, updatedValue }) => {
    it(`should update the value "${initialValue}" for "${key}" in the localforage when the value is changed to ${updatedValue}`, async () => {
      const [result, app] = mockLoadComposableInApp(() => useSharedState(key, initialValue));
      await flushPromises();
  
      let storeValue = await storeMock.getItem(key);
      expect(storeValue).toBe(null);
      expect(result.value).toBe(initialValue);
  
      result.value = updatedValue;
  
      // wait until the value is updated in the localforage
      await flushPromises();
  
      storeValue = await storeMock.getItem(key);
      expect(storeValue).toBe(updatedValue);
      expect(result.value).toBe(updatedValue);

      app.$destroy();
    });
  });

  it('should update all sharedStates when the value is changed', async () => {
    const [result1, app1] = mockLoadComposableInApp(() => useSharedState('age', 0));
    const [result2, app2] = mockLoadComposableInApp(() => useSharedState('age', 27));
    const [result3, app3] = mockLoadComposableInApp(() => useSharedState('name', 'John Doe'));
    await flushPromises();

    expect(result1.value).toBe(0);
    expect(result2.value).toBe(27);
    expect(result3.value).toBe('John Doe');

    result1.value = 27;
    await flushPromises();

    expect(result1.value).toBe(27);
    expect(result2.value).toBe(27);
    expect(result3.value).toBe('John Doe');

    app1.$destroy();
    app2.$destroy();
    app3.$destroy();
  });

  it('should remove broadcast event listener onBeforeUnmount', async () => {
    const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
    await flushPromises();

    expect(result.value).toBe(0);

    app.$destroy();

    await storeMock.setItem('age', 27);

    const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');

    persistentSharedValueStoreBroadcast.postMessage({
      type: 'store-change',
      key: 'age',
    });

    await flushPromises();

    expect(result.value).toBe(0);

    persistentSharedValueStoreBroadcast.close();
  });

  it('should listen to events when not unmounted yet', async () => {
    const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
    await flushPromises();

    expect(result.value).toBe(0);

    await storeMock.setItem('age', 27);

    const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');

    persistentSharedValueStoreBroadcast.postMessage({
      type: 'store-change',
      key: 'age',
    });

    await flushPromises();

    expect(result.value).toBe(27);

    persistentSharedValueStoreBroadcast.close();
    app.$destroy();
  });

  it('should ignore events which arent of type store-change', async () => {
    const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
    await flushPromises();

    expect(result.value).toBe(0);

    await storeMock.setItem('age', 27);

    const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');

    persistentSharedValueStoreBroadcast.postMessage({
      type: 'not-store-change',
      key: 'age',
    });

    await flushPromises();

    expect(result.value).toBe(0);

    persistentSharedValueStoreBroadcast.close();
    app.$destroy();
  });
});