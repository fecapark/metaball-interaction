import App from "../App";
import { Vector2 } from "../utils/vector";

type PointerManagerEventHandler = (e: Vector2) => void;

export default class PointerManager {
  private pointerDownHandlers: Array<PointerManagerEventHandler>;

  public pointerPos: Vector2;

  constructor(app: App) {
    this.pointerPos = new Vector2();
    this.pointerDownHandlers = [];

    document.addEventListener("pointerdown", (e) => {
      this.savePointerPos(e);

      this.pointerDownHandlers.forEach((fn) => {
        fn(this.pointerPos);
      });
    });
    document.addEventListener("pointermove", this.savePointerPos.bind(this));
  }

  savePointerPos(e: PointerEvent) {
    this.pointerPos = new Vector2(e.offsetX, e.offsetY);
  }

  addPointerDownHandler(fn: PointerManagerEventHandler) {
    this.pointerDownHandlers.push(fn);
  }
}
