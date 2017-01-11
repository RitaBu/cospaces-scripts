var heli = Space.createItem("LP_Helicopter");
heli.setColor(255, 255, 0); //yellow

var building = Space.createItem("LP_Building3", 0, 0, 0);
var top = building.getSlotTransform("top");
var start = top.getPosition();

heli.setPosition(start.x, start.y, start.z);

var zFlight = 4;
var radius = 5;
var time = 3;

var h = start.z + zFlight;

var flightHeli = function() {
    building.say("start");
    heli.startHelicopter();
    Space.schedule(function() {
        building.say("takeoff");
        heli.moveBezierTo(start.x, start.y, h, time, function(){
            building.say("flying");
            heli.moveBezierCircle(0, 0, h, radius, 30);
            Space.schedule(land, 10);
        });
    }, 5);
};

var land = function() {
    building.say("landing");
    heli.moveBezierToObj(building, "top", time, stopHeli);
};

var stopHeli = function() {
    building.say("stop");
    heli.stopHelicopter();
    Space.schedule(flightHeli, 8);
};

flightHeli();
