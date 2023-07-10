import {
  IAnimationUpdater,
  IBlobAnimationUpdateBridge,
} from "../../../../types/objects/blob/updater";
import { GooeyOption } from "../../../core/options";
import { Vector2 } from "../../../utils/vector";
import BlobManager from "../../../managers/blobManager";
import { Animator, useAnimator } from "../../../utils/animator";

export default class MergeUpdater implements IAnimationUpdater {
  private mergeAnimator: Animator<Vector2> | null;

  public bridge;

  constructor(bridge: IBlobAnimationUpdateBridge) {
    this.bridge = bridge;
    this.mergeAnimator = null;
  }

  update() {
    const merge = (bezierRatio: number) => {
      const { t, dir } = this.bridge.snapshot;
      const { amplitude, centerPos, explodedPos } = this.bridge;

      const ratio = Math.sin(t);
      const offset = dir.mul(ratio).mul(amplitude);
      const destPos = centerPos.add(offset);

      const distVector = destPos.sub(explodedPos);
      const cur = distVector.mul(bezierRatio);
      const newPos = explodedPos.add(cur);

      return newPos;
    };

    this.mergeAnimator ??= useAnimator<Vector2>({
      duration: GooeyOption.merge.duration,
      easingFn: GooeyOption.merge.easeFn,
      onAnimate: merge,
    });

    const { isEnd, payload: newPos } = this.mergeAnimator();

    if (isEnd) this.bridge.init();
    return newPos;
  }

  resize() {}

  onStart() {}

  onEnd() {
    this.mergeAnimator = null;
    BlobManager.getInstance().checkAllExploded();
  }
}
