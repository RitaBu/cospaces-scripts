function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (i = 0; i < 100; i++) {
  var item = Space.createItem("Box2", 0, 0, 0);
  item.setColor(random(0, 255), random(0, 255), random(0, 255));
  item.setPosition(Math.random() * 3, Math.random() * 3, 10 + Math.random() * 10, true);
}

Space.setPhysicsEnabled(true);