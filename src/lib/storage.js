import { useEffect, useState } from 'react';

export const set = items => {
  return new Promise((rs, rj) => {
    chrome.storage.local.set(items, function() {
      rs();
    });
  });
};

export const get = items => {
  return new Promise((rs, rj) => {
    chrome.storage.local.get(items, function(result) {
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

export const remove = keys => {
  return new Promise((rs, rj) => {
    chrome.storage.local.remove(keys, function() {
      rs();
    });
  });
};

export const setStore = async (name, value, { namespace = '' } = {}) => {
  let store = await get({ __ext_tools: {} });

  store = (store && store.__ext_tools) || {};

  if (namespace) {
    let spaceStore = store[namespace];
    spaceStore = { ...spaceStore, [name]: value };
    await set({ __ext_tools: { ...store, [namespace]: spaceStore } });
    return;
  }

  await set({ __ext_tools: { ...store, [name]: value } });
  return;
};

export const getStore = async (name, value = null, { namespace = '' } = {}) => {
  let store = await get({ __ext_tools: {} });
  store = (store && store.__ext_tools) || {};

  if (namespace) {
    let spaceStore = (store && store[namespace]) || {};
    return spaceStore[name] || value;
  }

  return (store && store[name]) || value;
};

export const useStore = (name, { namespace = '' } = {}) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    getStore(name, null, { namespace }).then(data => {
      setValue(data);
    });

    chrome.storage.onChanged.addListener(function(changes, area) {
      if (namespace) {
        const store = (changes[namespace] && changes[namespace].newValue) || {};
        setValue(store[name] || null);
        return;
      }

      const store = changes[name] || {};
      return setValue(store.newValue || null);
    });
  }, [name, namespace]);

  return value;
};
