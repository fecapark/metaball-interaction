export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
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
}
