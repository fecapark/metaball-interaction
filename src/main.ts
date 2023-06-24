import "./style.css";
import { Application, BlurFilter, Graphics, Filter } from "pixi.js";

function useThresholdFilter(threshold: number) {
  const filter = new Filter(
    undefined,
    [
      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "uniform sampler2D uSampler;",
      "uniform float threshold;",
      "void main() {",
      "    vec4 color = texture2D(uSampler, vTextureCoord);",
      "    vec3 originColor = vec3(255.0, 192.0, 0.0) / 255.0;",
      "    if (color.a > threshold) {",
      "      gl_FragColor = vec4(originColor, 1.0);",
      "    } else {",
      "      gl_FragColor = vec4(vec3(0.0), 0.0);",
      "    }",
      "}",
    ].join("\n"),
    {
      threshold,
    }
  );
  return filter;
}

function useBlurFilter(blur: number) {
  const blurFilter = new BlurFilter();
  blurFilter.blur = blur;
  blurFilter.autoFit = true;
  return blurFilter;
}

window.onload = () => {
  function resize() {
    stageWidth = document.body.clientWidth;
    stageHeight = document.body.clientHeight;
  }

  const thresholdFilter = useThresholdFilter(0.5);
  const blurFilter = useBlurFilter(10);

  const app = new Application({
    resizeTo: window,
    backgroundColor: "#f2f2f2",
  });

  const { view, stage, ticker } = app;

  document.getElementById("app")?.appendChild(view as HTMLCanvasElement);

  stage.filters = [blurFilter, thresholdFilter];
  stage.filterArea = app.screen;

  const gp = new Graphics();

  let x = 0;
  let y = 0;
  let stageWidth = 0;
  let stageHeight = 0;

  ticker.add(() => {
    gp.clear();
    gp.beginFill("#ffcc00");
    gp.drawCircle(stageWidth / 2, stageHeight / 2, 120);
    gp.endFill();

    gp.beginFill("#ffcc00");
    gp.drawCircle(x, y, 60);
    gp.endFill();
  });

  window.addEventListener("resize", resize);
  resize();

  document.addEventListener("pointermove", (e) => {
    x = e.offsetX;
    y = e.offsetY;
  });

  stage.addChild(gp);
};
