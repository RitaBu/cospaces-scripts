var aims = env.getAims();
var min = -1;
var index = -1;

var pos = env.getPosition();

if (aims.length == 1) {
    index = 0;
} else if (aims.length == 2) {
    var d0 = d(pos, aims[0]);
    var d1 = d(pos, aims[1]);

    var near = d0 < d1 ? 0 : 1;
    var dNear = d0 < d1 ? d0 : d1;
    var dFar = d0 < d1 ? d1 : d0;

    var d2Near = d(env.getOpponentPosition(), aims[near]);
    //var d2Far = d(env.getOpponentPosition(), aims[1 - near]);

    if (d2Near < dNear && d2Near + d(aims[0], aims[1]) > dFar) {
        index = 1 - near;
    } else {
        index = near;
    }
} else if (aims.length == 3) {
    var d0 = d(pos, aims[0]);
    var d1 = d(pos, aims[1]);
    var d2 = d(pos, aims[2]);

    var near;
    var near2;
    if (d0 < d1 && d0 < d2) {
        near = 0;
        near2 = d1 < d2 ? 1 : 2;
    } else {
        if (d1 < d2) {
            near = 1;
            near2 = d0 < d2 ? 0 : 2;
        } else {
            near = 2;
            near2 = d0 < d1 ? 0 : 1;
        }
    }

    var dNear = (d0 < d1 && d0 < d2) ? d0 : (d1 < d2 ? d1 : d2);
    var d2Near = d(env.getOpponentPosition(), aims[near]);

    if (d2Near < dNear) {
        index = near2;
    } else {
        index = near;
    }
} else if (aims.length > 0) {

    for (var i = 0; i < aims.length; i++) {
        var di = d(pos, aims[i]);
        for (var j = 0; j < aims.length; j++) {
            if (i != j) {
                var dj = d(aims[i], aims[j]);
                for (var k = 0; k < aims.length; k++) {
                    if (i != k && j != k) {
                        var dk = d(aims[j], aims[k]);
                        var dd = di + dj + dk;
                        if (min < 0 || dd < min) {
                            min = dd;
                            index = i;
                        }
                    }
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
