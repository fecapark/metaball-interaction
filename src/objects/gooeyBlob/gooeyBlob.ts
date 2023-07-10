import { Vector2 } from "../../utils/vector";
import BlobAnimationUpdateBridge from "./updater/animationUpdateBridge";
import WebGLManager from "../../managers/webglManager";
import { randInt } from "../../utils/random";
import { GooeyOption } from "../../core/options";
import { IBaseBlob, IBlobProps } from "../../../types/objects/blob";
import GooeyBlobSnapshot from "./gooeyBlobSnapshot";
import { Animator } from "../../utils/animator";
import { useAnimator } from "../../utils/animator";
import Range from "../../utils/range";
import BlobManager from "../../managers/blobManager";

export default class GooeyBlob implements IBaseBlob {
  private shrinkAnimator: Animator<number> | null;

  public snapshot: GooeyBlobSnapshot;
  public bridge: BlobAnimationUpdateBridge;
  public pos;
  public color;
  public alpha;
  public radius;
  public isDead = false;

  constructor({ x, y, radius, color, alpha = 1 }: IBlobProps) {
    this.pos = new Vector2(x, y);
    this.radius = radius;
    this.color = color;
    this.alpha = alpha;
    this.shrinkAnimator = null;

    this.snapshot = new GooeyBlobSnapshot({ radius });
    this.bridge = new BlobAnimationUpdateBridge(this.snapshot);
  }

  update() {
    this.pos = this.bridge.update();

    if (this.bridge.stateName === "merge") {
      const startRadius = this.radius;

      this.shrinkAnimator ??= useAnimator<number>({
        duration: GooeyOption.merge.duration * 0.8,
        easingFn: GooeyOption.merge.easeFn,
        onAnimate: (ratio) => this.getAnimatedShrinkRadius(ratio, startRadius),
      });

      const { payload } = this.shrinkAnimator();
      this.radius = payload;
    } else {
      this.shrinkAnimator = null;
    }
  }

  getAnimatedShrinkRadius(ratio: number, startRadius: number) {
    const { radius: originRaidus, amplitude: originAmplitude } =
      this.bridge.snapshot;
    const { amplitude } = this.bridge;

    const targetRadius = originRaidus * (amplitude / originAmplitude);
    return startRadius - (startRadius - targetRadius) * ratio;
  }

  draw() {
    const gp = WebGLManager.getInstance().graphics;

    gp.beginFill(this.color, this.alpha);
    gp.drawCircle(this.pos.x, this.pos.y, this.radius);
    gp.endFill();
  }

  resize() {
    const { amplitude: originAmplitude } = this.snapshot;
    const { amplitude } = this.bridge;
    const newRadius = randInt(GooeyOption.radiusRange());

    this.snapshot.radius = newRadius;
    this.radius = newRadius * (amplitude / originAmplitude);

    this.bridge.resize();
  }

  setBlobAmplitude(fn: (prev: number) => number) {
    const isGrowth = () => {
      return prevAmplitude < nextAmplitude;
    };

    const { canExploed } = BlobManager.getInstance();
    const { radius: originRaidus, amplitude: originAmplitude } = this.snapshot;
    const { amplitude } = this.bridge;

    const prevAmplitude = this.bridge.amplitude;
    const nextAmplitude = fn(prevAmplitude);

    this.bridge.amplitude = nextAmplitude;

    if (isGrowth() && canExploed) {
      this.radius = originRaidus * (amplitude / originAmplitude);
    }
  }

  growth(times: number = 1) {
    const { amplitude: originAmplitude } = this.snapshot;
    const boundary = GooeyOption.amplitudeBoundaryRatioRange();

    this.setBlobAmplitude((prev) => {
      const ratio = Range.transform(
        prev,
        [originAmplitude * boundary[0], originAmplitude * boundary[1]],
        [0.001, 0.00008]
      );
      return prev * Math.pow(1 + ratio, times);
    });
  }

  shrink() {
    this.setBlobAmplitude((prev) => {
      return prev * 0.5;
    });
  }
}
