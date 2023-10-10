# Metaball Interaction

by fecapark

## Demo

[Project Link](https://fecapark.github.io/metaball-interaction/)

![demo](https://github.com/fecapark/metaball-interaction/assets/101973955/fdc98c7d-f485-462c-8f27-ad7e440a5e00)

## Info

In computer graphics, [metaballs](https://en.wikipedia.org/wiki/Metaballs) can be implemented using a opacity-[thresholding](<https://en.wikipedia.org/wiki/Thresholding_(image_processing)>) method with [Gaussian Blur](https://en.wikipedia.org/wiki/Gaussian_blur).

Due to WebGL([PIXI.js](https://github.com/pixijs/pixijs)) for high performance, in general, 60fps was possible.

I need blur-filter and threshold filter, but PIXI.js doesn't have the threshold filter, so I made [it](https://github.com/fecapark/metaball-interaction/blob/master/src/utils/filters.ts) using GLSL.
