import { Application, Graphics } from "pixi.js";
import { useGrapic, useRenderer } from "../core/grapic";

export default class WebGLManager {
  private static instance: WebGLManager;

  public renderer: Application;
  public graphics: Graphics;

  private constructor() {
    this.renderer = useRenderer();
    this.graphics = useGrapic(this.renderer);
  }

  static getInstance() {
    WebGLManager.instance ??= new WebGLManager();
    return WebGLManager.instance;
  }
}
