import Range from "../utils/range";

type RandomRange = [number, number];

interface IGooeyOption {
  amount: number;
  radiusRange: (w: number, h: number) => RandomRange;
  gooey: {
    tSpeedRange: RandomRange;
    amplitudeRange: RandomRange;
  };
  merge: {
    duration: number;
    easeFn: [number, number, number, number];
  };
  explode: {
    forceRange: (w: number, h: number) => RandomRange;
    accelFactorRange: RandomRange;
    bounce: number;
  };
}

const GOOEY_MEDIA_SIZE = {
  min: 300,
  max: 1000,
};

export const blobColor = "#F4B400";

export const gooeyOption: IGooeyOption = {
  amount: 400,
  radiusRange: (stageWidth: number, stageHeight: number) => {
    const curMedia = Math.min(stageWidth, stageHeight) / 2;
    const min = Range.transform(
      curMedia,
      [GOOEY_MEDIA_SIZE.min / 2, GOOEY_MEDIA_SIZE.max / 2],
      [5, 10]
    );
    const max = Range.transform(
      curMedia,
      [GOOEY_MEDIA_SIZE.min / 2, GOOEY_MEDIA_SIZE.max / 2],
      [15, 30]
    );
    return [min, max];
  },
  gooey: {
    tSpeedRange: [0.01, 0.1],
    amplitudeRange: [20, 70],
  },
  merge: {
    duration: 1,
    easeFn: [0.83, 0, 0.17, 1],
  },
  explode: {
    forceRange: (stageWidth: number, stageHeight: number) => {
      const MIN_MAXIMUM_RATIO = 0.6;
      const MIN_MINIMUM_RATIO = 0.4;

      const curMedia = Math.min(stageWidth, stageHeight) / 2;
      const minRatio = Range.transform(
        curMedia,
        [GOOEY_MEDIA_SIZE.min / 2, GOOEY_MEDIA_SIZE.max / 2],
        [0, MIN_MAXIMUM_RATIO - MIN_MINIMUM_RATIO]
      );

      const min = Math.max(
        curMedia * (MIN_MAXIMUM_RATIO - minRatio),
        (GOOEY_MEDIA_SIZE.min / 2) * (MIN_MAXIMUM_RATIO - minRatio)
      );
      const max = Math.min(curMedia * 1.2, (GOOEY_MEDIA_SIZE.max / 2) * 1.2);
      // return [min, max];
      return [max * 0.9, max];
    },
    accelFactorRange: [20, 80],
    bounce: 0.83,
  },
};
