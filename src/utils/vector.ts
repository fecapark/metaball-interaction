import { degToRad } from "./math";

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static getDir(deg: number) {
    return new Vector2(Math.cos(degToRad(deg)), Math.sin(degToRad(deg)));
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vector2) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  mul(num: number) {
    return new Vector2(this.x * num, this.y * num);
  }

  div(num: number) {
    if (num === 0) {
      return new Vector2(0, 0);
    }

    return new Vector2(this.x / num, this.y / num);
  }

  dot(other: Vector2) {
    return this.x * other.x + this.y * other.y;
  }

  norm() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    return this.div(this.norm());
  }

  getDistWith(other: Vector2) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
    );
  }
}
