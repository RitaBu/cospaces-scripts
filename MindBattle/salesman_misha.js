var aims = env.getAims();
var min = -1;
var index = -1;

var pos = env.getPosition();

if (aims.length == 1) {
    index = 0;
} else if (aims.length > 0) {

    for (var i = 0; i < aims.length; i++) {
        var di = d(pos, aims[i]);
        for (var j = 0; j < aims.length; j++) {
            if (i != j) {
                var dj = d(aims[i], aims[j]);
                var d1 = di + dj;
                if (min < 0 || d1 < min) {
                    min = d1;
                    index = i;
                }
            }
        }
    }
}

if (index != -1) {
    env.move(aims[index].x - pos.x, aims[index].y - pos.y);
}

function d(pos0, pos1) {
    return Math.sqrt((pos1.x - pos0.x) * (pos1.x - pos0.x) + (pos1.y - pos0.y) * (pos1.y - pos0.y))
}
