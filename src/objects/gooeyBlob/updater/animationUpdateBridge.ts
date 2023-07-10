import { Vector2 } from "../../../utils/vector";
import GooeyUpdater from "./gooeyUpdater";
import ExplodeUpdater from "./explodeUpdater";
import MergeUpdater from "./mergeUpdater";
import {
  IAnimationUpdater,
  IBlobAnimationUpdateBridge,
} from "../../../../types/objects/blob/updater";
import StageManager from "../../../managers/stageManager";
import GooeyBlobSnapshot from "../gooeyBlobSnapshot";

export default class BlobAnimationUpdateBridge
  implements IBlobAnimationUpdateBridge
{
  private updateSequence: IAnimationUpdater[];

  public snapshot: GooeyBlobSnapshot;

  public state: number;
  public explodedPos: Vector2;
  public updatedPos: Vector2;
  public amplitude: number;
  public prevRadius: number;

  constructor(snapshot: GooeyBlobSnapshot) {
    this.snapshot = snapshot;

    this.state = 0;
    this.prevRadius = snapshot.radius;
    this.amplitude = snapshot.amplitude;
    this.explodedPos = new Vector2();
    this.updatedPos = new Vector2();

    this.updateSequence = [
      new GooeyUpdater(this),
      new ExplodeUpdater(this),
      new MergeUpdater(this),
    ];

    this.resize();
  }

  private get currentUpdater() {
    return this.updateSequence[this.state];
  }

  get centerPos() {
    const { stageWidth, stageHeight } = StageManager.getInstance();
    return new Vector2(stageWidth, stageHeight).div(2);
  }

  get stateName() {
    const names = ["gooey", "explode", "merge"] as const;
    return names[this.state];
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

    this.currentUpdater.onStart();
  }

  init() {
    this.currentUpdater.onEnd();
    this.state = 0;
    this.currentUpdater.onStart();
  }
}
