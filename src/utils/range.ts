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
    // Slice value to range min ~ max
    const fmax = Math.max(...fromRange);
    const fmin = Math.min(...fromRange);
    value = Math.max(Math.min(value, fmax), fmin);

    // Get difference of range
    let fromDiff = fromRange[1] - fromRange[0];
    let toDiff = toRange[1] - toRange[0];

    // Get difference sign
    const isSigned = fromDiff * toDiff > 0;

    // Set unsigned to signed
    fromDiff = Math.abs(fromDiff);
    toDiff = Math.abs(toDiff);

    // Calculate
    const ratio = toDiff / fromDiff;
    const offset = value - fromRange[0];
    const start = toRange[0];

    if (isSigned) {
      return start + ratio * offset;
    }

    return start - ratio * offset;
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

  isPossitive() {
    return new Range(this.value, this.mergeResult(this.value > 0)).isIn();
  }

  isNegative() {
    return new Range(this.value, this.mergeResult(this.value < 0)).isIn();
  }
}
