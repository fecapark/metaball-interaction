# Metaball Interaction

by fecapark

## Demo

[Project Link](https://fecapark.github.io/metaball-interaction/)

![demo](https://github.com/fecapark/metaball-interaction/assets/101973955/fdc98c7d-f485-462c-8f27-ad7e440a5e00)

## Implementing Metaballs

[Blog](https://velog.io/@fecapark/%EC%9C%A0%EC%A0%80-%EC%9D%B8%ED%84%B0%EB%9E%99%EC%85%98%EA%B3%BC-%EB%A9%94%ED%83%80%EB%B3%BC-%ED%9A%A8%EA%B3%BC%EB%A5%BC-%ED%95%A9%EC%B9%98%EB%A9%B4-Metaball-Interaction)

In computer graphics, [metaballs](https://en.wikipedia.org/wiki/Metaballs) can be implemented using alpha-[thresholding](<https://en.wikipedia.org/wiki/Thresholding_(image_processing)>) method with [Gaussian Blur](https://en.wikipedia.org/wiki/Gaussian_blur).

![demo](https://github.com/fecapark/metaball-interaction/assets/101973955/f27269ee-b861-465e-8725-3f7a070a868b)

In general, 60fps was possible, due to WebGL([PIXI.js](https://github.com/pixijs/pixijs)) for high performance.

I need blur filter and alpha-threshold filter, but PIXI.js doesn't have the threshold filter, so I made [it](https://github.com/fecapark/metaball-interaction/blob/master/src/utils/filters.ts) using GLSL.
