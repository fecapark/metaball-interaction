import bezier from "bezier-easing";

export type Animator<Payload> = () => { isEnd: boolean; payload: Payload };

interface IAnimatorProp<Payload> {
  easingFn: [number, number, number, number];
  duration: number;
  onAnimate: (ratio: number) => Payload;
}

export function useAnimator<Payload>({
  easingFn,
  duration,
  onAnimate,
}: IAnimatorProp<Payload>): Animator<Payload> {
  let startTime: Date | null = null;
  const b = bezier(...easingFn);

  const animator: Animator<Payload> = () => {
    if (!startTime) startTime = new Date();

    const elapsed = (new Date().getTime() - startTime!.getTime()) / 1000;
    const timeRatio = Math.min(elapsed / duration, 1);
    const bezierRatio = b(timeRatio);
    const payload = onAnimate(bezierRatio);

    return { isEnd: timeRatio === 1, payload };
  };

  return animator;
}
