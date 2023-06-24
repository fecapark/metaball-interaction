import { BlurFilter, Filter } from "pixi.js";

export function useAlphaThresholdFilter(threshold: number) {
  const filter = new Filter(
    undefined,
    [
      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "uniform sampler2D uSampler;",
      "uniform float threshold;",
      "void main() {",
      "    vec4 color = texture2D(uSampler, vTextureCoord);",
      "    vec3 originColor = vec3(255.0, 192.0, 0.0) / 255.0;",
      "    if (color.a > threshold) {",
      "      gl_FragColor = vec4(originColor, 1.0);",
      "    } else {",
      "      gl_FragColor = vec4(vec3(0.0), 0.0);",
      "    }",
      "}",
    ].join("\n"),
    {
      threshold,
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
