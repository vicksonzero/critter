import { SpriteSheet } from './SpriteSheet';
var spriteSheet = new SpriteSheet({
filename: '',
rows: 5,
cols: 6,
frameWidth: 20,
frameHeight: 20,
spacingX: 2,
spacingY: 2,
});

var a = spriteSheet.getCoord(0);
console.log(a);

var a = spriteSheet.getCoord(1);
console.log(a);
var a = spriteSheet.getCoord(2);
console.log(a);

var a = spriteSheet.getCoord(5);
console.log(a);
var a = spriteSheet.getCoord(6);
console.log(a);
var a = spriteSheet.getCoord(7);
console.log(a);