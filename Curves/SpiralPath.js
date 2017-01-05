var path = Space.createSpiralPath(0, 0, 1, 1, Math.PI, 5, 20, 1, 30, 0, 0);
var cube = Space.createItem("cube", 0, 0, 0.5);

var camera = Space.getCameraItem();
camera.setMovement("fixed");
camera.moveBezierPath(path, false);

Space.renderServiceItems(false);
Space.renderLineItems(false);
