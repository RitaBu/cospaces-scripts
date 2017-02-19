var pos = env.getPosition();
function dist(aim) {
    var dx = pos.x - aim.x;
    var dy = pos.y - aim.y;
    return Math.sqrt(dx*dx + dy*dy);
}

var targets = env.getTargets();
var minDist = 10000;
var target = {x:0, y:0};
for (var i = 0; i < targets.length; i++) {
    var d = dist(targets[i]);
    if (d < minDist) {
        target = targets[i];
        minDist = d;
    }
}
env.move(target.x - pos.x, target.y - pos.y);