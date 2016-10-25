var heli = Space.createItem("LP_Helicopter");
var building = Space.getItem("sDAMBMkTCaaSwhXczOyOdDP");
var start = building.getPosition();
heli.setPosition(start.x, start.y, start.z + 7);

var zFlight = 20;
var radius = 12;
var velocity = 3;

var flightHeli = function(){

  heli.startHelicopter();
  Space.schedule(function(){
    heli.moveBezierToWithCallback(start.x, start.y, zFlight, velocity, function(){
      heli.moveBezierCircle(0, 0, zFlight, radius, velocity);
      Space.schedule(function(){
        heli.moveBezierToObj(building, "Top", velocity, stopHeli);
      }, 30);
    });
  }, 5);

  var stopHeli = function(){
    heli.stopHelicopter();
    Space.schedule(flightHeli, 10);
  }

};

Space.schedule(flightHeli, 0);