import {Assets, autoDetectRenderer, Container, Graphics, Sprite, Ticker} from "pixi.js";

/**
 * Pixi application config
 */
const pixiConfig = {
    // preference: 'webgl',
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    clearBeforeRender: true,
    // very important for reading pixels
    preserveDrawingBuffer: true,
    // show pixi version message in console
    hello: true,
};

(async () => {
    const renderer = await autoDetectRenderer(pixiConfig);
    document.body.appendChild(renderer.canvas);

    const stage = new Container();
    stage.label = 'Stage';

    Ticker.shared.add(() => {
        renderer.render(stage);
    });

    // because of this deprecation warning is showing
    // (PixiJS Deprecation Warning: Container.name property has been removed, use Container.label instead)
    // __PIXI_APP__; // replaced while build to "globalThis.__PIXI_APP__ = app;"
    // __PIXI_STAGE__; // replaced while build to "globalThis.__PIXI_STAGE__ = stage;"
    // __PIXI_RENDERER__; // replaced while build to "globalThis.__PIXI_RENDERER__ = renderer;"
    __PIXI_STAGE__;
    __PIXI_RENDERER__;

    Assets.add({alias: "eggHead", src: `./spritesheets/test.json`});
    const testAsset = await Assets.load(['eggHead']);

    const eggHead = new Sprite(testAsset.eggHead.textures['eggHead.png']);
    eggHead.anchor.set(0.5);
    eggHead.position.set(400, 300);
    eggHead.interactive = true;
    eggHead.on('pointerdown', () => {
        console.log('pointerdown');
    })

    stage.addChild(eggHead)

})();
