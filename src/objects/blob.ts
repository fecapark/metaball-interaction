import { Graphics, PI_2 } from "pixi.js";
import { Vector2 } from "../utils/vector";
import App from "../App";
import { randFloat, randInt } from "../utils/random";
import bezier from "bezier-easing";
import { gooeyOption } from "../core/const";

type BlobColor = string | number;
type OnFunction = (blob: Blob) => void;
type Animator<Payload> = () => { isEnd: boolean; payload: Payload };
type MergeAnimatorPayload = Vector2;

interface IBlobProps {
  x: number;
  y: number;
  radius: number;
  color: BlobColor;
  alpha?: number;
  onResize?: OnFunction;
}

interface AnimationUpdater {
  bridge: BlobAnimationUpdateBridge;
  update: () => Vector2;
  onEnd: () => void;
  resize: () => void;
}

class GooeyUpdater implements AnimationUpdater {
  private t: number;
  private tSpeed: number;
  public bridge: BlobAnimationUpdateBridge;

  constructor(bridge: BlobAnimationUpdateBridge) {
    this.bridge = bridge;
    this.t = bridge.initT;
    this.tSpeed = randFloat(gooeyOption.gooey.tSpeedRange);
  }

  update() {
    const ratio = Math.sin(this.t);
    const offset = this.bridge.dir.mul(ratio).mul(this.bridge.amplitude);
    this.t += this.tSpeed;

    return this.bridge.centerPos.add(offset);
  }

  resize() {}

  onEnd() {
    this.t = this.bridge.initT;
  }
}

class ExplodeUpdater implements AnimationUpdater {
  private dir: Vector2;
  private explodeForce: number;
  private accelFactor: number;
  private explodeSpeed: Vector2;

  public bridge: BlobAnimationUpdateBridge;

  constructor(bridge: BlobAnimationUpdateBridge) {
    this.bridge = bridge;
    this.dir = bridge.dir;
    this.explodeForce = 0;
    this.accelFactor = randInt(gooeyOption.explode.accelFactorRange);
    this.explodeSpeed = new Vector2();
  }

  update() {
    const destPos = this.bridge.centerPos.add(this.dir.mul(this.explodeForce));

    const accel = destPos.sub(this.bridge.updatedPos).div(this.accelFactor);
    this.explodeSpeed = this.explodeSpeed.add(accel);
    this.explodeSpeed = this.explodeSpeed.mul(gooeyOption.explode.bounce);

    if (this.explodeSpeed.norm() < 1) {
      this.bridge.next();
    }

    return this.bridge.updatedPos.add(this.explodeSpeed);
  }

  resize() {
    const { stageWidth, stageHeight } = this.bridge.app;

    this.explodeForce = randInt(
      gooeyOption.explode.forceRange(stageWidth, stageHeight)
    );
  }

  onEnd() {
    this.explodeSpeed = new Vector2();
    this.bridge.explodedPos = this.bridge.updatedPos;
  }
}

class MergeUpdater implements AnimationUpdater {
  private mergeAnimator: Animator<MergeAnimatorPayload> | null;

  public bridge: BlobAnimationUpdateBridge;

  constructor(bridge: BlobAnimationUpdateBridge) {
    this.bridge = bridge;
    this.mergeAnimator = null;
  }

  update() {
    const ratio = Math.sin(this.bridge.initT);
    const offset = this.bridge.dir.mul(ratio).mul(this.bridge.amplitude);
    const destPos = this.bridge.centerPos.add(offset);

    this.mergeAnimator ??= this.getMergeAnimator<MergeAnimatorPayload>({
      duration: gooeyOption.merge.duration,
      easingFn: gooeyOption.merge.easeFn,
      onAnimate: (ratio) => {
        const distVector = destPos.sub(this.bridge.explodedPos);
        const cur = distVector.mul(ratio);
        const newPos = this.bridge.explodedPos.add(cur);
        return newPos;
      },
    });

    const { isEnd, payload: newPos } = this.mergeAnimator();

    if (isEnd) {
      this.bridge.init();
    }

    return newPos;
  }

  resize() {}

  onEnd() {
    const { blobManager } = this.bridge.app.getModules();
    this.mergeAnimator = null;
    blobManager.checkAllExploded();
  }

  getMergeAnimator<Payload>({
    easingFn,
    duration,
    onAnimate,
  }: {
    easingFn: [number, number, number, number];
    duration: number;
    onAnimate: (ratio: number) => Payload;
  }): Animator<Payload> {
    let startTime: Date | null = null;
    const b = bezier(...easingFn);

    const animator = () => {
      if (!startTime) startTime = new Date();

      const elapsed = (new Date().getTime() - startTime!.getTime()) / 1000;
      const timeRatio = Math.min(elapsed / duration, 1);
      const bezierRatio = b(timeRatio);
      const payload = onAnimate(bezierRatio);

      return { isEnd: timeRatio === 1, payload };
    };

    return animator;
  }
}

class BlobAnimationUpdateBridge {
  private updateSequence: AnimationUpdater[];

  public app: App;
  public state: number;
  public dir: Vector2;
  public initT: number;
  public explodedPos: Vector2;
  public amplitude: number;
  public updatedPos: Vector2;

  constructor(app: App) {
    this.app = app;
    this.state = 0;
    this.dir = Vector2.getDir(randInt([0, 359]));
    this.initT = randInt([0, PI_2]);
    this.amplitude = randInt(gooeyOption.gooey.amplitudeRange);
    this.explodedPos = new Vector2();
    this.updatedPos = new Vector2();

    this.updateSequence = [
      new GooeyUpdater(this),
      new ExplodeUpdater(this),
      new MergeUpdater(this),
    ];

    this.resize();
  }

  get currentUpdater() {
    return this.updateSequence[this.state];
  }

  get centerPos() {
    return new Vector2(this.app.stageWidth, this.app.stageHeight).div(2);
  }

  update() {
    this.updatedPos = this.currentUpdater.update();
    return this.updatedPos;
  }

  resize() {
    this.updateSequence.forEach((updater) => {
      updater.resize();
    });
  }

  next(state?: number) {
    this.currentUpdater.onEnd();

    if (state === undefined) this.state++;
    else this.state = state;
  }

  init() {
    this.currentUpdater.onEnd();
    this.state = 0;
  }
}

export default class Blob {
  private app: App;
  private gp: Graphics;
  private onResize: OnFunction;

  public animationBridge: BlobAnimationUpdateBridge;
  public pos: Vector2;
  public color: BlobColor;
  public alpha: number;
  public radius: number;

  constructor(
    app: App,
    { x, y, radius, color, alpha = 1, onResize = () => {} }: IBlobProps
  ) {
    this.app = app;
    this.gp = app.grapic;
    this.pos = new Vector2(x, y);
    this.radius = radius;
    this.color = color;
    this.alpha = alpha;
    this.onResize = onResize;

    this.animationBridge = new BlobAnimationUpdateBridge(app);
  }

  update() {
    this.pos = this.animationBridge.update();
  }

  draw() {
    this.gp.beginFill(this.color, this.alpha);
    this.gp.drawCircle(this.pos.x, this.pos.y, this.radius);
    this.gp.endFill();
  }

  resize() {
    this.onResize(this);
    this.animationBridge.resize();
  }
}
