/*
 var n = 50;
 for (var i = 0; i < n; i++) {
 var ellipsoid = Space.createItem("Hemiellipsoid");
 ellipsoid.setScale(1 + i*0.1);
 ellipsoid.rotateLocalAxis(0, 0, 0, 0, 1, 0, Math.PI/2, true);
 //ellipsoid.move(0, 0.01);
 var c = Math.ceil(255-i*255/n);
 ellipsoid.setColor(c, c, c);
 }
 */

function generateSphere() {
  var n = 50;
  for (var i = 0; i < n; i++) {
    var ellipsoid = Space.createItem("Hemiellipsoid");
    ellipsoid.setScale(1 + i * 0.1);
    ellipsoid.rotateLocalAxis(0, 0, 0, 0, 1, 0, Math.PI / 2, true);
    //ellipsoid.move(0, 0.01);
    var c = Math.ceil(255 - i * 255 / n);
    ellipsoid.setColor(c, 255, 255);
  }
}

Space.setRenderShadows(false);
Space.schedule(function () {
  var item1 = Space.getItem("9AS8YtqjDm");
  var item2 = Space.getItem("FYYhSesl2r");
  var item3 = Space.getItem("671ZzGKXml");
  var item4 = Space.getItem("a3x69LZ9vi");

  Space.scheduleRepeating(function () {
    item1.rotateLocalAxis(1, 0, 0, 1, 0, 0, Math.PI / 180, true);
    item2.rotateLocalAxis(1, 0, 0, 1, 0, 0, Math.PI / 180, true);
    item3.rotateLocalAxis(1, 0, 0, 1, 0, 0, -Math.PI / 180, true);
  }, 0);

  Space.schedule(function () {
    Space.scheduleRepeating(function () {
      item3.rotateLocalAxis(0, 0, 1, 0, 0, 1, -Math.PI / 180, true);
    }, 0);
    Space.schedule(function () {
      Space.scheduleRepeating(function () {
        item2.rotateLocalAxis(0, 0, 1, 0, 0, 1, -Math.PI / 180, true);
        item4.rotateLocalAxis(0, 1, 0, 0, 1, 0, -Math.PI / 180, true);
      }, 0);
      Space.schedule(function () {
        Space.scheduleRepeating(function () {
          item1.rotateLocalAxis(0, 0, 1, 0, 0, 1, Math.PI / 180, true);
        }, 0);
      }, 13);
    }, 13);
  }, 13);

}, 6);

