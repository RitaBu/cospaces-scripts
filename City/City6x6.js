//https://newcospaces.dx.labs.intellij.net/#Project:CkTcwhNsVW0.GWs1ktTIKDY:qFOLqjeQqJRgw29iCQA6Vd
var city = Space.createCity(0, 0);
city.buildRoundRoad(13, 13, 1);
city.fillGrid(4, 4, 1, 2, 2);

city.setCell(8, 3, 1, 0);
city.setCell(8, 4, 4 * 16, 2);
city.setCell(8, 2, 2 * 16, 1);

city.addTrees(9, 3);
city.addTrees(8, 3);
city.addTrees(7, 3);

city.setCell(0, 6, 4 * 16, 1);
city.setCell(1, 6, 2 * 16, 1);
city.setCell(2, 6, 1 * 16, 0);

city.setCell(10, 6, 1 * 16, 0);
city.setCell(11, 6, 2 * 16, 1);
city.setCell(12, 6, 4 * 16, 3);

city.setCell(6, 0, 4 * 16, 2);
city.setCell(6, 1, 2 * 16, 0);
city.setCell(6, 2, 1 * 16, 0);

city.setCell(6, 10, 1 * 16, 0);
city.setCell(6, 11, 2 * 16, 0);
city.setCell(6, 12, 4 * 16, 0);

city.setCell(1, 2, 1, 0);
city.setCell(1, 3, 1, 0);
city.setCell(1, 4, 1, 0);
city.setCell(1, 5, 1, 0);

city.addTrees(1, 2);
city.addTrees(1, 3);
city.addTrees(1, 4);

city.addTrees(3, 10);
city.addTrees(4, 9);
city.addTrees(5, 10);

city.addTrees(5, 4);
city.addTrees(5, 8);
city.addTrees(6, 5);

city.addTrees(7, 10);

city.addTrees(8, 9);

city.addTrees(9, 4);
city.addTrees(9, 10);

city.addTrees(10, 7);
city.addTrees(10, 9);

city.addLamps(4, 9);

city.addLamps(5, 6);
city.addLamps(5, 8);

city.addLamps(6, 5);
city.addLamps(6, 7);
city.addLamps(6, 9);

city.addLamps(7, 6);
city.addLamps(7, 8);

city.addLamps(8, 5);
city.addLamps(8, 7);
city.addLamps(8, 9);

city.addLamps(7, 4);
city.addLamps(9, 4);
city.addLamps(9, 6);
city.addLamps(9, 8);

city.addSigns(5, 6);
city.addSigns(5, 8);

city.addSigns(6, 5);
city.addSigns(6, 7);

city.addSigns(7, 6);
city.addSigns(7, 8);

city.addSigns(8, 5);
city.addSigns(8, 7);
city.addSigns(8, 9);

city.addSigns(9, 6);
city.addSigns(9, 8);

city.rebuild();

Space.renderServiceItems(false);

//animation
var heli = Space.getItem("kNUFPcIlCb");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//var heli2 = Space.getItem("FOPlwoGGPl");
var heli2 = Space.getItem("1rzE7rqIRs");
//var heli2 = Space.getItem("GHZQErtp76");

var sqrt2 = Math.sqrt(2) * 0.5;
var i = 0;
function fly() {
    //Project.log("i = " + i);
    var path;
    if (i % 6 === 1) {
        var z = 10 + Math.random() * 30;
        path = Space.createLinePath(0, 0, z, 0, 0, z + 15, -sqrt2, 0, 0, sqrt2, 15);
    } else if (i % 6 === 2) {
        var x = 6;
        var y = 6;
        while (x === 6 && y === 6) {
            x = getRandomInt(2, 4) * 2;
            y = getRandomInt(2, 4) * 2;
        }
        var pos = city.getCellCenter(x, y);
        var z = 5 + Math.random() * 30;
        path = Space.createLinePathWithDefaultOrientation(pos.x, pos.y, z, 0, 0, 0, 30);
    } else if (i % 6 === 3) {
        var x = getRandomInt(2, 4) * 2;
        var pos0 = city.getCellCenter(x, 4);
        var pos1 = city.getCellCenter(x, 8);

        var z = 5 + Math.random() * 20;
        path = Space.createLinePath(pos0.x, pos0.y, z, pos1.x, pos1.y, z + 10, -sqrt2, 0, 0, sqrt2, 30);
    } else if (i % 6 === 5) {
        var x = getRandomInt(2, 4) * 2;
        var pos0 = city.getCellCenter(4, x);
        var pos1 = city.getCellCenter(8, x);

        var z = 5 + Math.random() * 20;
        path = Space.createLinePath(pos0.x, pos0.y, z, pos1.x, pos1.y, z + 10, -sqrt2, 0, 0, sqrt2, 30);
    } else {
        path = Space.createSpiralPath(1, 1, 10, 20, Math.random() * 2 * Math.PI, 1, 6, 5, 240);
    }
    heli2.moveBezierPath(path, false);
    i++;
    Space.schedule(fly, 10);

}

fly();

/*
 Space.schedule(function() {
 heli.startHelicopter();
 heli.moveBezier(line3.id(), 2, false);
 }, 1);
 */

heli2.focusOn(true);

//cars
var velocity = 2;

