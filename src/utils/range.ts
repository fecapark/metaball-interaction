export default class Range {
  private value: number;
  private result: boolean;
  private isOr: boolean;

  constructor(value: number, prevResult: boolean = true) {
    this.value = value;
    this.result = prevResult;
    this.isOr = false;
  }

  static transform(
    value: number,
    fromRange: [number, number],
    toRange: [number, number]
  ) {
    if (fromRange[0] > fromRange[1]) {
      [fromRange[0], fromRange[1]] = [fromRange[1], fromRange[0]];
    }

    if (toRange[0] > toRange[1]) {
      [toRange[0], toRange[1]] = [toRange[1], toRange[0]];
    }

    value = Math.max(Math.min(value, fromRange[1]), fromRange[0]);

    const fromDiff = fromRange[1] - fromRange[0];
    const toDiff = toRange[1] - toRange[0];
    const transformRatio = toDiff / fromDiff;
    const v = (value - fromRange[0]) * transformRatio + toRange[0];

    return v;
  }

  private mergeResult(prev: boolean) {
    if (this.isOr) {
      return this.result || prev;
    }

    return this.result && prev;
  }

  or(): Range {
    this.isOr = true;
    return this;
  }

  not(): Range {
    return new Range(this.value, this.mergeResult(!this.result));
  }

  moreThan(num: number): Range {
    return new Range(this.value, this.mergeResult(this.value > num));
  }

  lessThan(num: number): Range {
    return new Range(this.value, this.mergeResult(this.value < num));
  }

  equalAndMoreThan(num: number): Range {
    return new Range(this.value, this.mergeResult(this.value >= num));
  }

  equalAndLessThan(num: number): Range {
    return new Range(this.value, this.mergeResult(this.value <= num));
  }

  isIn(): boolean {
    return this.result;
  }
}
