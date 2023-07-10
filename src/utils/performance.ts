export function useThrottle(fn: () => void, throttle: number) {
  let time = null;

  const throttler = () => {
    time ??= new Date().getTime();
    const elapsed = (new Date().getTime() - time) / 1000;
    if (elapsed > throttle) {
      fn();
      time = null;
    }
  };

  return throttler;
}
