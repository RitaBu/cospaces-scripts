var camera = Space.getCameraItem();
camera.setMovement("fixed");

var sqrt2 = Math.sqrt(2) * 0.5;
var i = 0;
function fly() {
    var path;
    if (i % 4 === 0) {
        var z = 50 + Math.random() * 40;
        path = Space.createLinePath(0, 0, z, 0, 0, z + 15, -sqrt2, 0, 0, sqrt2, 15);
    } else if (i % 4 === 1) {
        var z = 5 + Math.random() * 30;
        var x = Math.random() * 60 + 20;
        var y = Math.random() * 60 + 20;
        path = Space.createLinePathWithDefaultOrientation(x, y, z, 0, 0, 0, 30);
    } else if (i % 4 === 2) {
        var x0 = Math.random() * 60 + 20;
        var y0 = Math.random() * 60 + 20;

        var x1 = Math.random() * 60 + 20;
        var y1 = Math.random() * 60 + 20;

        var z = 50 + Math.random() * 40;
        path = Space.createLinePath(x0, y0, z, x1, y1, z + 10, -sqrt2, 0, 0, sqrt2, 30);
    } else if (i % 4 === 3) {
        var z = 10;
        var r = 20;
        path = Space.createSpiralPath(1, 1, z, r, Math.random() * 2 * Math.PI, 1, 6, 1, 240);
    }
    camera.moveBezierPath(path, false);
    i++;
    Space.schedule(fly, 10);

}
fly();

Space.renderServiceItems(false);
