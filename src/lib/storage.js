import { useEffect, useState } from 'react';

export const set = (items) => {
  return new Promise((rs, rj) => {
    chrome.storage.local.set(items, function () {
      rs();
    });
  });
};

export const get = (items) => {
  return new Promise((rs, rj) => {
    chrome.storage.local.get(items, function (result) {
      rs(result);
    });
  });
};

export const clear = (namespace = null) => {
  return new Promise(async (rs, rj) => {
    if (namespace) {
      let store = await get({ __ext_tools: {} });
      store = (store && store.__ext_tools) || {};
      delete store[namespace];
      await set({ __ext_tools: { ...store } });
      rs();
    }

    chrome.storage.local.clear(() => {
      rs();
    });
  });
};

export const remove = (keys) => {
  return new Promise((rs, rj) => {
    chrome.storage.local.remove(keys, function () {
      rs();
    });
  });
};

const getRootStore = async () => {
  let store = await get({ __ext_tools: '{}' });

  store = (store && store.__ext_tools) || '{}';
  if (typeof store !== 'string') {
    store = '{}';
  }

  store = JSON.parse(store);

  return store;
};

export const setStore = async (name, value, { namespace = '' } = {}) => {
  let store = await getRootStore();
  if (namespace) {
    let spaceStore = store[namespace];
    spaceStore = { ...spaceStore, [name]: value };
    store = { ...store, [namespace]: spaceStore };
    await set({ __ext_tools: JSON.stringify(store) });
    return;
  }

  await set({ __ext_tools: JSON.stringify({ ...store, [name]: value }) });
  return;
};

export const getStore = async (name, value = null, { namespace = '' } = {}) => {
  let store = await getRootStore();

  if (namespace) {
    let spaceStore = (store && store[namespace]) || {};
    return spaceStore[name] || value;
  }

  return (store && store[name]) || value;
};

export const useStore = (name, { namespace = '' } = {}) => {
  const [value, setValue] = useState(null);

  useEffect(async () => {
    let data = await getStore(name, null, { namespace });
    setValue(data);

    chrome.storage.onChanged.addListener(function (changes, area) {
      if (!changes.__ext_tools) return;
      let store = null;

      try {
        store = JSON.parse(changes.__ext_tools.newValue || '{}');
      } catch (error) {
        store = {};
      }

      if (namespace) {
        const spaceStore = store[namespace] || {};
        setValue(spaceStore[name] || null);
        return;
      }

      return setValue(store[name] || null);
    });
  }, [name, namespace]);

  return value;
};
