import { IBaseBlob, IBlobProps } from "../../../types/objects/blob";
import StageManager from "../../managers/stageManager";
import WebGLManager from "../../managers/webglManager";
import Range from "../../utils/range";
import { Vector2 } from "../../utils/vector";

export default class FeederBlob implements IBaseBlob {
  private isProtrude: boolean = false;

  public pos;
  public color;
  public alpha;
  public radius;

  public accel: Vector2;
  public speed: Vector2;

  public isDead = false;

  constructor({ x, y, radius, color, alpha = 1 }: IBlobProps) {
    this.pos = new Vector2(x, y);
    this.radius = radius;
    this.color = color;
    this.alpha = alpha;

    this.accel = new Vector2();
    this.speed = new Vector2();
  }

  update() {
    const isPassedCenter = (nextPos: Vector2) => {
      const pathVec = nextPos.sub(this.pos);
      const centerVec = centerPos.sub(this.pos);
      const cos = pathVec.dot(centerVec) / (pathVec.norm() * centerVec.norm());

      const cond1 = pathVec.norm() >= centerVec.norm();
      const cond2 = new Range(cos).isPossitive();

      return cond1 && cond2;
    };

    if (this.isDead) return;

    const { stageWidth, stageHeight } = StageManager.getInstance();
    const centerPos = new Vector2(stageWidth, stageHeight).div(2);
    const dir = centerPos.sub(this.pos).normalize();

    if (!this.isProtrude) {
      this.accel = dir.mul(0.6);
    } else {
      this.accel = dir.mul(-1).mul(20);
      this.speed = new Vector2();
      this.isProtrude = false;
    }
    this.speed = this.speed.add(this.accel);

    const nextPos = this.pos.add(this.speed);

    this.radius *= 0.975;

    if (isPassedCenter(nextPos) || this.radius < 0.5) {
      this.isDead = true;
      this.pos = centerPos;
    } else {
      this.pos = nextPos;
    }
  }

  draw() {
    const gp = WebGLManager.getInstance().graphics;

    gp.beginFill(this.color, this.alpha);
    gp.drawCircle(this.pos.x, this.pos.y, this.radius);
    gp.endFill();
  }

  resize() {}

  protrude() {
    if (this.isProtrude) return;
    this.isProtrude = true;
  }
}
