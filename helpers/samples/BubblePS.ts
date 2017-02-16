
interface Particle {
    update();
    dispose();
}

interface ParticleSystem {
    emit(numParticles: number);
    play();
    stop();
    clear();
    isPlaying(): boolean;
}

class BasicParticleSystem<T extends Particle> implements ParticleSystem {
    private playing: boolean = false;
    private disposable: Disposable;
    private particles: T[] = [];
    private emitRate: number = 0;
    private random: boolean = false;
    private currentEmitDelay: number = 0;
    private lastEmitTime: number = 0;

    constructor (emitRate: number, random: boolean) {
        this.emitRate = emitRate;
        this.random = random;
    }

    public emit(numParticles: number) {
        for (let i = 0; i < numParticles; i++) {
            this.particles.push(this.createParticle(i, numParticles));
        }
    }

    protected createParticle(indexInBurst: number, outOf: number): T {
        return null;
    }

    public play() {
        if (this.playing) this.stop();
        this.playing = true;
        this.lastEmitTime = Space.currentTime();
        let self = this;
        this.disposable = Space.scheduleRepeating(function () {
            for (let i = self.particles.length - 1; i >= 0; i--) {
                let particle = self.particles[i];
                particle.update();
                if (!self.isParticleAlive(particle)) {
                    particle.dispose();
                    self.particles.splice(i, 0);
                }
            }

            const passed = Space.currentTime() - self.lastEmitTime;
            if (passed >= self.currentEmitDelay) {
                self.lastEmitTime = Space.currentTime();
                self.currentEmitDelay = self.emitRate * (self.random ? Math.random() : 1);
                self.emit(1);
            }
        }, 0);
    }

    public stop() {
        if (!this.playing) return;
        this.disposable.dispose();
        this.playing = false;
    }

    public clear() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.dispose();
        }
        this.particles = [];
    }

    public isPlaying(): boolean {
        return this.playing;
    }

    protected isParticleAlive(particle: T): boolean {
        return true;
    }
}

class Bubble implements Particle {
    private radius: number;
    public item: ShapeItem;

    constructor (radius: number, parent: ShapeItem, angle: number) {
        this.radius = radius;
        let p = parent.getPosition();
        //Project.log(parent.getAxisY().y);
        this.item = Space.createItem("Sphere", p.x + parent.getAxisY().x * 0.5, p.y + parent.getAxisY().y * 0.3, p.z);
        //this.item.addLocalPosition(angle * 0.01, angle * 0.01, 0);
        this.item.setColor(255, 255, 255);
        this.item.setScale(0.1);
        this.item.setOpacity(0.3);
    }

    public update() {
        this.item.addLocalPosition(0, 0, 0.01);
        this.item.setScale(this.item.scale() * 1.008);
    }

    public dispose() {
        this.item.deleteFromSpace();
    }
}

class BubblePS extends BasicParticleSystem<Bubble> {
    private parentItem: ShapeItem;

    constructor (parent: ShapeItem, emitRate: number, random: boolean) {
        super(emitRate, random);
        this.parentItem = parent;
    }

    protected createParticle(indexInBurst: number, outOf: number): Bubble {
        return new Bubble(0.1, this.parentItem, 360 / outOf);
    }

    protected isParticleAlive(bubble: Bubble): boolean {
        return bubble.item.getPosition().z <= 1.3;
    }
}