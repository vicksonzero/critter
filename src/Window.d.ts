
import { SpriteSheet } from './SpriteSheet';

declare global {
    interface Window {
        // exposed variables for inspections
        spriteSheet: SpriteSheet;
    }
}