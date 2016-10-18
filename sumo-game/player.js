#ifndef PLAYER_JS
#define PLAYER_JS

#include "lib/api_adapter.js"
#include "lib/server_framework.js"
#include "parabola.js"
#include "lib/control.js"
#include "lib/property_utils.js"
#include "SumoAnimator.js"
#include "lib/FocusGameCamera.js"
#include "lib/vector_utils.js"
#include "lib/sink_resolver.js"
#include "ButtonReadyTest.js"
#include "SumoSoundManager.js"
#include "ObjectCash.js"

//var sumoId = "%%37abed45d827ae4a0890b776ff33b36d6b468027bdacd5fffe18a4df7d752cd9"; //it crashes on mobile in createItem
var sumoId = "Sumo";

var server = new ServerFramework();

var soundManager = new SoundManager(server);

var sinkResolver = new SinkResolver(server);

var controlManager = new ControlManager();

var playerCash = null;

function getAngle(x, y) {
    if( x == 0) {
        if(y > 0) {
            return Math.PI / 2;
        } else {
            return Math.PI * 3 / 2;
        }
    }
    if(x < 0) {
        return Math.atan(y / x) + Math.PI;
    } else {
        if(y < 0) {
            return Math.atan(y / x) + 2 * Math.PI;
        } else {
            return Math.atan(y / x);
        }
    }
}



function Player() {
    DX.log("player ctor");
    //item properties
    this.item = null;
    this.forwardVector = null;
    this.active = true;

    //player punch params
    this.strength = 10;
    this.punchCD = false;
    this.punchCDTime = 2;
    this.distanceToPunch = 2;
    this.punchDeltaAngle = 180;
    this.degInPI = 180;

    //player jump params
    this.jumpPower = 10;
    this.jumpCD = false;
    this.jumpCDTime = 6;

    //player parabolas
    this.parabolaOnPunched = new ParabolaClass(this, this.strength, 60, 0, 20);
    this.parabolaOnJump = new ParabolaClass(this, this.jumpPower, 60, 0, 20);
    this.parabolaOnDead = new ParabolaClass(this, this.strength, 85, -15, 7);

    //player move params
    this.dir = 0;
    this.dirX = 0;
    this.dirY = 0;
    this.shouldStop = true;
    this.speed = 4;

    //player stomp params
    this.duration = 3;
    this.stompRadius = 2;
    this.stunDuration = -1;
    this.atStunTime = 0;

    //player buff params
    this.scale = 1;

    //player animation states
    this.animator = null;

    //ring params
    this.ringRadius = 10;
    this.isWaitingForPlayers = true;
    this.isFailed = false;
    this.isFalling = false;

    //sync data
    this.velocity = [0, 0, 0];
    this.parabolaVelocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.syncPeriod = 0.5;
    this.syncTime = 0;
}

Player.prototype.setGameState = function(state) {
    switch(state) {
        case "waiting":
            if(this.isWaitingForPlayers) return;
            
            playerCash.restore(this);
            this.restore();
            this.isWaitingForPlayers = true;
            this.isFailed = false;
            this.isFalling = false;
            new ButtonReady(server.getPlayerId(),0.6,0.6,4, function (){
                server.sendReliableToServer({type: "ready"});
            });

            var ids = Button.getButtonIds();
            server.sendReliableToServer({type: "buttons", ids: ids});

            sinkResolver.setMovingDown(true);
            controlManager.setControlEnabled(server.getPlayerId(), true);
            break;
        case "playing":
            if(!this.isWaitingForPlayers) return;
            
            soundManager.playSound("gong", this.item.position(), false, true);
            this.isWaitingForPlayers = false;
            Button.remove();
            Button = null;
            break;
    }
}

Player.prototype.restore = function() {
    this.item.setScale(this.scale);
}

Player.prototype.sync = function() {

    server.sendToServer({
        type : "position_sync",
        position : this.item.position(),
        velocity : vec3add(this.velocity, this.parabolaVelocity),
        acceleration : this.acceleration
    });
}

