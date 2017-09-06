
interface Executable {
    (a: Animation): void;
}

class Animation {
    private name: string;
    private duration: number;
    private finished: boolean;
    private exec: Executable;
    private finishCallback: () => void;
    private startTime: number;
    private numExecs: number;
    private DEBUG: boolean;

    constructor(name: string, duration: number, exec: Executable, finish: () => void, debug?: boolean) {
        this.name = name;
        this.duration = duration;
        this.finished = true;
        this.exec = exec;
        this.finishCallback = finish;
        this.startTime = 0;
        this.numExecs = 0;
        this.DEBUG = debug;
    }

    public toString(): string {
        return "[Animation] " + this.name;
    }

    public start() {
        this.startTime = Scene.currentTime();
        this.finished = false;
        if (this.DEBUG) {
            Space.log(this.toString() + " started");
        }
    }

    public update() {
        if ((Scene.currentTime() - this.startTime) > this.duration) {
            this.finished = true;
            if (this.DEBUG){
                Space.log(this.toString() + " finished");
            }
        }
        this.exec(this);
        this.numExecs++;
    }

    public getProgress() {
        if (this.finished) return 1;
        const timeLeft = this.startTime + this.duration - Scene.currentTime();
        if (this.DEBUG){
            Space.log("Time left " + timeLeft);
            //Space.log("Duration " + this.duration);
        }
        return 1 - timeLeft / this.duration;
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public doFinishCallback() {
        this.finishCallback();
    }
}

class Animator {
    private anims: Animation[];
    private DEBUG: boolean;

    constructor (debug?: boolean) {
        this.anims = [];
        this.DEBUG = debug;
    }

    public update() {
        if (this.anims.length > 0) {
            let a = this.anims[0];
            a.update();
            if (this.DEBUG) {
                Space.log(a.toString() + " Progress: " + a.getProgress());
            }
            if (a.isFinished()) {
                a.doFinishCallback();
                this.anims.shift();
                if (this.anims.length > 0) {
                    a = this.anims[0];
                    a.start();
                    if (this.DEBUG) {
                        Space.log(a.toString() + " finished. Left " + this.anims.length + " animations");
                    }
                }
            }
        }
    }

    public addAnimation(a: Animation) {
        if (this.DEBUG) {
            Space.log("Added " + (this.anims.length + 1) + " animation");
        }
        this.anims.push(a);
        if (this.anims.length == 1) {
            a.start();
        }
    }

    public getAnimationCount(): number {
        return this.anims.length;
    }
}
