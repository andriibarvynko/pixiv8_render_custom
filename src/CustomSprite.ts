import {
    Bounds,
    BoundsData,
    Container, DestroyOptions,
    ObservablePoint, Optional,
    PointData, Size,
    SpriteOptions,
    Texture, updateQuadBounds,
    View
} from "pixi.js";


/**
 * This is copy-paste from the original Pixi.js Sprite source code
 *
 * The only thing is important here is the `renderPipeId` property
 * It is changed to use custom render pipe
 */

export class CustomSprite extends Container implements View
{
    public readonly renderPipeId = 'customSprite';

    public batched = true;
    public readonly _anchor: ObservablePoint;

    // sprite specific..
    public _texture: Texture;
    public _didSpriteUpdate = false;

    private readonly _bounds: BoundsData = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
    private readonly _sourceBounds: BoundsData = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
    private _boundsDirty = true;
    private _sourceBoundsDirty = true;

    public _roundPixels: 0 | 1 = 0;

    /**
     * @param options - The options for creating the sprite.
     */
    constructor(options: SpriteOptions | Texture = Texture.EMPTY)
    {
        if (options instanceof Texture)
        {
            options = { texture: options };
        }

        // split out
        const { texture, anchor, roundPixels, width, height, ...rest } = options;

        super({
            label: 'Sprite',
            ...rest
        });

        this._anchor = new ObservablePoint(
            {
                _onUpdate: () =>
                {
                    this.onViewUpdate();
                }
            },
        );

        if (anchor) this.anchor = anchor;
        this.texture = texture;
        this.allowChildren = false;
        this.roundPixels = roundPixels ?? false;

        // needs to be set after the container has initiated
        if (width) this.width = width;
        if (height) this.height = height;
    }

    set texture(value: Texture)
    {
        value ||= Texture.EMPTY;

        if (this._texture === value) return;

        this._texture = value;

        this.onViewUpdate();
    }

    /** The texture that the sprite is using. */
    get texture()
    {
        return this._texture;
    }

    /**
     * The local bounds of the sprite.
     * @type {rendering.Bounds}
     */
    get bounds()
    {
        if (this._boundsDirty)
        {
            this._updateBounds();
            this._boundsDirty = false;
        }

        return this._bounds;
    }

    /**
     * The bounds of the sprite, taking the texture's trim into account.
     * @type {rendering.Bounds}
     */
    get sourceBounds()
    {
        if (this._sourceBoundsDirty)
        {
            this._updateSourceBounds();
            this._sourceBoundsDirty = false;
        }

        return this._sourceBounds;
    }

    /**
     * Checks if the object contains the given point.
     * @param point - The point to check
     */
    public containsPoint(point: PointData)
    {
        const bounds = this.sourceBounds;

        if (point.x >= bounds.maxX && point.x <= bounds.minX)
        {
            if (point.y >= bounds.maxY && point.y <= bounds.minY)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds the bounds of this object to the bounds object.
     * @param bounds - The output bounds object.
     */
    public addBounds(bounds: Bounds)
    {
        const _bounds = this._texture.trim ? this.sourceBounds : this.bounds;

        bounds.addFrame(_bounds.minX, _bounds.minY, _bounds.maxX, _bounds.maxY);
    }

    public onViewUpdate()
    {
        // increment from the 12th bit!
        this._didChangeId += 1 << 12;
        this._didSpriteUpdate = true;
        this._sourceBoundsDirty = this._boundsDirty = true;

        if (this.didViewUpdate) return;
        this.didViewUpdate = true;

        if (this.renderGroup)
        {
            this.renderGroup.onChildViewUpdate(this);
        }
    }

    private _updateBounds()
    {
        updateQuadBounds(this._bounds, this._anchor, this._texture, 0);
    }

    private _updateSourceBounds()
    {
        const anchor = this._anchor;
        const texture = this._texture;

        const sourceBounds = this._sourceBounds;

        const { width, height } = texture.orig;

        sourceBounds.maxX = -anchor._x * width;
        sourceBounds.minX = sourceBounds.maxX + width;

        sourceBounds.maxY = -anchor._y * height;
        sourceBounds.minY = sourceBounds.maxY + height;
    }

    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    public destroy(options: DestroyOptions = false)
    {
        super.destroy(options);

        const destroyTexture = typeof options === 'boolean' ? options : options?.texture;

        if (destroyTexture)
        {
            const destroyTextureSource = typeof options === 'boolean' ? options : options?.textureSource;

            this._texture.destroy(destroyTextureSource);
        }

        this._texture = null;
        (this._bounds as null) = null;
        (this._sourceBounds as null) = null;
        (this._anchor as null) = null;
    }

    /**
     * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
     * and passed to the constructor.
     *
     * The default is `(0,0)`, this means the sprite's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
     *
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     * @example
     * import { Sprite } from 'pixi.js';
     *
     * const sprite = new Sprite({texture: Texture.WHITE});
     * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
     */
    get anchor(): ObservablePoint
    {
        return this._anchor;
    }

    set anchor(value: PointData | number)
    {
        typeof value === 'number' ? this._anchor.set(value) : this._anchor.copyFrom(value);
    }

    /**
     *  Whether or not to round the x/y position of the sprite.
     * @type {boolean}
     */
    get roundPixels()
    {
        return !!this._roundPixels;
    }

    set roundPixels(value: boolean)
    {
        this._roundPixels = value ? 1 : 0;
    }

    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    override get width(): number
    {
        return Math.abs(this.scale.x) * this._texture.orig.width;
    }

    override set width(value: number)
    {
        this._setWidth(value, this._texture.orig.width);
    }

    /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
    override get height(): number
    {
        return Math.abs(this.scale.y) * this._texture.orig.height;
    }

    override set height(value: number)
    {
        this._setHeight(value, this._texture.orig.height);
    }

    /**
     * Retrieves the size of the Sprite as a [Size]{@link Size} object.
     * This is faster than get the width and height separately.
     * @param out - Optional object to store the size in.
     * @returns - The size of the Sprite.
     */
    public override getSize(out?: Size): Size
    {
        if (!out)
        {
            out = {} as Size;
        }

        out.width = Math.abs(this.scale.x) * this._texture.orig.width;
        out.height = Math.abs(this.scale.y) * this._texture.orig.height;

        return out;
    }

    /**
     * Sets the size of the Sprite to the specified width and height.
     * This is faster than setting the width and height separately.
     * @param value - This can be either a number or a [Size]{@link Size} object.
     * @param height - The height to set. Defaults to the value of `width` if not provided.
     */
    public override setSize(value: number | Optional<Size, 'height'>, height?: number)
    {
        let convertedWidth: number;
        let convertedHeight: number;

        if (typeof value !== 'object')
        {
            convertedWidth = value;
            convertedHeight = height ?? value;
        }
        else
        {
            convertedWidth = value.width;
            convertedHeight = value.height ?? value.width;
        }

        if (convertedWidth !== undefined)
        {
            this._setWidth(convertedWidth, this._texture.orig.width);
        }

        if (convertedHeight !== undefined)
        {
            this._setHeight(convertedHeight, this._texture.orig.height);
        }
    }
}
