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

export const remove = keys => {
  return new Promise((rs, rj) => {
    chrome.storage.local.remove(keys, function() {
      rs();
    });
  });
};