Player.prototype.update = function(dt) {
    this.syncTime += dt;
    if(this.syncTime > this.syncPeriod) {
        this.syncTime = 0;
        this.sync();
    }

    if(!this.isFailed) {
        if (this.parabolaOnJump != null && !this.isFailed) {
            this.parabolaOnJump.update(dt);
        }
        if (this.parabolaOnPunched != null && !this.isFailed) {
            this.parabolaOnPunched.update(dt);
        }
        if (this.parabolaOnDead != null) {
            this.parabolaOnDead.update(dt);
        }
        if (this.active && !this.shouldStop) {
            this.animator.tryResumeWalking();
        }

        controlManager.setControlEnabled(this.active && !this.shouldStop);
        this.checkOutOfRing();


        if (this.stunDuration > 0) {
            this.updStun(dt)
        }
    }

    soundManager.setListenerPosition(this.item.position());

    var camera = Camera.getCamera();
    if(camera != null) {
        var axis = camera.cameraDirection();
        /*
        var axis = [];
        var tempAxis = camera.cameraDirection();
        axis.push(tempAxis.x);
        axis.push(tempAxis.y);
        axis.push(tempAxis.z);
        */
        var angle = getAngle(axis[0], axis[1]) - Math.PI / 2;
        var unitAxis = this.item.getAxisY();
        var unitAngle = getAngle(unitAxis[0], unitAxis[1]);
        if(Math.abs(unitAngle - Math.PI / 2 - angle) > 0.05) {
            setRotationAroundZAxis(server.getPlayerId(), angle);
        }
    }
}
Player.prototype.checkOutOfRing = function() {

    var pos = this.item.position();
    var r = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
    if (r > this.ringRadius) {
        if(this.isWaitingForPlayers) {
            var dif = r - this.ringRadius;
            var a = pos[0] / r * (this.ringRadius + dif * 0.6);
            var b = pos[1] / r * (this.ringRadius + dif * 0.6);
            this.item.nonDiscreteTeleport(a, b, pos[2]);
        } else {
            if(!this.isFalling) {
                this.isFalling = true;
                this.parabolaOnJump.finishImmediately();
                this.parabolaOnPunched.finishImmediately();
                controlManager.setControlEnabled(server.getPlayerId(),false);
                this.animator.setAnim(this.animator.standState);
                pos = this.item.position();
                this.parabolaOnDead.execute(pos[0],pos[1],this.jumpPower/3, function () {
                    server.sendReliableToServer({type: "fail"});
                    controlManager.setControlEnabled(server.getPlayerId(), false);
                    sinkResolver.setMovingDown(false);
                    this.isFailed = true;
                });
            }

        }
    }

}

Player.prototype.start = function() {
    DX.log("player start");
    server.initWithItem(DX.createItem(sumoId, 0, 0, 0));

    sinkResolver.setPlayerId(server.getPlayerId());
    var that = this;
    this.item = DX.item(server.getPlayerId());
    soundManager.playSound("music", this.item.position(), true, true);
    this.animator = new SumoAnimator(this.item);
    PropertyUtils.onPropertyChanged(server.getPlayerId() + "#punched",function() { that.onPunched(); } );
    PropertyUtils.onPropertyChanged(server.getPlayerId() + "#stunned",function() { that.onStunned(); } );
    DX.log("subscribed to property: " + server.getPlayerId() + "#stunnded");
    //DX.focusOn(server.getPlayerId(), true);
    DX.setControlEnabled(false);
    Camera.focusOn(server.getPlayerId());
    this.forwardVector = this.item.getAxisY();
    new ButtonReady(server.getPlayerId(),0.6,0.6,4, function (){
        server.sendReliableToServer({type: "ready"});
    });
    DX.schedule(function(){
        DX.log("sent buttons to server");
        var ids = Button.getButtonIds();
        server.sendReliableToServer({type: "buttons", ids: ids});
    }, 6);
    var ids = Button.getButtonIds();
    server.sendReliableToServer({type : "buttons", ids: ids});
    playerCash = new ObjectCash(this);
}

