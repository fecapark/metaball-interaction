import { IAppModules } from "../../..";
import GooeyBlobSnapshot from "../../../../src/objects/gooeyBlob/gooeyBlobSnapshot";
import { Vector2 } from "../../../../src/utils/vector";

export interface IAnimationUpdater {
  bridge: IBlobAnimationUpdateBridge;
  update: () => Vector2;
  onStart: () => void;
  onEnd: () => void;
  resize: () => void;
}

export interface IBlobAnimationUpdateBridge {
  snapshot: GooeyBlobSnapshot;

  explodedPos: Vector2;
  updatedPos: Vector2;
  centerPos: Vector2;
  amplitude: number;
  prevRadius: number;

  next(state?: number): void;
  init(): void;
}
