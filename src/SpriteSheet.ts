export class SpriteSheet implements IProps {
    public filename: string = '';
    public rows: number = 0;
    public cols: number = 0;
    public frameWidth: number = 0;
    public frameHeight: number = 0;
    public spacingX: number = 0;
    public spacingY: number = 0;

    private _keyCount: number = 0;
    public get keyCount(): number {
        return this._keyCount;
    }

    public keyList: { [x: string]: ISpriteFrame };

    constructor(opts: IProps) {
        Object.assign(this, opts);
        this._keyCount = this.rows * this.cols;
    }

    public getCoord(id: number): Point {
        if (id > (this.keyCount)) {
            throw `id ${id} out of bound`;
        }
        var colID = id % this.cols;
        var rowID = Math.floor(id / this.cols);
        // console.log(`getCoord ${id} ${this.cols}: ${colID} ${rowID}`);

        return {
            x: -1 * colID * (this.frameWidth + this.spacingX),
            y: -1 * rowID * (this.frameHeight + this.spacingY),
        };
    }

    public setDivStyle(div: HTMLElement, frameId: number): void {
        var coord = this.getCoord(frameId);
        div.style.backgroundImage = `url(${this.filename})`;
        div.style.backgroundPositionX = `${coord.x}px`;
        div.style.backgroundPositionY = `${coord.y}px`;
        div.style.width = `${this.frameWidth}px`;
        div.style.height = `${this.frameHeight}px`;
        // div.style.transform = (
        //     Math.random() > 0.5 ? 'scaleX(1)' : 'scaleX(-1)'
        // );
    }

    public createDiv(name: string, idOrKey: number | string): HTMLDivElement {
        if (typeof idOrKey === "string") {
            const id: number = this.keyToId(idOrKey);
            return this.createDiv(name, 0);
        }
        const id: number = idOrKey;
        var div = document.createElement('div');
        div.id = name;
        this.setDivStyle(div, id);
        return div;
    }

    public keyToId(key: string): number {
        if (this.keyList) throw '';
        return this.keyList[key].id;
    };
}

export interface Point {
    x: number;
    y: number;
}

export interface IProps {
    filename: string,
    rows: number,
    cols: number,
    frameWidth: number,
    frameHeight: number,
    spacingX: number,
    spacingY: number,
}

export interface ISpriteFrame {
    id: number;
}
