import {
  IAnimationUpdater,
  IBlobAnimationUpdateBridge,
} from "../../../../types/objects/blob/updater";
import { GooeyOption } from "../../../core/options";
import BlobManager from "../../../managers/blobManager";
import { randFloat, randInt } from "../../../utils/random";
import Range from "../../../utils/range";
import { Vector2 } from "../../../utils/vector";

export default class ExplodeUpdater implements IAnimationUpdater {
  private accelFactor: number;
  private explodeSpeed: Vector2;

  public explodeForce: number;
  public bridge;

  public test: number;

  constructor(bridge: IBlobAnimationUpdateBridge) {
    this.bridge = bridge;
    this.explodeForce = 0;
    this.accelFactor = randInt(GooeyOption.explode.accelFactorRange);
    this.explodeSpeed = new Vector2();

    this.test = randFloat([0.75, 1.5]);
  }

  update() {
    const getExplodeForceRatioByAmplitude = () => {
      const BOUNDARY_RANGE: [number, number] = [0.65, 1.2];

      const { amplitude } = this.bridge;
      const { amplitude: originAmplitude } = this.bridge.snapshot;

      const boundary = GooeyOption.amplitudeBoundaryRatioRange();
      const AMPLITUDE_RANGE: [number, number] = [
        originAmplitude * boundary[0],
        originAmplitude * boundary[1],
      ];

      const res = Range.transform(amplitude, AMPLITUDE_RANGE, BOUNDARY_RANGE);

      return res;
    };

    const { dir } = this.bridge.snapshot;
    const destPos = this.bridge.centerPos.add(
      dir.mul(this.explodeForce * getExplodeForceRatioByAmplitude() * this.test)
    );

    const accel = destPos.sub(this.bridge.updatedPos).div(this.accelFactor);
    this.explodeSpeed = this.explodeSpeed.add(accel);
    this.explodeSpeed = this.explodeSpeed.mul(GooeyOption.explode.bounce);

    if (this.explodeSpeed.norm() < 1) {
      this.bridge.next();
    }

    const newPos = this.bridge.updatedPos.add(this.explodeSpeed);

    return newPos;
  }

  getExplodeForceRangeMinRatio() {
    const BOUNDARY_RANGE: [number, number] = [0.2, 0.9];

    const { maxBlobAmplitude, maxBlobAmplitudeRange } =
      BlobManager.getInstance();

    const res = Range.transform(
      maxBlobAmplitude,
      maxBlobAmplitudeRange,
      BOUNDARY_RANGE
    );

    return res;
  }

  resize() {
    const r = this.getExplodeForceRangeMinRatio();
    this.explodeForce = randInt(GooeyOption.explode.forceRange(r));
  }

  onStart() {
    const r = this.getExplodeForceRangeMinRatio();
    this.explodeForce = randInt(GooeyOption.explode.forceRange(r));
  }

  onEnd() {
    this.explodeSpeed = new Vector2();
    this.bridge.explodedPos = this.bridge.updatedPos;
  }
}
