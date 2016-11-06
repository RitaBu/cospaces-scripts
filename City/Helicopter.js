var heli = Space.getItem("EYJOH5zT0b");
var building = Space.getItem("sDAMBMkTCaaSwhXczOyOdDP");
var start = building.getPosition();

var zFlight = 20;
var radius = 12;
var velocity = 3;

var flightHeli = function() {

  heli.startHelicopter();
  Space.schedule(function() {
    heli.moveBezierToWithCallback(start.x + 1, start.y, zFlight, velocity, function(){
      heli.moveBezierCircle(0, 0, zFlight, radius, velocity);
      Space.schedule(function() {
        heli.moveBezierToObj(building, "Top", velocity, stopHeli);
      }, 30);
    });
  }, 5);

  var stopHeli = function() {
    heli.stopHelicopter();
    Space.schedule(flightHeli, 10);
  }

};

flightHeli();