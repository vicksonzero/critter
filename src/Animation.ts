export class AnimationSet {
    public animations: Animation[] = [];

    constructor() {

    }

    public static fromJSON(objs: AnimationSetDef): AnimationSet {
        var set = new AnimationSet();
        set.animations = set.animations.concat(
            objs.animations.map((obj: AnimationDef) => Animation.fromJSON(obj))
        );
        return set;
    }

    public combine(setB: AnimationSet): AnimationSet {
        return AnimationSet.combine(this, setB);
    }

    public static combine(setA: AnimationSet, setB: AnimationSet): AnimationSet {
        var result = new AnimationSet();
        result.animations = [].concat(setA.animations);
        result.animations = result.animations.concat(setB.animations);
        return result;
    }
}

export class Animation implements AnimationDef{
    public frames: Frame[] = [];

    constructor(public name: string) {

    }

    public static fromJSON(obj: AnimationDef): Animation {
        return new Animation('');
    }
}

export class Frame implements FrameDef {
    public frameID: number;
    public delay: number;

    public displaceX: number;
    public displaceY: number;

    public flipX: number;
    public flipY: number;

    constructor(parameters) {

    }
}


export interface AnimationSetDef {
    animations: AnimationDef[];
};

export interface AnimationDef {
    name: string;
    frames: FrameDef[];
};

export interface FrameDef {
    frameID: number;
    delay: number;

    displaceX: number;
    displaceY: number;

    flipX: number;
    flipY: number;
}