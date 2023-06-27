export function randInt([from, to]: [number, number]) {
  const buffer = new Uint32Array(1);
  const randBuffer = window.crypto.getRandomValues(buffer);
  const randNum = randBuffer[0] / (0xffffffff + 1);
  return Math.floor(randNum * (to - from + 1)) + from;
}

export function randFloat([from, to]: [number, number]) {
  const buffer = new Uint32Array(1);
  const randBuffer = window.crypto.getRandomValues(buffer);
  const randNum = randBuffer[0] / (0xffffffff + 1);
  return randNum * (to - from) + from;
}

export function pickOne<T>(...items: T[]): T {
  const idx = randInt([0, items.length - 1]);
  return items[idx];
}
