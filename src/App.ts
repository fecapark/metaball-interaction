import "./style.css";
import { Application, ICanvas } from "pixi.js";
import BlobManager from "./managers/blobManager";
import PointerManager from "./managers/pointerManager";
import { useFilters, useView } from "./core/grapic";
import { blobColor } from "./core/const";
import StageManager from "./managers/stageManager";
import WebGLManager from "./managers/webglManager";

export default class App {
  private renderer: Application<ICanvas>;

  private blobManager: BlobManager;
  private pointerManager: PointerManager;

  constructor() {
    // Set grapic renderer
    this.renderer = WebGLManager.getInstance().renderer;

    useFilters(this.renderer, {
      threshold: {
        value: 0.5,
        maskColor: blobColor,
      },
      blur: 14,
    });
    useView(this.renderer);

    // Instances
    this.blobManager = BlobManager.getInstance();
    this.pointerManager = PointerManager.getInstance();
    StageManager.getInstance();

    // Set app
    this.init();
    requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    this.blobManager.init();
  }

  animate() {
    const update = () => {
      this.pointerManager.update();
      this.blobManager.update();
    };

    const draw = () => {
      WebGLManager.getInstance().graphics.clear();
      this.blobManager.draw();
    };

    requestAnimationFrame(this.animate.bind(this));
    update();
    draw();
  }
}
