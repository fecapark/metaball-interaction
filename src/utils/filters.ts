import { BlurFilter, Filter } from "pixi.js";

export function useAlphaThresholdFilter(threshold: number, maskColor: string) {
  const filter = new Filter(
    undefined,
    `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float threshold;
      uniform float maskR;
      uniform float maskG;
      uniform float maskB;
      void main() {
          vec4 color = texture2D(uSampler, vTextureCoord);
          vec3 maskColor = vec3(maskR, maskG, maskB) / 255.0;
          if (color.a > threshold) {
            gl_FragColor = vec4(maskColor, 1.0);
          } else {
            gl_FragColor = vec4(vec3(0.0), 0.0);
          }
      }
    `,
    {
      threshold,
      maskR: parseInt(maskColor.slice(1, 3), 16),
      maskG: parseInt(maskColor.slice(3, 5), 16),
      maskB: parseInt(maskColor.slice(5, 7), 16),
    }
  );
  return filter;
}

export function useBlurFilter(blur: number) {
  const blurFilter = new BlurFilter();
  blurFilter.blur = blur;
  blurFilter.autoFit = true;
  return blurFilter;
}
