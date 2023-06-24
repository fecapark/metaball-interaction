import "./style.css";
import { Application, Graphics, ICanvas } from "pixi.js";
import { useAlphaThresholdFilter, useBlurFilter } from "./utils/filters";
import { Vector2 } from "./utils/vector";

export default class App {
  private stageWidth: number = 0;
  private stageHeight: number = 0;

  private app: Application<ICanvas>;
  private gp: Graphics;

  private pos: Vector2 = new Vector2();

  constructor() {
    this.app = this.setGL();
    this.gp = this.setGraphic();

    this.setFilters();
    this.setView();

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.app.ticker.add(() => {
      this.gp.clear();

      this.gp.beginFill("#ffcc00");
      this.gp.drawCircle(this.stageWidth / 2, this.stageHeight / 2, 120);
      this.gp.endFill();

      this.gp.beginFill("#ffcc00");
      this.gp.drawCircle(this.pos.x, this.pos.y, 60);
      this.gp.endFill();
    });

    document.addEventListener("pointermove", (e) => {
      this.pos = new Vector2(e.offsetX, e.offsetY);
    });
  }

  setGL() {
    this.app = new Application({
      resizeTo: window,
      backgroundColor: "#f2f2f2",
      resolution: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    return this.app;
  }

  setFilters() {
    const { stage, screen } = this.app;

    const alphaThresholdFilter = useAlphaThresholdFilter(0.5);
    const blurFilter = useBlurFilter(14);

    stage.filters = [blurFilter, alphaThresholdFilter];
    stage.filterArea = screen;
  }

  setView() {
    const { view } = this.app;
    document.getElementById("app")!.appendChild(view as HTMLCanvasElement);
  }

  setGraphic() {
    const { stage } = this.app;
    const gp = new Graphics();

    stage.addChild(gp);

    return gp;
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
  }
}
