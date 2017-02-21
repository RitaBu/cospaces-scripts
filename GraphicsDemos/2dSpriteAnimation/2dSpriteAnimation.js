/**
 * SpriteAnimation constructor function
 *
 */
function SpriteAnimation(sequence, options) {
  this.opt = options;
  this.seq = sequence;
  this.pos = sequence[0].getPosition();
  this.orientQuat = sequence[0].getOrientationQuat();
  this.cam = Space.getItem(options.camId);
  this.init();
  this.run();
}

SpriteAnimation.prototype.init = function () {
  for (var i = 0; i < this.seq.length; i++) {
    this.seq[i].setPositionQuat(this.pos.x, this.pos.y, this.pos.z, this.orientQuat.x, this.orientQuat.y, this.orientQuat.z, this.orientQuat.w);
  }
};

SpriteAnimation.prototype.run = function () {
  var self = this;
  var index = 0;
  Space.scheduleRepeating(function () {
    for (var i = 0; i < self.seq.length; i++) {
      if (self.opt.faceToCam) self.seq[i].faceTo(self.cam);
      if (index % self.seq.length === i) {
        self.seq[i].setScale(1);
      } else {
        self.seq[i].setScale(0);
      }
    }
    index++;
  }, 1 / self.opt.fps);
};

// Instantiate animations
new SpriteAnimation([
  Space.getItem('2jZVIWi8e7'),
  Space.getItem('3bbFixClSR'),
  Space.getItem('C36CuTPxNq'),
  Space.getItem('6o8uZz1Mv0'),
  Space.getItem('eEWWjDk82a'),
  Space.getItem('ffHOwub6I3'),
  Space.getItem('JYJbZrQ9oT'),
  Space.getItem('rUrGkC9Nhb'),
  Space.getItem('WytXtNM1CZ'),
  Space.getItem('TSeY8Ejyd6'),
  Space.getItem('05V9ouBzL8'),
  Space.getItem('n332vnV6te')
], {
  camId: 'or5v4PSMZB',
  faceToCam: false,
  fps: 24
});

new SpriteAnimation([
  Space.getItem('Q82s4bdF3o'),
  Space.getItem('AcK8Y16R1j'),
  Space.getItem('rUFdfwgHqA'),
  Space.getItem('buI4y007BY')
], {
  camId: 'or5v4PSMZB',
  faceToCam: true,
  fps: 10
});