Player.prototype.jump = function() {
    if(this.active && !this.jumpCD && !this.isFailed && !this.isFalling) {
        soundManager.playSound("jump", this.item.position(), false, false);
        var that = this;
        that.animator.setAnim(that.animator.jumpState);
        this.jumpCD = true;
        DX.schedule(function(dt){
            that.jumpCD = false;
        },that.jumpCDTime);
        this.forwardVector = this.item.getAxisY();
        controlManager.setControlEnabled(server.getPlayerId(),false);
        this.parabolaOnJump.execute(this.forwardVector[0],this.forwardVector[1],
            this.jumpPower, function(){that.stomp();});
    }
}

Player.prototype.stomp = function() {
    soundManager.playSound("land", this.item.position(), false, false);
    var listPlayersToPunch = [];
    var playersList = server.getPlayersList();
    for(i = 0; i < playersList.length; i++) {
        var enemy = DX.item(playersList[i]);
        if(enemy != null && playersList[i] != server.getPlayerId() &&
            this.item.distanceToItem(enemy) < this.stompRadius) {
            listPlayersToPunch.push(playersList[i]);
        }
    }
    for(i = 0; i < listPlayersToPunch.length; i++) {
        //listPlayersToPunch[i].setProperty("stunned", this.duration);
        PropertyUtils.setProperty(listPlayersToPunch[i] + "#stunned", this.duration);
    }
    controlManager.setControlEnabled(server.getPlayerId(),true);
}

Player.prototype.onStunned = function() {
    DX.log("onStunned called");
    var that = this;
    var duration = parseFloat(getProperty(DX, server.getPlayerId() + "#stunned"));
    if (duration > 0 && this.active) {
        soundManager.playSound("dizzy", this.item.position(), false, false);
        var that = this;
        that.animator.setAnim(that.animator.stunnedState);
        this.active = false;
        this.stunDuration = duration;
        controlManager.setControlEnabled(server.getPlayerId(),false);
    }
}

Player.prototype.updStun = function(dt) {
    this.atStunTime += dt;
    if(this.atStunTime > this.stunDuration) {
        this.stunEnd();
    }
}

Player.prototype.stunEnd = function() {
    this.active = true;
    //this.item.setProperty("stunned", -1);
    this.stunDuration = -1;
    this.atStunTime = 0;
    controlManager.setControlEnabled(server.getPlayerId(),true);
}

/**
 * get item punched property and fly
 */
Player.prototype.onPunched = function() {
    if(this.active || this.stunDuration > 0) {
        soundManager.playSound("receiveKick", this.item.position(), false, false);
        var that = this;
        var params = (getProperty(DX, server.getPlayerId() + "#punched")).split(" ");
        var x = parseFloat(params[0]);
        var y = parseFloat(params[1]);
        var pow = parseFloat(params[2]);
        controlManager.setControlEnabled(server.getPlayerId(),false);
        this.parabolaOnPunched.execute(x, y, pow,function(){});
    }
}

/**
 * force someone to fly
 * @param enemy   - is type of DX.item
 * @param devisor - if few punched split power between them
 */
Player.prototype.punch = function(enemy, devisor) {
    this.forwardVector = this.item.getAxisY();
    var pos1 = this.item.position();
    var pos2 = enemy.position();
    var x = pos2[0] - pos1[0];
    var y = pos2[1] - pos1[1];
    var angleCos = (this.forwardVector[0] * x + this.forwardVector[1] * y) /
        Math.sqrt(this.forwardVector[0] * this.forwardVector[0] + this.forwardVector[1] * this.forwardVector[1]) /
        Math.sqrt(x * x + y * y);
    if(Math.acos(angleCos)/Math.PI*this.degInPI < this.punchDeltaAngle) {
        PropertyUtils.setProperty(enemy.id() + "#punched", x + " " + y + " " + this.strength / devisor);
    }
}

/**
 * check for mishit
 */
