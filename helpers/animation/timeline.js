define(function () {
  var Timeline = function (duration) {
    this.duration = duration;
    this.startTime = 0;
    this.scheduled = null;
    this.updateInterval = 1;
    this.lastUpdateTime = 0;
    this.allTimes = [];
    this.allAnims = [];
    this.runningAnims = [];
  };

  Timeline.prototype.addAnimation = function (a, time) {
    this.times.push(time);
    this.allAnims.push(a);
  };

  Timeline.prototype.start = function () {
    var that = this;
    this.startTime = Space.currentTime();
    this.lastUpdateTime = this.startTime;
    this.scheduled = Space.schedule(function () {
      if ((Space.currentTime() - that.lastUpdateTime) >= this.updateInterval) {
        that.lastUpdateTime = Space.currentTime();
        that.allTimes.forEach(function (t, index) {
          if (t >= (Space.currentTime() - that.lastUpdateTime)) {
            var a = that.allAnims[index];
            that.runningAnims.push(a);
            that.allAnims.remove(index);
            that.allTimes.remove(index);
            a.start();
          }
        });
        that.runningAnims.forEach(function (a, index) {
          a.update();
          if (a.finished) {
            that.runningAnims.splice(index, 1);
          }
        });
      }
    }, 0);
  };

  return Timeline;
});
