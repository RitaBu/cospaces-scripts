function Skyscraper(pos) {
  this.base = Scene.createItem('Frstm', pos.x, pos.y, 0);
  this.height = 0;
  this.base.setHeight(this.height);
  this.base.setBaseDimensions(Math.random() * 3, Math.random() * 3, Math.random());
  this.base.setVertices(Math.floor(Math.random() * 4 + 3));
}

Skyscraper.prototype.grow = function () {
  let targetHeight = Math.random() * 15;
  let disposable = Scene.scheduleRepeating(() => {
    this.height += 0.1;
    if (this.height <= targetHeight) {
      this.base.setHeight(this.height);
    } else {
      disposable.dispose();
    }
  }, 0);
};

for (let x = -20; x < 20; x++) {
  for (let y = -20; y < 20; y++) {
    let s = new Skyscraper({x: x * 2.5, y: y * 2.5, z: 0});
    s.grow();
  }
}
