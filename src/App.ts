import "./style.css";
import { Application, Graphics, ICanvas } from "pixi.js";
import BlobManager from "./managers/blobManager";
import PointerManager from "./managers/pointerManager";
import { useFilters, useGrapic, useRenderer, useView } from "./core/grapic";
import { blobColor } from "./core/const";

interface IAppModules {
  blobManager: BlobManager;
  pointerManager: PointerManager;
}

export default class App {
  private renderer: Application<ICanvas>;
  public grapic: Graphics;
  private initFunctions: Array<() => void> = [];

  public blobManager: BlobManager;
  public pointerManager: PointerManager;
  public stageWidth: number = 0;
  public stageHeight: number = 0;

  constructor() {
    // Set grapic renderer
    this.renderer = useRenderer();
    this.grapic = useGrapic(this.renderer);

    useFilters(this.renderer, {
      threshold: {
        value: 0.5,
        maskColor: blobColor,
      },
      blur: 14,
    });
    useView(this.renderer);

    // Instances
    this.blobManager = new BlobManager(this);
    this.pointerManager = new PointerManager(this);

    // Set resizing view
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    // Set app
    this.init();
    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.blobManager.resize();
  }

  init() {
    this.initFunctions.forEach((fn) => {
      fn();
    });
  }

  addInitFunction(fn: () => void) {
    this.initFunctions.push(fn);
  }

  animate() {
    const update = () => {
      this.blobManager.update();
    };

    const draw = () => {
      this.grapic.clear();
      this.blobManager.draw();
    };

    requestAnimationFrame(this.animate.bind(this));

    update();
    draw();
  }

  getModules(): IAppModules {
    return {
      blobManager: this.blobManager,
      pointerManager: this.pointerManager,
    };
  }
}
