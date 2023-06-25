import { Graphics } from "pixi.js";
import { Vector2 } from "../utils/vector";

type BlobColor = string | number;
type OnUpdateFunction = (
  setX: (x: number) => void,
  setY: (y: number) => void,
  setAlpha: (a: number) => void
) => void;

interface IBlobProps {
  x: number;
  y: number;
  radius: number;
  color: BlobColor;
  alpha?: number;
  onUpdate?: OnUpdateFunction;
}

export default class Blob {
  private gp: Graphics;
  private onUpdate: OnUpdateFunction;

  public pos: Vector2;
  public color: BlobColor;
  public alpha: number;
  public radius: number;

  constructor(
    gp: Graphics,
    { x, y, radius, color, alpha = 1, onUpdate = () => {} }: IBlobProps
  ) {
    this.gp = gp;
    this.pos = new Vector2(x, y);
    this.radius = radius;
    this.color = color;
    this.alpha = alpha;
    this.onUpdate = onUpdate;

    console.log(this.color);
  }

  private setX(x: number) {
    this.pos.x = x;
  }

  private setY(y: number) {
    this.pos.y = y;
  }

  private setAlpha(a: number) {
    this.alpha = a;
  }

  update() {
    this.onUpdate(
      this.setX.bind(this),
      this.setY.bind(this),
      this.setAlpha.bind(this)
    );
  }

  draw() {
    this.gp.beginFill(this.color, this.alpha);
    this.gp.drawCircle(this.pos.x, this.pos.y, this.radius);
    this.gp.endFill();
  }
}
