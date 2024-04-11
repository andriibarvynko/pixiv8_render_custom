import {
    Assets,
    autoDetectRenderer,
    Container, extensions,
    Sprite,
    SpritePipe,
    Ticker
} from "pixi.js";
import {CustomSpritePipe} from "./CustomSpritePipe.ts";
import {CustomSprite} from "./CustomSprite.ts";

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

// add custom sprite pipe and remove default sprite pipe
extensions.add(CustomSpritePipe);
extensions.remove(SpritePipe);

(async () => {
    const renderer = await autoDetectRenderer(pixiConfig);
    document.body.appendChild(renderer.canvas);

    const stage = new Container();
    stage.label = 'Stage';

    Ticker.shared.add(() => {
        renderer.render(stage);
    });

    // customSprite Pipe is HERE!
    console.log(renderer.renderPipes);

    __PIXI_STAGE__;
    __PIXI_RENDERER__;

    Assets.add({alias: "eggHead", src: `./spritesheets/test.json`});
    const testAsset = await Assets.load(['eggHead']);


    // normal sprites do not work anymore since we removed the default sprite pipe

    // const eggHead = new Sprite(testAsset.eggHead.textures['eggHead.png']);
    // eggHead.anchor.set(0.5);
    // eggHead.position.set(400, 300);
    // eggHead.interactive = true;
    // eggHead.on('pointerdown', () => {
    //     console.log('pointerdown');
    // })

    // but custom sprites do work!

    const eggHead = new CustomSprite(testAsset.eggHead.textures['eggHead.png']);
    eggHead.anchor.set(0.5);
    eggHead.position.set(400, 300);
    eggHead.interactive = true;
    eggHead.on('pointerdown', () => {
        console.log('pointerdown');
    })

    stage.addChild(eggHead)

})();
