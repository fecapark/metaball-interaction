import { blobColor } from "../core/const";
import { useFilters } from "../core/grapic";
import { GooeyOption } from "../core/options";
import { Vector2 } from "../utils/vector";
import BlobManager from "./blobManager";
import StageManager from "./stageManager";
import WebGLManager from "./webglManager";

type RandomRange = [number, number];

interface IOriginOptions {
  amount: number;
  radiusRange: RandomRange;
  animateSpeed: RandomRange;
  amplitude: RandomRange;
  amplitudeMinRatio: number;
  amplitudeMaxRatio: RandomRange;
  bounce: number;
  dragRange: RandomRange;
  explosionSizeRatio: [number, number];
  mergeDuration: number;
  blur: number;
  threshold: number;
}

export const initialValues: IOriginOptions = {
  amount: 300,
  radiusRange: [10, 25],
  animateSpeed: [0.01, 0.1],
  amplitude: [20, 70],
  amplitudeMinRatio: 0.45,
  amplitudeMaxRatio: [1.8, 3],
  bounce: 0.83,
  dragRange: [20, 100],
  explosionSizeRatio: [0.9, 1.2],
  mergeDuration: 0.85,
  blur: 10,
  threshold: 0.5,
};

const graphicValues = {
  blur: initialValues.blur,
  threshold: initialValues.threshold,
};

const actions: Record<keyof IOriginOptions, Function> = {
  amount: (value: number) => {
    GooeyOption.amount = value;
  },
  radiusRange: (value: RandomRange) => {
    GooeyOption.randomRangeValue = value;
  },
  animateSpeed: (value: RandomRange) => {
    GooeyOption.idle.tSpeedRange = [...value];
  },
  amplitude: (value: RandomRange) => {
    GooeyOption.idle.amplitudeRange = [...value];
  },
  amplitudeMinRatio: (value: number) => {
    GooeyOption.amplitudeMinRatioValue = value;
  },
  amplitudeMaxRatio: (value: RandomRange) => {
    GooeyOption.amplitudeMaxRatioValue = [...value];
  },
  bounce: (value: number) => {
    GooeyOption.explode.bounce = value;
  },
  dragRange: (value: RandomRange) => {
    GooeyOption.explode.accelFactorRange = [...value];
  },
  explosionSizeRatio: (value: [number, number]) => {
    GooeyOption.explosionSizeRatioValue = [...value];
  },
  mergeDuration: (value: number) => {
    GooeyOption.merge.duration = value;
  },
  blur: (value: number) => {
    const renderer = WebGLManager.getInstance().renderer;
    useFilters(renderer, {
      threshold: {
        value: graphicValues.threshold,
        maskColor: blobColor,
      },
      blur: value,
    });
    graphicValues.blur = value;
  },
  threshold: (value: number) => {
    const renderer = WebGLManager.getInstance().renderer;
    useFilters(renderer, {
      threshold: {
        value: value,
        maskColor: blobColor,
      },
      blur: graphicValues.blur,
    });
    graphicValues.threshold = value;
  },
};

export default class OptionManager {
  private static instance: OptionManager;

  private constructor() {
    this.setEvents();
    document
      .getElementById("option-toggle-btn")!
      .addEventListener("click", () => {
        const container = document.getElementById("option-container")!;
        const btn = document.getElementById("option-toggle-btn")!;
        container.classList.toggle("hidden");
        if (container.classList.contains("hidden"))
          btn.textContent = "Show Controls";
        else btn.textContent = "Hide Controls";
      });
    // StageManager.getInstance().addResize(this.resize.bind(this));
  }

  static getInstance() {
    OptionManager.instance ??= new OptionManager();
    return OptionManager.instance;
  }

  setEvents() {
    const optionContainer = document.getElementById("option-container")!;
    const options = optionContainer.querySelectorAll(".option");

    for (const option of options) {
      if (!(option instanceof HTMLElement)) return;

      if (option.dataset.type === "range") this.setRangeTypeEvent(option);
      else if (option.dataset.type === "two-constant")
        this.setTwoConstantTypeEvent(option);
    }
  }

  setRangeTypeEvent(option: HTMLElement) {
    const { key }: { key: keyof IOriginOptions } = option.dataset as any;
    const input = option.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    const valueInput = option.querySelector(
      ".option_value"
    )! as HTMLInputElement;

    input.value = `${initialValues[key]}`;
    valueInput.value = `${initialValues[key]}`;

    input.addEventListener("input", () => {
      actions[key](parseFloat(input.value));
      valueInput.value = input.value;
      this.reInit();
    });

    this.setNumberInputPointerEvent(
      (res) => {
        actions[key](parseFloat(res));
        this.reInit();
      },
      valueInput,
      input
    );
  }

  setTwoConstantTypeEvent(option: HTMLElement) {
    const handler = () => {
      max.min = min.value;
      min.max = max.value;
      actions[key]([parseFloat(min.value), parseFloat(max.value)]);
      this.reInit();
    };

    const { key }: { key: keyof IOriginOptions } = option.dataset as any;
    const min = option.querySelector("input.min") as HTMLInputElement;
    const max = option.querySelector("input.max") as HTMLInputElement;

    const iv = initialValues[key] as [number, number];

    min.value = `${iv[0]}`;
    max.value = `${iv[1]}`;

    min.addEventListener("input", handler);
    max.addEventListener("input", handler);
    this.setNumberInputPointerEvent(handler, min);
    this.setNumberInputPointerEvent(handler, max);
  }

  reInit() {
    const blobManager = BlobManager.getInstance();

    blobManager.initExplodeStates();
    blobManager.setGooeyGroup();
    StageManager.getInstance().resize();
  }

  setNumberInputPointerEvent(
    action: (res: string) => void,
    input: HTMLInputElement,
    ...alsoChanges: HTMLInputElement[]
  ) {
    let isDown = false;
    let prevPos = new Vector2(0, 0);

    input.addEventListener("pointerdown", (e) => {
      isDown = true;
      prevPos = new Vector2(e.clientX, e.clientY);
    });
    window.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const curPos = new Vector2(e.clientX, e.clientY);
      const y = prevPos.y - curPos.y;

      if (y < 0) {
        for (let i = 0; i < -y; i++) input.stepDown();
        for (let i = 0; i < -y; i++)
          for (const otherInput of alsoChanges) otherInput.stepDown();
      } else {
        for (let i = 0; i < y; i++) input.stepUp();
        for (let i = 0; i < y; i++)
          for (const otherInput of alsoChanges) otherInput.stepUp();
      }
      action(input.value);
      prevPos = curPos;
    });
    window.addEventListener("pointerup", () => {
      if (!isDown) return;
      isDown = false;
    });
  }
}
