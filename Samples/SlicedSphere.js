for (var i = 0; i < 50; i++) {
  var ellipsoid = Space.createItem("Hemiellipsoid");
  ellipsoid.setScale(1 + i*0.1);
  ellipsoid.rotateLocalAxis(0, 0, 0, 0, 1, 0, Math.PI/2, true);
  //ellipsoid.move(0, 0.01);
  var c = 255-i*255/5;
  ellipsoid.setColor(c, c, c);
}