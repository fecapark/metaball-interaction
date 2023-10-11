# Metaball Interaction

by fecapark

## Demo

[Project Link](https://fecapark.github.io/metaball-interaction/)

![demo](https://github.com/fecapark/metaball-interaction/assets/101973955/fdc98c7d-f485-462c-8f27-ad7e440a5e00)

## Implementing Metaballs

In computer graphics, [metaballs](https://en.wikipedia.org/wiki/Metaballs) can be implemented using alpha-[thresholding](<https://en.wikipedia.org/wiki/Thresholding_(image_processing)>) method with [Gaussian Blur](https://en.wikipedia.org/wiki/Gaussian_blur).

![demo](https://github.com/fecapark/metaball-interaction/assets/101973955/f27269ee-b861-465e-8725-3f7a070a868b)

In general, 60fps was possible, due to WebGL([PIXI.js](https://github.com/pixijs/pixijs)) for high performance.

I need blur filter and alpha-threshold filter, but PIXI.js doesn't have the threshold filter, so I made [it](https://github.com/fecapark/metaball-interaction/blob/master/src/utils/filters.ts) using GLSL.
