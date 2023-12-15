const loop = (burgerCount) => {
  let burger = burgerCount;
  // eslint-disable-next-line no-empty
  for (let i = 0; i <= 999999999; i++) {}
  burger += 1;
  return burger;
};

self.onmessage = (e) => {
  const { data } = e;
  const burgerCount = loop(data[0]);
  self.postMessage(burgerCount);
};
