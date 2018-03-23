
// global variable test
import { SpriteSheet, IProps as ISpriteSheetProps } from './SpriteSheet';

declare global {
    interface Window { spriteSheet: SpriteSheet; }
}

window.spriteSheet = new SpriteSheet({
    filename: 'string',
    rows: 0,
    cols: 0,
    frameWidth: 0,
    frameHeight: 0,
    spacingX: 0,
    spacingY: 0,
});