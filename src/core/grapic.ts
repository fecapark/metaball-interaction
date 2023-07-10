import { Application, Graphics } from "pixi.js";
import { useAlphaThresholdFilter, useBlurFilter } from "../utils/filters";

interface IFilterOptions {
  threshold: {
    value: number;
    maskColor: string;
  };
  blur: number;
}

export function useRenderer() {
  return new Application({
    resizeTo: window,
    backgroundColor: "#121212",
    resolution: window.devicePixelRatio > 1 ? 2 : 1,
    autoDensity: true,
    antialias: true,
    powerPreference: "high-performance",
  });
}
// backgroundColor: "#f2f2f2",

export function useGrapic(renderer: Application) {
  const gp = new Graphics();
  renderer.stage.addChild(gp);
  return gp;
}

export function useFilters(renderer: Application, option: IFilterOptions) {
  const { stage, screen } = renderer;

  const alphaThresholdFilter = useAlphaThresholdFilter({
    threshold: option.threshold.value,
    maskColor: option.threshold.maskColor,
  });
  const blurFilter = useBlurFilter(option.blur);

  stage.filters = [blurFilter, alphaThresholdFilter];
  stage.filterArea = screen;
}

export function useView(renderer: Application) {
  const { view } = renderer;
  document.getElementById("gl")!.appendChild(view as HTMLCanvasElement);
}
