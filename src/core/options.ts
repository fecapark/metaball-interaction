import StageManager from "../managers/stageManager";
import Range from "../utils/range";

type RandomRange = [number, number];
type EaseFn = [number, number, number, number];

export class GooeyOption {
  static GOOEY_MEDIA_SIZE = {
    min: 300,
    max: 1000,
  };

  static amount = 300; // end
  static idle = {
    // end
    tSpeedRange: [0.01, 0.1] as RandomRange, // 0.1
    amplitudeRange: [20, 70] as RandomRange,
  };
  static merge = {
    //end
    duration: 0.85,
    easeFn: [0.83, 0, 0.17, 1] as EaseFn,
  };
  static explosionSizeRatioValue: [number, number] = [0.9, 1.2];
  static explode = {
    // end
    bounce: 0.83, // 0.83
    accelFactorRange: [20, 100] as RandomRange,
    forceRange: (
      minFactor: number = GooeyOption.explosionSizeRatioValue[0]
    ): RandomRange => {
      const getMaxValue = () => {
        const v = curMedia * GooeyOption.explosionSizeRatioValue[1];
        const boundary =
          (this.GOOEY_MEDIA_SIZE.max / 2) *
          GooeyOption.explosionSizeRatioValue[1];
        return Math.min(v, boundary);
      };

      const { stageWidth, stageHeight } = StageManager.getInstance();
      const curMedia = Math.min(stageWidth, stageHeight) / 2;

      return [getMaxValue() * minFactor, getMaxValue()];
    },
  };

  static randomRangeValue = [10, 25];
  static radiusRange(): RandomRange {
    const { stageWidth, stageHeight } = StageManager.getInstance();

    const curMedia = Math.min(stageWidth, stageHeight) / 2;
    const min = Range.transform(curMedia, this.halfMediaRange, [
      GooeyOption.randomRangeValue[0] * 0.5,
      GooeyOption.randomRangeValue[0],
    ]);
    const max = Range.transform(curMedia, this.halfMediaRange, [
      GooeyOption.randomRangeValue[1] * 0.8,
      GooeyOption.randomRangeValue[1],
    ]);
    return [min, max];
  }

  static amplitudeMinRatioValue = 0.45;
  static amplitudeMaxRatioValue: RandomRange = [1.8, 3];
  static amplitudeBoundaryRatioRange(): [number, number] {
    const { stageWidth, stageHeight } = StageManager.getInstance();

    const curMedia = Math.min(stageWidth, stageHeight);

    const r = Range.transform(
      curMedia,
      [this.GOOEY_MEDIA_SIZE.min, this.GOOEY_MEDIA_SIZE.max],
      GooeyOption.amplitudeMaxRatioValue
    );

    return [GooeyOption.amplitudeMinRatioValue, r];
  }

  static get halfMediaRange(): [number, number] {
    return [this.GOOEY_MEDIA_SIZE.min / 2, this.GOOEY_MEDIA_SIZE.max / 2];
  }
}
