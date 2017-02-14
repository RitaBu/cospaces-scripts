// Helpers
var N = 21;
var finished = false;
var DELTA = 0.001;

function normalize(x, y) {
    var len = Math.sqrt(x * x + y * y);
    return {x: x / len, y: y / len};
}

function CheckerEnv(p1Obj, p2Obj, items, itemCoords) {
    this.p1Obj = p1Obj;
    this.p2Obj = p2Obj;
    this.items = items;
    this.itemCoords = itemCoords;
    this.p1Score = 0;
    this.p2Score = 0;
    this.log = Project.log;
}

function PlayerEnv(me, opponent) {
    this.getPosition = function () {
        return me.getPhysicsPosition();
    };
    this.getOpponentPosition = function () {
        return opponent.getPhysicsPosition();
    };
    this.getAims = function () {
        return itemCoords;
    };
    this.getTargets = function () {
        return itemCoords;
    };
    this.move = function (x, y) {
        if (Math.abs(x) < DELTA && Math.abs(y) < DELTA) {
            me.setVelocity(0, 0, 0);
        } else {
            var v = normalize(x, y);
            me.setVelocity(v.x, v.y, 0);
        }
    };
    this.log = Project.log;
    this.score = 0;
}
// Helpers END
Space.setPhysicsEnabled(true);

var p1Obj = Space.createItem("Sphere", 11, 0, 0);
p1Obj.setColor(255, 0, 0);
var p2Obj = Space.createItem("Sphere", -11, 0, 0);
p2Obj.setColor(0, 0, 255);
var items = [];
var itemCoords = [];
for (var i = 0; i < N; i++) {
    var x = Math.random() * 20 - 10;
    var y = Math.random() * 20 - 10;
    var aim = Space.createItem("Sphere", x, y, 0);
    aim.setColor(0, 255, 0);
    aim.setScale(0.85);
    aim.setStatic();
    items.push(aim);
    itemCoords.push(aim.getPhysicsPosition());
}

Obj.publish(new CheckerEnv(p1Obj, p2Obj, items, itemCoords));
Obj.publish(new PlayerEnv(p1Obj, p2Obj));
Obj.publish(new PlayerEnv(p2Obj, p1Obj));
