import { Graphics } from "pixi.js";
import Blob from "../objects/blob";
import { degToRad } from "../utils/math";
import { randFloat, randInt } from "../utils/random";
import { Vector2 } from "../utils/vector";

export default class BlobManager {
  private gp: Graphics;

  public groups: Record<string, Blob[]>;

  constructor(gp: Graphics) {
    this.gp = gp;
    this.groups = {
      global: [],
    };
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

  setGroup(name: string, blobs: Blob[]) {
    if (name in this.groups) {
      this.groups[name] = [...this.groups[name], ...blobs];
    } else {
      this.groups[name] = blobs;
    }
  }

  setGooeyGroup({
    pos,
    color,
    amount,
    amplitude,
    radiusRange,
  }: {
    pos: Vector2;
    color: string;
    amount: number;
    amplitude: number;
    radiusRange: [number, number];
  }) {
    const GOOEY_BLOB_COUNT = amount;
    const BLOB_COLOR = color;

    for (let i = 0; i < GOOEY_BLOB_COUNT; i++) {
      const speed = randInt([1, 10]) / 100;
      let t = randFloat([0, Math.PI * 2]);

      const radius = randInt(radiusRange);
      const randomDegree = randInt([0, 359]);
      const randomRange = randInt([0, amplitude]);
      const dir = new Vector2(
        Math.cos(degToRad(randomDegree)),
        Math.sin(degToRad(randomDegree))
      );

      const blob = new Blob(this.gp, {
        x: pos.x,
        y: pos.y,
        radius,
        color: BLOB_COLOR,
        onUpdate: (setX, setY) => {
          const ratio = Math.sin(t);
          const offset = dir.mul(ratio * randomRange);

          setX(pos.x + offset.x);
          setY(pos.y + offset.y);

          t += speed;
        },
      });

      this.setGroup("gooey", [blob]);
    }
  }
}
