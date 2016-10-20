define(function () {
  var Timeline = function (duration, updateInterval) {
    this.duration = duration;
    this.startTime = 0;
    this.scheduled = null;
    this.updateInterval = updateInterval;
    this.lastUpdateTime = 0;
    this.allTimes = [];
    this.allAnims = [];
    this.runningAnims = [];
  };

  Timeline.prototype.addAnimation = function (a, time) {
    if (this.startTime > 0 && ((Space.currentTime() - this.lastUpdateTime) > time)) {
      Project.log("Time elapsed even before starting for " + a);
    }
    this.allTimes.push(time);
    this.allAnims.push(a);
  };

  Timeline.prototype.start = function () {
    var that = this;
    this.startTime = Space.currentTime();
    this.lastUpdateTime = this.startTime;
    this.scheduled = Space.scheduleRepeating(function () {
      that.update();
    }, 0);
  };

  Timeline.prototype.update = function () {
    var that = this;
    var timePassed = Space.currentTime() - that.lastUpdateTime;
    if ((timePassed) >= this.updateInterval) {
      that.lastUpdateTime = Space.currentTime();
      that.allTimes.forEach(function (t, index) {
        var totalTimePassed = Space.currentTime() - that.startTime;
        if (t >= (totalTimePassed)) {
          //Project.log("Total time passed: " + totalTimePassed);
          var a = that.allAnims[index];
          that.runningAnims.push(a);
          that.allAnims.splice(index, 1);
          that.allTimes.splice(index, 1);
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
  };

  return Timeline;
});
