function randomPosition() {
    return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: Math.random() * 2 * radius};
}

var radius = 5;

var man = Space.createItem('LP_Man', 0, 0, radius);
var target = Space.createItem("Sphere", 0, 0, 0);
target.setScale(0.5);
target.setColor(0, 0, 255);

moveTo();
function moveTo() {
    var pos = randomPosition();
    target.setPosition(pos.x, pos.y, pos.z);
    man.say('moveBezierTo');
    man.moveBezierTo(pos.x, pos.y, pos.z, 3, function() {
        man.say('rotateLocal');
        man.rotateLocal(0, 1, 0, Math.PI * 0.25 * (1 + Math.random()), 1, moveTo);
    });
}
