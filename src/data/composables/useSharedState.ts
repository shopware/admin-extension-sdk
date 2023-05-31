import SerializerFactory from './../../_internals/serializer';
import localforage from 'localforage';
import type { UnwrapRef, WatchStopHandle } from 'vue';
import { reactive, watch, onBeforeUnmount } from 'vue';
import { handle, send } from '../../channel';

const { serialize, deserialize } = SerializerFactory({
  handle: handle,
  send: send,
});

function createValueWatcher<INITIAL_VALUE>({
  key,
  sharedValue,
  persistentSharedValueStore,
  persistentSharedValueStoreBroadcast,
  getPendingValue,
}: {
  key: string,
  sharedValue: {
    value: UnwrapRef<INITIAL_VALUE>,
  },
  persistentSharedValueStore: LocalForage,
  persistentSharedValueStoreBroadcast: BroadcastChannel,
  getPendingValue: () => boolean,
}): WatchStopHandle {
  return watch(
    () => sharedValue.value,
    async (newValue) => {
      if (getPendingValue()) {
        return;
      }

      const serializedValue = serialize(newValue) as UnwrapRef<INITIAL_VALUE>;
      await persistentSharedValueStore.setItem(key, serializedValue);

      persistentSharedValueStoreBroadcast.postMessage({
        type: 'store-change',
        key: key,
      });
    },
    { deep: true }
  );
}

function setRemoteValue<INITIAL_VALUE>({
  setPendingValue,
  removeWatcher,
  setWatcher,
  store,
  key,
  sharedValue,
}: {
  setPendingValue: (newValue: boolean) => void,
  removeWatcher: () => void,
  setWatcher: () => void,
  store: LocalForage,
  key: string,
  sharedValue: {
    value: UnwrapRef<INITIAL_VALUE>,
  },
}): void {
  setPendingValue(true);
  removeWatcher();

  store.getItem<INITIAL_VALUE>(key)
    .then((value) => {
      if (value === null) {
        return;
      }

      const deserializedValue = deserialize(value, new MessageEvent('message')) as UnwrapRef<INITIAL_VALUE>;

      sharedValue.value = deserializedValue;
    })
    .finally(() => {
      setPendingValue(false);
      setWatcher();
    });
}

/**
 * 
 * @param key - Shared state key
 * @param initalValue - Initial value
 * @returns 
 */
export function useSharedState<INITIAL_VALUE>(key: string, initalValue: INITIAL_VALUE): {
  value: UnwrapRef<INITIAL_VALUE>,
} {
  let isPending = false;

  const getPendingValue = (): boolean => isPending;
  const setPendingValue = (newValue: boolean): void => {
    isPending = newValue;
  };
  const removeWatcher = (): void => {
    unwatchValue();
  };
  const setWatcher = (): void => {
    unwatchValue();

    unwatchValue = createValueWatcher<INITIAL_VALUE>({
      key,
      sharedValue,
      persistentSharedValueStore,
      persistentSharedValueStoreBroadcast,
      getPendingValue,
    });
  };

  const persistentSharedValueStore = localforage.createInstance({
    name: 'adminExtensionSDK',
    storeName: 'persistentSharedValueStore',
  });

  const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');

  const sharedValue = reactive({
    value: initalValue,
  });

  let unwatchValue = createValueWatcher<INITIAL_VALUE>({
    key,
    sharedValue,
    persistentSharedValueStore,
    persistentSharedValueStoreBroadcast,
    getPendingValue,
  });

  const eventListener = (event: MessageEvent<{
    type: string,
    key: string,
  }>): void => {
    if (event.data.type !== 'store-change') {
      return;
    }

    if (event.data.key !== key) {
      return;
    }

    setRemoteValue({
      setPendingValue,
      removeWatcher,
      setWatcher,
      store: persistentSharedValueStore,
      key,
      sharedValue,
    });
  };

  persistentSharedValueStoreBroadcast.addEventListener('message', eventListener);

  onBeforeUnmount(() => {
    persistentSharedValueStoreBroadcast.close();
    persistentSharedValueStoreBroadcast.removeEventListener('message', eventListener);
  });

  // Get initial value from remote
  setRemoteValue({
    setPendingValue,
    removeWatcher,
    setWatcher,
    store: persistentSharedValueStore,
    key,
    sharedValue,
  });

  return sharedValue;
}
