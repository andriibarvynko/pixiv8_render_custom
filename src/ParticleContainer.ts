import {
    Bounds,
    BoundsData,
    Container, ContainerChild, getFastGlobalBounds, getGlobalBounds,
    Graphics, logScene, Matrix,
    Rectangle,
    Sprite,
    Texture,
    updateRenderGroupTransforms,
    View
} from "pixi.js";
import {Easing, Tween} from "tweedle.js";


/**
 * This is copy-paste from the original Pixi.js Sprite source code
 *
 * The only thing is important here is the `renderPipeId` property
 * It is changed to use custom render pipe
 */

export class ParticleContainer extends Container implements Partial<View>
{
    public readonly renderPipeId = 'particleContainer';

    public sprites: Sprite[] = [];

    constructor(private _texture: Texture)
    {
        super({
            isRenderGroup: true
        });

        for (let i = 0; i < 5; i++) {
            const sprite = new Sprite(this._texture);

            sprite.position.set(50, 50);
            sprite.anchor.set(-0.1 * i);
            sprite.scale.set(0.5 + 0.1 * i);
            this.addChild(sprite);


            const tween = new Tween(sprite).to({ x:100, y:100 }, 2500);
            tween.yoyo(true);
            tween.repeat(Infinity);
            tween.easing(Easing.Sinusoidal.InOut);
            tween.start();

            this.sprites.push(sprite);
        }

        // center point of 'this'
        const gfx = new Graphics();
        gfx.circle(0, 0, 10).fill(0xff0000);
        this.addChild(gfx);

        logScene(this, 3);
    }

    addChild<U extends ContainerChild[]>(...children): U[0] {

        const child = children[0];

        // this.children.push(child);

        // if (this.sortableChildren) this.sortDirty = true;

        child.parent = this;

        child.didChange = true;
        child.didViewUpdate = false;

        // TODO - OPtimise this? could check what the parent has set?
        child._updateFlags = 0b1111;

        if (this.renderGroup)
        {
            this.renderGroup.addChild(child);
        }

        // this.emit('childAdded', child, this, this.children.length - 1);
        // child.emit('added', this);

        return child;
    }
}
