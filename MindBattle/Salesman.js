// Helpers
var N = 21;
var DELTA = 0.6;
var finished = false;

function touch(obj1, obj2) {
    return Math.abs(obj1.x - obj2.x) < DELTA && Math.abs(obj1.y - obj2.y) < DELTA;
}

function normalize(x, y) {
    var len = Math.sqrt(x * x + y * y);
    return {x: x / len, y: y / len};
}
// Helpers END
Space.setPhysicsEnabled(true);


function defaultAI(env) {
    var pos = env.getPosition();
    function dist(aim) {
        var dx = pos.x - aim.x;
        var dy = pos.y - aim.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    var aims = env.getAims();
    var minDist = 10000;
    var aim = {x:0, y:0};
    for (var i = 0; i < aims.length; i++) {
        var d = dist(aims[i]);
        if (d < minDist) {
            aim = aims[i];
            minDist = d;
        }
    }
    env.move(aim.x - pos.x, aim.y - pos.y);
}

if (typeof p2 != "function") {
    p2 = defaultAI;
}

function Env(me, opponent) {
    this.getPosition = function () {
        return me.getPhysicsPosition();
    };
    this.getOpponentPosition = function () {
        return opponent.getPhysicsPosition();
    };
    this.getAims = function () {
        return itemCoords;
    };
    this.move = function (x, y) {
        var v = normalize(x, y);
        me.setVelocity(v.x, v.y, 0);
    };
    this.log = Project.log;
    this.score = 0;
}


var items = [];
var itemCoords = [];
function generateAims(n) {
    for (var i = 0; i < n; i++) {
        var x = Math.random() * 20 - 10;
        var y = Math.random() * 20 - 10;
        var aim = Space.createItem("Sphere", x, y, 0);
        aim.setColor(0, 255, 0);
        aim.setScale(0.85);
        aim.setStatic();
        items.push(aim);
        itemCoords.push(aim.getPhysicsPosition());
    }
}

function check(env) {
    for (var i = 0; i < items.length; i++) {
        if (touch(itemCoords[i], env.getPosition())) {
            var item = items[i];
            item.deleteFromSpace();
            items.splice(i, 1);
            itemCoords.splice(i, 1);
            env.score++;
        }
    }
    if (items.length === 0) {
        finished = true;
        //Space.setPhysicsEnabled(false);
        p1Obj.showInfoPanel(
            "Game over!",
            null,
            "Your score : " + p1Env.score + " Opponent score : " + p2Env.score,
            false,
            function() {
                Project.finishPlayMode();
            }
        );
    }
}

var p1Obj = Space.createItem("Sphere", 11, 0, 0);
p1Obj.setColor(255, 0, 0);
var p2Obj = Space.createItem("Sphere", -11, 0, 0);
p2Obj.setColor(0, 0, 255);
var p1Env = new Env(p1Obj, p2Obj);
var p2Env = new Env(p2Obj, p1Obj);
generateAims(N);
var sp = {};
var gameReg = Space.scheduleRepeating(function () {
    if (finished) {
        gameReg.dispose();
        return;
    }
    try {
        p1(p1Env, sp, sp);
    } catch (e) {
        Project.log("Exception in p1(): " + e);
    }
    check(p1Env);
    try {
        p2(p2Env, sp, sp);
    } catch (e) {
        Project.log("Exception in p2(): " + e);
    }
    check(p2Env);
}, 1 / 32);