function createCar(i, line) {
    var modelId = i % 2 === 0 ? "LP_Car" : "LP_Bus";
    var car = Space.createItem(modelId);
    car.moveBezier(line.id(), velocity, true);
    car.setScale(0.8);
}

function createPath(path, n) {
    var lineId = city.createTrajectory(path);
    var line = Space.getItem(lineId);

    var i = 0;

    createCar(i, line);

    for (i = 1; i < n; i++) {
        line = line.shift();
        createCar(i, line);
    }
}

createPath([4, 4, 4, 6, 6, 6, 6, 8, 8, 8, 8, 6, 6, 6, 6, 4], 4);
createPath([6, 4, 6, 6, 10, 6, 10, 4], 4);
createPath([4, 6, 4, 8, 10, 8, 10, 6], 4);
createPath([4, 8, 4, 10, 10, 10, 10, 8], 4);

createPath([4, 6, 6, 6, 6, 10, 4, 10], 4);
createPath([6, 4, 8, 4, 8, 10, 6, 10], 4);
createPath([8, 4, 10, 4, 10, 10, 8, 10], 4);

//traffic light
var bs = city.blockSize() / 2;

var file = "%%98efa9b173c24d877a7d54f51889bc5a7d98d0b9b747c4e771cf53589e1b41fc:";
var states = ["D", "C", "A", "B"];

function addTrafficLight(w, h, dt) {
    var pos = city.getCellCenter(w, h);
    var x = pos.x;
    var y = pos.y;
    var d = 0.7 * bs;
    var d2 = 0.5 * bs;
    var item0 = Space.createItem(file + states[0], x + d, y + d2, 0);
    item0.setHorizontalDirection(1, 0);
    item0.setProperty("light", "red");

    var item1 = Space.createItem(file + states[0], x - d, y - d2, 0);
    item1.setHorizontalDirection(-1, 0);
    item1.setProperty("light", "red");

    var item2 = Space.createItem(file + states[0], x - d2, y + d, 0);
    item2.setHorizontalDirection(0, 1);
    item2.setProperty("light", "red");

    var item3 = Space.createItem(file + states[0], x + d2, y - d, 0);
    item3.setHorizontalDirection(0, -1);
    item3.setProperty("light", "red");

    var index = 0;

    function tick() {
        index = (index + 1) % 4;
        var pause;

        if (index === 0) {
            item0.setProperty("light", "red");
            item0.setModelId(file + states[0]);
            item1.setProperty("light", "red");
            item1.setModelId(file + states[0]);

            item2.setProperty("light", "green");
            item2.setModelId(file + states[2]);
            item3.setProperty("light", "green");
            item3.setModelId(file + states[2]);
            pause = 6;
        } else if (index === 2) {
            item0.setProperty("light", "green");
            item0.setModelId(file + states[2]);
            item1.setProperty("light", "green");
            item1.setModelId(file + states[2]);

            item2.setProperty("light", "red");
            item2.setModelId(file + states[0]);
            item3.setProperty("light", "red");
            item3.setModelId(file + states[0]);
            pause = 6;
        } else {
            item0.setProperty("light", "yellow");
            item0.setModelId(file + states[3]);
            item1.setProperty("light", "yellow");
            item1.setModelId(file + states[3]);

            item2.setProperty("light", "yellow");
            item2.setModelId(file + states[3]);
            item3.setProperty("light", "yellow");
            item3.setModelId(file + states[3]);
            pause = 3;
        }
        Space.schedule(tick, pause);
    }

    Space.schedule(tick, 1 + dt);
}

addTrafficLight(6, 4, 0);
addTrafficLight(8, 4, 1);

addTrafficLight(4, 6, 0);
addTrafficLight(6, 6, 0);
addTrafficLight(8, 6, 1);
addTrafficLight(10, 6, 1);

addTrafficLight(6, 8, 1);
addTrafficLight(8, 8, 0);

addTrafficLight(6, 10, 1);
addTrafficLight(8, 10, 0);

Space.setCarDriveController(2, 1);

var heli = Space.getItem("vJzwDTad2D");
var building = Space.getItem("sDAMBMkTCaaSwhXczOyOdDP");
var top = building.getSlotTransform("Top");
var start = top.getPosition();

var zFlight = 20;
var radius = 12;
var velocity = 3;

var flightHeli = function() {
    heli.startHelicopter();
    Space.schedule(function() {
        heli.moveBezierToWithCallback(start.x + 1, start.y, zFlight, velocity, function(){
            heli.moveBezierCircle(0, 0, zFlight, radius, velocity);
            Space.schedule(land, 30);
        });
    }, 5);
};

var land = function() {
    var pos = heli.getPosition();
    var d2 = (pos.x - start.x) * (pos.x - start.x) + (pos.y - start.y) * (pos.y - start.y);
    if (d2 < 9) {
        heli.moveBezierToObj(building, "Top", velocity, stopHeli);
    } else {
        Space.schedule(land, 2);
    }
};

var stopHeli = function() {
    heli.stopHelicopter();
    Space.schedule(flightHeli, 10);
};

flightHeli();

var sound = Space.loadSound('PKEyAf8Zh9xOhya0ujrIaixWJDwC3C2Y7LZvu56ldZi');
sound.play(true);


