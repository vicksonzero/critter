
export class TimerEvent {
    constructor(
        public time: string = '',
        public title: string = ''
    ) { }

    toString() {
        return `TimerEvent ${this.time} ${this.title}`;
    }

    toJSON() {
        const {time, title} = this;
        return {time, title};
    }

    static fromString(str: string) {
        const obj = JSON.parse(str);
        return new TimerEvent(obj.time, obj.title);
    }
}
