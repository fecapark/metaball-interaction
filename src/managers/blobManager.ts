import Blob from "../objects/blob";
import { pickOne, randInt } from "../utils/random";
import App from "../App";
import { blobColor, gooeyOption } from "../core/const";

export default class BlobManager {
  private app: App;

  public groups: Record<string, Blob[]>;
  public canExploed: boolean = true;
  public explodedCount: number;

  constructor(app: App) {
    this.app = app;
    this.groups = {
      global: [],
    };
    this.explodedCount = 0;

    this.app.addInitFunction(() => {
      this.setGooeyGroup();
    });

    this.app.addInitFunction(() => {
      const { pointerManager } = this.app.getModules();
      pointerManager.addPointerDownHandler(() => {
        if (this.canExploed && this.isHoverOnGroup("gooey")) {
          this.triggerExplode();
        }
      });
    });
  }

  update() {
    Object.entries(this.groups).forEach(([_, blobs]) => {
      blobs.forEach((aBlob) => {
        aBlob.update();
      });
    });
  }

  draw() {
    Object.entries(this.groups).forEach(([_, blobs]) => {
      blobs.forEach((aBlob) => {
        aBlob.draw();
      });
    });
  }

  resize() {
    Object.entries(this.groups).forEach(([_, blobs]) => {
      blobs.forEach((aBlob) => {
        aBlob.resize();
      });
    });
  }

  setGroup(name: string, blobs: Blob[]) {
    if (name in this.groups) {
      this.groups[name] = [...this.groups[name], ...blobs];
    } else {
      this.groups[name] = blobs;
    }
  }

  setGooeyGroup() {
    const GOOEY_BLOB_COUNT = gooeyOption.amount;

    for (let i = 0; i < GOOEY_BLOB_COUNT; i++) {
      const RADIUS = randInt(
        gooeyOption.radiusRange(this.app.stageWidth, this.app.stageHeight)
      );

      const blob = new Blob(this.app, {
        x: 0,
        y: 0,
        radius: RADIUS,
        color: blobColor,
        onResize: (blob) => {
          blob.radius = randInt(
            gooeyOption.radiusRange(this.app.stageWidth, this.app.stageHeight)
          );
        },
      });

      this.setGroup("gooey", [blob]);
    }
  }

  isHoverOnGroup(group: string) {
    const {
      pointerManager: { pointerPos },
    } = this.app.getModules();

    if (!(group in this.groups)) return false;

    for (const blob of this.groups[group]) {
      if (blob.pos.getDistWith(pointerPos) <= blob.radius) {
        return true;
      }
    }

    return false;
  }

  checkAllExploded() {
    if (this.canExploed) return;

    this.explodedCount += 1;

    if (this.groups["gooey"].length <= this.explodedCount) {
      this.canExploed = true;
      this.explodedCount = 0;
    }
  }

  triggerExplode() {
    if (!this.canExploed) return;
    this.canExploed = false;

    for (const blob of this.groups["gooey"]) {
      blob.animationBridge.next();
    }
  }
}
