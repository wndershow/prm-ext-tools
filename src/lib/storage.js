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

export const getAll = () => {
  return new Promise((rs, rj) => {
    chrome.storage.local.get(null, function(result) {
      rs(result);
    });
  });
};

export const clear = (namespace = null) => {
  return new Promise(async (rs, rj) => {
    if (namespace) {
      let delKeys = [];
      let all = await get(null);
      const keys = Object.keys(all);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (key.indexOf(namespace) === 0) delKeys.push(key);
      }
      await remove(delKeys);

      return rs();
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
  return await set({ [`${namespace}_${name}`]: value });
};

export const getStore = async (name, value = null, { namespace = '' } = {}) => {
  let data = await get({ [`${namespace}_${name}`]: value });
  return data[`${namespace}_${name}`] || value;
};

export const useStore = (name, { namespace = '' } = {}) => {
  const [value, setValue] = useState({});
  const names = typeof name === 'string' ? [name] : name;

  useEffect(async () => {
    let data = {};
    for (let index = 0; index < names.length; index++) {
      const n = names[index];
      data[n] = await getStore(n, null, { namespace });
    }
    if (Object.keys(data).length) {
      setValue(data);
    }

    chrome.storage.onChanged.addListener(function(changes, area) {
      const data = {};
      for (let index = 0; index < names.length; index++) {
        const n = names[index];
        let cd = changes[`${namespace}_${n}`] || null;
        if (!cd) continue;
        data[n] = cd.newValue || null;
      }
      if (Object.keys(data).length) {
        setValue(data);
      }
    });
  }, [name, namespace]);

  return value;
};
