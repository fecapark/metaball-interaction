import {
  IAnimationUpdater,
  IBlobAnimationUpdateBridge,
} from "../../../../types/objects/blob/updater";
import { GooeyOption } from "../../../core/options";
import { randFloat } from "../../../utils/random";
import Range from "../../../utils/range";

export default class GooeyUpdater implements IAnimationUpdater {
  private t: number;
  private tSpeed: number;

  public bridge;

  constructor(bridge: IBlobAnimationUpdateBridge) {
    this.bridge = bridge;
    this.t = bridge.snapshot.t;
    this.tSpeed = randFloat(GooeyOption.idle.tSpeedRange);
  }

  update() {
    const { dir, amplitude: originAmplitude } = this.bridge.snapshot;
    const { centerPos, amplitude } = this.bridge;

    const ratio = Math.sin(this.t);
    const offset = dir.mul(ratio).mul(amplitude);
    const newPos = centerPos.add(offset);

    const boundary = GooeyOption.amplitudeBoundaryRatioRange();
    const ar = Range.transform(
      amplitude,
      [originAmplitude * boundary[0], originAmplitude * boundary[1]],
      [1.5, 0.35]
    );

    this.t += this.tSpeed * ar;

    return newPos;
  }

  resize() {}

  onStart() {}

  onEnd() {
    const { t } = this.bridge.snapshot;
    this.t = t;
  }
}
