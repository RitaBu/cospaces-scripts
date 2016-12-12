var woman = Space.createItem('LP_Wom', 0, 0, 0);

var camera = Space.getCamera();
var camDirVec;
var str;

Space.scheduleRepeating(function() {
  camDirVec = camera.getDirection();
  str = 'The camera direction vector is: [' + camDirVec.x.toFixed(2) +
    ', ' + camDirVec.y.toFixed(2) +
    ', ' + camDirVec.z.toFixed(2) +
    ']';
  woman.say(str);
}, 0);
