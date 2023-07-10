export interface IBaseBlob {
  isDead: boolean;

  pos: Vector2;
  color: BlobColor;
  alpha: number;
  radius: number;

  update: () => void;
  draw: () => void;
  resize: () => void;
}

type BlobColor = string | number;

export interface IBlobProps {
  x: number;
  y: number;
  radius: number;
  color: BlobColor;
  alpha?: number;
}
