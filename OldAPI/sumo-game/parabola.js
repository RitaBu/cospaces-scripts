#ifndef PARABOLA_JS
#define PARABOLA_JS

#include "lib/api_adapter.js"

/**
 * Class to hit person ot jump
 * @param owner - type of GameItem
 * @param power - initial speed
 * @param verticalAngle - angle with horizon
 * @constructor
 */
function ParabolaClass(owner, power, verticalAngle, deadline, g) {
    this.owner = owner;
    this.v0 = power;
    this.a = verticalAngle;
    this.onFly = false;

    this.g = g;
    this.t = 0;
    this.x0 = 0;
    this.y0 = 0;
    this.z0 = 0;
    this.angle = Math.PI / 2;

    this.func = null;
    this.deadline = deadline;
}

ParabolaClass.prototype.dx = function (dt) {
    return Math.cos(this.angle) *
        (this.v0 * dt * Math.cos(this.a / 180 * Math.PI));
}

ParabolaClass.prototype.dy = function (dt) {
    return Math.sin(this.angle) *
        (this.v0 * dt * Math.cos(this.a / 180 * Math.PI));
}

ParabolaClass.prototype.z = function () {
    return this.z0 + this.v0 * this.t * Math.sin(this.a / 180 * Math.PI) -
        this.g * this.t * this.t / 2;
}
/*ParabolaClass.prototype.x = function () {
    return this.x0 + Math.cos(this.angle) *
        (this.v0 * this.t * Math.cos(this.a / 180 * Math.PI));
}

ParabolaClass.prototype.y = function () {
    return this.y0 + Math.sin(this.angle) *
        (this.v0 * this.t * Math.cos(this.a / 180 * Math.PI));
}

ParabolaClass.prototype.z = function () {
    return this.z0 + this.v0 * this.t * Math.sin(this.a / 180 * Math.PI) -
        this.g * this.t * this.t / 2;
}*/

/**
 * Init actions
 * @param xComponent
 * @param yComponent
 */
ParabolaClass.prototype.execute = function(xComponent, yComponent, power, func) {
    this.v0 = power;
    var tg = yComponent / xComponent;
    if (xComponent < 0) {
        this.angle = Math.PI + Math.atan(tg);
    } else if (yComponent < 0) {
        this.angle = 2 * Math.PI + Math.atan(tg);
    } else {
        this.angle = Math.atan(tg);
    }
    var pos = this.owner.item.position();
    this.x0 = pos[0];
    this.y0 = pos[1];
    this.z0 = pos[2];
    this.t = 0;
    this.onFly = true;
    this.owner.active = false;
    this.func = func;

    //sync data
    this.owner.acceleration = [0, 0, -this.g / 2];
    this.owner.parabolaVelocity = [0, 0, 0];
    this.owner.parabolaVelocity[0] = Math.cos(this.angle) *
        (this.v0 * Math.cos(this.a / 180 * Math.PI));
    this.owner.parabolaVelocity[1] = Math.sin(this.angle) *
        (this.v0 * Math.cos(this.a / 180 * Math.PI));
    this.owner.parabolaVelocity[2] = this.v0 * Math.sin(this.a / 180 * Math.PI);
    this.owner.sync();
    
}

ParabolaClass.prototype.finishImmediately = function () {
    this.onFly = false;
    this.owner.acceleration = [0, 0, 0];
    this.owner.parabolaVelocity = [0, 0, 0];
    this.owner.sync();
}

ParabolaClass.prototype.update = function(dt) {
    if(this.onFly) {
        this.t += dt;
       this.owner.parabolaVelocity[2] = this.v0 * Math.sin(this.a / 180 * Math.PI) - this.g * this.t;
        var x1 = this.dx(dt);
        var y1 = this.dy(dt);
        var z1 = this.z();
        var pos = this.owner.item.position();
        if (z1 > this.deadline) {
            this.owner.item.nonDiscreteTeleport(pos[0] + x1,pos[1] + y1, z1);
        } else {
            this.owner.item.nonDiscreteTeleport(pos[0],pos[1], this.deadline);
            this.onFly = false;
            this.owner.stunEnd();
            this.owner.acceleration = [0, 0, 0];
            this.owner.parabolaVelocity = [0, 0, 0];
            this.owner.sync();
            this.func();
        }
    }
}

#endif