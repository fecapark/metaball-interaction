import { randInt } from "../utils/random";
import { blobColor } from "../core/const";
import { GooeyOption } from "../core/options";
import PointerManager from "./pointerManager";
import StageManager from "./stageManager";
import { IBaseBlob } from "../../types/objects/blob";
import FeederBlob from "../objects/feederBlob/feederBlob";
import GooeyBlob from "../objects/gooeyBlob/gooeyBlob";
import { Vector2 } from "../utils/vector";

export default class BlobManager {
  private static instance: BlobManager;

  private globalBlobs: Array<IBaseBlob> = [];
  private gooeyBlobs: Array<GooeyBlob> = [];
  private feederBlobs: Array<FeederBlob> = [];

  public canExploed: boolean = true;
  public explodedCount: number = 0;
  public maxBlobAmplitude: number = 0;
  public maxBlobAmplitudeRange: [number, number] = [0, 0];

  private constructor() {
    StageManager.getInstance().addResize(this.resize.bind(this));
  }

  static getInstance() {
    BlobManager.instance ??= new BlobManager();
    return BlobManager.instance;
  }

  get allBlobs() {
    return [...this.globalBlobs, ...this.gooeyBlobs, ...this.feederBlobs];
  }

  getBlobsByName(name: string) {
    if (name === "global") return this.globalBlobs;
    if (name === "gooey") return this.gooeyBlobs;
    if (name === "feeder") return this.feederBlobs;
    return null;
  }

  init() {
    const pointerManager = PointerManager.getInstance();

    // Gooey group
    this.setGooeyGroup();
    pointerManager.addPointerDownHandler(() => {
      if (
        this.canExploed &&
        this.isHoverOnGroup("gooey") &&
        !this.checkGooeyIsTooSmallToExplode()
      ) {
        this.triggerExplode();
      }
    });

    // Feeder group
    pointerManager.addUntilPointerDownToUpHandler((pointerPos) => {
      if (!this.canExploed || this.isHoverOnGroup("gooey")) return;
      this.setFeederGroupTo(pointerPos);
    });
  }

  update() {
    this.allBlobs.forEach((blob) => {
      blob.update();
    });

    this.setMaxAmplitudeInBlobs();
    this.feedToGooey();

    if (this.checkSatisfiedAutoExplode()) {
      this.triggerExplode();
    }
  }

  draw() {
    this.allBlobs.forEach((aBlob) => {
      aBlob.draw();
    });
  }

  resize() {
    this.allBlobs.forEach((aBlob) => {
      aBlob.resize();
    });
  }

  setGooeyGroup() {
    const radiusRange = GooeyOption.radiusRange();
    const GOOEY_BLOB_COUNT = GooeyOption.amount;

    for (let i = 0; i < GOOEY_BLOB_COUNT; i++) {
      const RADIUS = randInt(radiusRange);
      const blob = new GooeyBlob({
        x: 0,
        y: 0,
        radius: RADIUS,
        color: blobColor,
      });
      this.gooeyBlobs.push(blob);
    }
  }

  setFeederGroupTo(pos: Vector2) {
    const FEEDER_BLOB_COUNT = 6;
    const xOffset = 60;
    const yOffset = 60;
    const radiusRange: [number, number] = [10, 50];

    const make = () => {
      const blob = new FeederBlob({
        x: pos.x + randInt([-xOffset, xOffset]),
        y: pos.y + randInt([-yOffset, yOffset]),
        radius: randInt(radiusRange),
        color: "white",
      });
      return blob;
    };

    for (let i = 0; i < FEEDER_BLOB_COUNT; i++) {
      this.feederBlobs.push(make());
    }
  }

  isHoverOnGroup(name: string) {
    const { pointerPos } = PointerManager.getInstance();
    const group = this.getBlobsByName(name);

    if (group === null) return false;

    for (const blob of group) {
      if (blob.pos.getDistWith(pointerPos) <= blob.radius) {
        return true;
      }
    }

    return false;
  }

  checkAllExploded() {
    if (this.canExploed) return;

    this.explodedCount += 1;

    if (this.gooeyBlobs.length <= this.explodedCount) {
      this.canExploed = true;
      this.explodedCount = 0;
    }
  }

  triggerExplode() {
    if (!this.canExploed) return;
    this.canExploed = false;

    this.gooeyBlobs.forEach((blob) => {
      blob.bridge.next();
      blob.shrink();
    });

    this.feederBlobs.forEach((blob) => {
      blob.protrude();
    });
  }

  feedToGooey() {
    const newFeeders = this.feederBlobs.filter((blob) => !blob.isDead);
    const deadCount = this.feederBlobs.length - newFeeders.length;

    this.gooeyBlobs.forEach((blob) => {
      blob.growth(deadCount);
    });

    this.feederBlobs = newFeeders;
  }

  checkSatisfiedAutoExplode() {
    if (!this.canExploed) return false;

    return this.maxBlobAmplitude > this.maxBlobAmplitudeRange[1];
  }

  checkGooeyIsTooSmallToExplode() {
    return this.maxBlobAmplitude < this.maxBlobAmplitudeRange[0];
  }

  setMaxAmplitudeInBlobs() {
    const boundary = GooeyOption.amplitudeBoundaryRatioRange();

    let max = 0;
    let range: [number, number] = [0, 0];

    this.gooeyBlobs.forEach((blob) => {
      if (max < blob.bridge.amplitude) {
        const { amplitude } = blob.snapshot;
        max = blob.bridge.amplitude;
        range = [amplitude * boundary[0], amplitude * boundary[1]];
      }
    });

    this.maxBlobAmplitude = max;
    this.maxBlobAmplitudeRange = range;
  }
}
