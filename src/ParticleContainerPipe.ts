import {BatchableSprite, BigPool, ExtensionType, InstructionSet, PoolItem, Renderer, RenderPipe, Sprite} from "pixi.js";
import {ParticleContainer} from "./ParticleContainer.ts";


export class ParticleContainerPipe implements RenderPipe<ParticleContainer>
{
    /** @ignore */
    public static extension = {
        type: [
            ExtensionType.WebGLPipes,
            ExtensionType.WebGPUPipes,
            ExtensionType.CanvasPipes,
        ],
        name: 'particleContainer',
    } as const;

    private _renderer: Renderer;

    constructor(renderer: Renderer)
    {
        this._renderer = renderer;
    }

    public addRenderable(particleContainer: ParticleContainer, _instructionSet: InstructionSet)
    {
        for (let i = 0; i < particleContainer.sprites.length; i++) {
            this._renderer.renderPipes.sprite.addRenderable(particleContainer.sprites[i], _instructionSet);
        }
    }

    public updateRenderable(particleContainer: ParticleContainer)
    {
        for (let i = 0; i < particleContainer.sprites.length; i++) {
            this._renderer.renderPipes.sprite.updateRenderable(particleContainer.sprites[i]);
        }
    }

    public validateRenderable(particleContainer: ParticleContainer): boolean
    {
        for (let i = 0; i < particleContainer.sprites.length; i++) {
            if (!this._renderer.renderPipes.sprite.validateRenderable(particleContainer.sprites[i])) {
                return false;
            }
        }

        return true;
    }

    public destroyRenderable(particleContainer: ParticleContainer)
    {
        for (let i = 0; i < particleContainer.sprites.length; i++) {
            this._renderer.renderPipes.sprite.destroyRenderable(particleContainer.sprites[i]);
        }
    }
}
