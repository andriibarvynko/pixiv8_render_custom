import {
    Assets,
    autoDetectRenderer,
    Container, extensions,
    Sprite,
    SpritePipe,
    Ticker
} from "pixi.js";
import {ParticleContainerPipe} from "./ParticleContainerPipe.ts";
import {ParticleContainer} from "./ParticleContainer.ts";
import {Easing, Group, Tween} from "tweedle.js";

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
    isRenderGroup: false
};

// add custom sprite pipe and remove default sprite pipe
extensions.add(ParticleContainerPipe);
// extensions.remove(SpritePipe);

(async () => {
    const renderer = await autoDetectRenderer(pixiConfig);
    document.body.appendChild(renderer.canvas);

    const stage = new Container({
        isRenderGroup: false
    });
    stage.label = 'Stage';

    Ticker.shared.add(() => {
        renderer.render(stage);
        Group.shared.update();
    });

    // customSprite Pipe is HERE!
    console.log(renderer.renderPipes);

    __PIXI_STAGE__;
    __PIXI_RENDERER__;

    Assets.add({alias: "eggHead", src: `./spritesheets/test.json`});
    const testAsset = await Assets.load(['eggHead']);


    // normal sprites do not work anymore since we removed the default sprite pipe

    const ctn = new Container({
        isRenderGroup: false
    })
    ctn.label = "i'm not render group!";
    stage.addChild(ctn);

    const eggHead = new Sprite(testAsset.eggHead.textures['eggHead.png']);
    eggHead.label = 'eggHead normal';
    // eggHead.anchor.set(0.5);
    eggHead.position.set(600, 400);
    eggHead.interactive = true;
    eggHead.on('pointerdown', () => {
        console.log('pointerdown');
    })
    ctn.addChild(eggHead);

    const tween = new Tween(eggHead).to({ x:100, y:400 }, 2500);
    tween.easing(Easing.Sinusoidal.InOut);
    tween.yoyo(true);
    tween.repeat(Infinity);
    tween.start();

    console.log('eggHead', eggHead.worldTransform);

    // but custom sprites do work!

    const particleContainer = new ParticleContainer(testAsset.eggHead.textures['eggHead.png']);
    particleContainer.position.set(200, 100);
    particleContainer.interactive = true;
    particleContainer.on('pointerdown', () => {
        console.log('pointerdown');
    })

    stage.addChild(particleContainer)

})();
