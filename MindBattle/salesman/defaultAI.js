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