Player.prototype.checkWhoIsPunched = function() {
    var that = this;
    if(this.active && !this.punchCD && !this.isFailed && !this.isFalling) {
        //that.setAnim(that.pushState);
        that.animator.setAnim(that.animator.pushState);
        this.punchCD = true;
        DX.schedule(function(dt){
            that.punchCD = false;
        },that.punchCDTime);
        var listPlayersToPunch = [];
        var playersList = server.getPlayersList();
        for (i = 0; i < playersList.length; i++) {
            var enemy = DX.item(playersList[i]);
            if (enemy != null && playersList[i] != server.getPlayerId() &&
                this.item.distanceToItem(enemy) < this.distanceToPunch) {
                this.forwardVector = this.item.getAxisY();
                var pos1 = this.item.position();
                var pos2 = enemy.position();
                var x = pos2[0] - pos1[0];
                var y = pos2[1] - pos1[1];
                var angleCos = (this.forwardVector[0] * x + this.forwardVector[1] * y) /
                    Math.sqrt(this.forwardVector[0] * this.forwardVector[0] + this.forwardVector[1] * this.forwardVector[1]) /
                    Math.sqrt(x * x + y * y);
                if (Math.acos(angleCos) / Math.PI * this.degInPI < this.punchDeltaAngle) {
                    listPlayersToPunch.push(enemy);
                }
            }
        }
        for (i = 0; i < listPlayersToPunch.length; i++) {
            this.punch(listPlayersToPunch[i], listPlayersToPunch.length);
        }
        if(listPlayersToPunch.length > 0) {
            soundManager.playSound("successKick", this.item.position(), false, false);
        } else {
            soundManager.playSound("failKick", this.item.position(), false, false);
        }
    }
}



Player.prototype.setDir = function(d) {
    this.animator.setAnim(this.animator.walkState);
    this.shouldStop = false;
    this.dir = d;
    controlManager.setDirection(server.getPlayerId(), d);
}

Player.prototype.stop = function() {
    this.shouldStop = true;
    this.animator.stopWalking(this.active);
    this.dir = 0;
    controlManager.setDirection(server.getPlayerId(), 0);
}

//function movePlayer (itemId, dir, dt) {
Player.prototype.movePlayer  = function(/*itemId,*/ dir, dt) {

    DX.log("dt: " + dt);

    var zeroVec = {};
    zeroVec[0] = 0.0; zeroVec[1] = 0.0; zeroVec[2] = 0.0;

    const speed = this.speed;
    var item = DX.item(server.getPlayerId());
    if(item === null) return;

    var resDir = zeroVec;

    var axisX = item.getAxisX();
    var axisY = item.getAxisY();

    switch(dir) {
        case 11:
            resDir = axisY;
            break;
        case 12:
            resDir = vec3add(vec3mul(axisX, -1), axisY);
            break;
        case 13:
            resDir = vec3mul(axisX, -1);
            break;
        case 14:
            resDir = vec3mul(vec3add(axisX, axisY), -1);
            break;
        case 15:
            resDir = vec3mul(axisY, -1);
            break;
        case 16:
            resDir = vec3add(axisX, vec3mul(axisY, -1));
            break;
        case 17:
            resDir = axisX;
            break;
        case 18:
            resDir = vec3add(axisX, axisY);
            break;
    }

    var lastVelocity = this.velocity;

    if(vec3lengthSquared(resDir) > 0) {
        this.velocity = vec3mul(vec3getNormal(resDir), speed);
        //resDir = vec3mul(resDir, 1.0 / Math.sqrt(vec3lengthSquared(resDir)) * speed * dt);
        var pos = item.position();
        resDir = vec3mul(this.velocity, dt);
        item.nonDiscreteTeleport(pos[0] + resDir[0], pos[1] + resDir[1], pos[2] + resDir[2]);
    } else {
        this.velocity = [0, 0, 0];
    }

    if(!vec3isEqual(lastVelocity, this.velocity)) {
        this.sync();
    }
}

#endif