import StageManager from "../managers/stageManager";
import Range from "../utils/range";

type RandomRange = [number, number];
type EaseFn = [number, number, number, number];

export class GooeyOption {
  static GOOEY_MEDIA_SIZE = {
    min: 300,
    max: 1000,
  };

  static amount = 300;
  static idle = {
    tSpeedRange: [0.01, 0.1] as RandomRange, // 0.1
    amplitudeRange: [20, 70] as RandomRange,
  };
  static merge = {
    duration: 0.85,
    easeFn: [0.83, 0, 0.17, 1] as EaseFn,
  };
  static explode = {
    bounce: 0.83, // 0.83
    accelFactorRange: [20, 100] as RandomRange,
    forceRange: (minFactor: number = 0.9): RandomRange => {
      const getMaxValue = () => {
        const v = curMedia * 1.2;
        const boundary = (this.GOOEY_MEDIA_SIZE.max / 2) * 1.2;
        return Math.min(v, boundary);
      };

      const { stageWidth, stageHeight } = StageManager.getInstance();
      const curMedia = Math.min(stageWidth, stageHeight) / 2;

      return [getMaxValue() * minFactor, getMaxValue()];
    },
  };

  static radiusRange(): RandomRange {
    const { stageWidth, stageHeight } = StageManager.getInstance();

    const curMedia = Math.min(stageWidth, stageHeight) / 2;
    const min = Range.transform(curMedia, this.halfMediaRange, [5, 10]);
    const max = Range.transform(curMedia, this.halfMediaRange, [20, 25]);
    return [min, max];
  }

  static amplitudeBoundaryRatioRange(): [number, number] {
    const { stageWidth, stageHeight } = StageManager.getInstance();

    const curMedia = Math.min(stageWidth, stageHeight);

    const r = Range.transform(
      curMedia,
      [this.GOOEY_MEDIA_SIZE.min, this.GOOEY_MEDIA_SIZE.max],
      [1.8, 3]
    );

    return [0.45, r];
  }

  static get halfMediaRange(): [number, number] {
    return [this.GOOEY_MEDIA_SIZE.min / 2, this.GOOEY_MEDIA_SIZE.max / 2];
  }
}
