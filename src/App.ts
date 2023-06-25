import "./style.css";
import { Application, Graphics, ICanvas } from "pixi.js";
import { useAlphaThresholdFilter, useBlurFilter } from "./utils/filters";
import BlobManager from "./managers/blobManager";
import { Vector2 } from "./utils/vector";

export default class App {
  private gl: Application<ICanvas>;
  private gp: Graphics;
  private blobManager: BlobManager;

  private gooeyColor: string = "#4285F4";

  public stageWidth: number = 0;
  public stageHeight: number = 0;

  constructor() {
    // Set grapic renderer
    this.gl = this.setGL();
    this.gp = this.setGraphic();

    this.setFilters();
    this.setView();

    // Set resizing view
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    // Instances
    this.blobManager = new BlobManager(this.gp);

    // Set app
    this.init();
    requestAnimationFrame(this.animate.bind(this));
  }

  setGL() {
    this.gl = new Application({
      resizeTo: window,
      backgroundColor: "#f2f2f2",
      resolution: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    return this.gl;
  }

  setFilters() {
    const { stage, screen } = this.gl;

    const alphaThresholdFilter = useAlphaThresholdFilter(0.5, this.gooeyColor);
    const blurFilter = useBlurFilter(14);

    stage.filters = [blurFilter, alphaThresholdFilter];
    stage.filterArea = screen;
  }

  setView() {
    const { view } = this.gl;
    document.getElementById("app")!.appendChild(view as HTMLCanvasElement);
  }

  setGraphic() {
    const { stage } = this.gl;
    const gp = new Graphics();

    stage.addChild(gp);

    return gp;
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
  }

  init() {
    this.blobManager.setGooeyGroup({
      pos: new Vector2(this.stageWidth / 2, this.stageHeight / 2),
      color: this.gooeyColor,
      amount: 1000,
      amplitude: 300,
      radiusRange: [4, 10],
    });
  }

  animate() {
    const update = () => {
      this.blobManager.update();
    };

    const draw = () => {
      this.gp.clear();

      this.blobManager.draw();
    };

    requestAnimationFrame(this.animate.bind(this));

    update();
    draw();
  }
}
