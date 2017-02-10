function checkForPlayer(playerPos, itemPos) {
    var DELTA = 0.6;
    if (Math.abs(playerPos.x - itemPos.x) < DELTA && Math.abs(playerPos.y - itemPos.y) < DELTA) {
        var item = env.items[i];
        item.deleteFromSpace();
        env.items.splice(i, 1);
        env.itemCoords.splice(i, 1);
        return true;
    }
    return false;
}
var p1Pos = env.p1Obj.getPhysicsPosition();
var p2Pos = env.p2Obj.getPhysicsPosition();
for (var i = 0; i < env.items.length; i++) {
    var itemPos = env.itemCoords[i];
    if (checkForPlayer(p1Pos, itemPos)) {
        env.p1Score++;
        continue;
    }
    if (checkForPlayer(p2Pos, itemPos)) {
        env.p2Score++;
    }
}

if (env.items.length === 0) {
    Result.publish(env.p1Score);
    Result.publish(env.p2Score);
}
