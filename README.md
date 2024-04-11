#### Example to show how Pipes work in PixiJS

Here is CustomSpritePipe is created which is just copy-paste of SpritePipe
Also the same for CustomSprite. The only thing which is important there is the `renderPipeId = 'customSprite'` (name of our custom sprite pipe)

And in the index.ts we can remove original pipe and add our custom pipe like this

```ts
extensions.add(CustomSpritePipe);
extensions.remove(SpritePipe);
```
