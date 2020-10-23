export const holder = ts => {
  return new Promise((rs, rj) => {
    setTimeout(() => {
      rs();
    }, ts);
  });
};
