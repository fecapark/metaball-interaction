import { PI_2 } from "pixi.js";
import { GooeyOption } from "../../core/options";
import { randFloat, randInt } from "../../utils/random";
import { Vector2 } from "../../utils/vector";
import Range from "../../utils/range";

interface IProps {
  radius: number;
}

/*
  Save origin parameters of GooeyBlob.
  Only can access from GooeyBlob and AnimationUpdateBridge.
*/

export default class GooeyBlobSnapshot {
  public radius: number;
  public amplitude: number;
  public amplitudeBornRatio: number;
  public t: number;
  public dir: Vector2;

  constructor({ radius }: IProps) {
    this.radius = radius;
    this.amplitude = randInt(GooeyOption.idle.amplitudeRange);
    this.amplitudeBornRatio = this.getAmplitudeBornRatio();
    this.t = randFloat([0, PI_2]);
    this.dir = Vector2.getDir(randInt([0, 359]));
  }

  getAmplitudeBornRatio() {
    return Range.transform(
      this.amplitude,
      GooeyOption.idle.amplitudeRange,
      [0, 1]
    );
  }
}
