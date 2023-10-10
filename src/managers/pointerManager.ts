import { useThrottle } from "../utils/performance";
import { Vector2 } from "../utils/vector";

type PointerManagerEventHandler = (e: Vector2) => void;

export default class PointerManager {
  private static instance: PointerManager;

  private pointerDownHandlers: Array<PointerManagerEventHandler> = [];
  private pointerMoveHandlers: Array<PointerManagerEventHandler> = [];
  private untilPointerDownToUpHandlers: Array<PointerManagerEventHandler> = [];

  public pointerPos: Vector2;
  public isPointerDown: boolean;

  private constructor() {
    this.pointerPos = new Vector2();
    this.isPointerDown = false;

    const app = document.getElementById("app")!;

    app.addEventListener("pointerdown", (e) => {
      this.isPointerDown = true;
      this.savePointerPos(e);
      this.pointerDownHandlers.forEach((fn) => {
        fn(this.pointerPos);
      });
    });
    app.addEventListener("pointermove", (e) => {
      this.savePointerPos(e);
      this.pointerMoveHandlers.forEach((fn) => {
        fn(this.pointerPos);
      });
    });
    app.addEventListener("pointerup", () => {
      this.pointerEnd();
    });
    app.addEventListener("pointerleave", () => {
      this.pointerEnd();
    });
    app.addEventListener("pointercancel", () => {
      this.pointerEnd();
    });
  }

  static getInstance() {
    PointerManager.instance ??= new PointerManager();
    return PointerManager.instance;
  }

  update() {
    if (this.isPointerDown) {
      this.untilPointerDownToUpHandlers.forEach((fn) => fn(this.pointerPos));
    }
  }

  savePointerPos(e: PointerEvent) {
    this.pointerPos = new Vector2(e.clientX, e.clientY);
  }

  addPointerDownHandler(fn: PointerManagerEventHandler) {
    this.pointerDownHandlers.push(fn);
  }

  addPointerMoveHandler(
    fn: PointerManagerEventHandler,
    {
      throttle,
      triggerWhenDown = false,
    }: { throttle?: number; triggerWhenDown?: boolean }
  ) {
    if (throttle !== undefined) {
      const wrapper = useThrottle(() => {
        if (triggerWhenDown && !this.isPointerDown) return;
        fn(this.pointerPos);
      }, throttle);
      this.pointerMoveHandlers.push(wrapper);
    } else {
      this.pointerMoveHandlers.push((pos: Vector2) => {
        if (triggerWhenDown && !this.isPointerDown) return;
        fn(pos);
      });
    }
  }

  addUntilPointerDownToUpHandler(fn: PointerManagerEventHandler) {
    this.untilPointerDownToUpHandlers.push(fn);
  }

  pointerEnd() {
    this.isPointerDown = false;
  }
}
