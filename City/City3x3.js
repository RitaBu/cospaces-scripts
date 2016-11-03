var city = Space.createCity(0, 0);
city.buildGridCity(3, 3, 1);

city.addTrees(1, 0);
city.addTrees(1, 2);

city.addTrees(3, 6);

city.addTrees(4, 1);
city.addTrees(4, 5);

city.addTrees(5, 0);
city.addTrees(5, 6);

city.addTrees(6, 1);
city.addTrees(6, 3);
city.addTrees(6, 5);

city.addLamps(1, 2);
city.addLamps(1, 4);

city.addLamps(2, 1);
city.addLamps(2, 3);

city.addLamps(3, 2);
city.addLamps(3, 4);

city.addLamps(4, 1);
city.addLamps(4, 3);
city.addLamps(4, 5);

city.addLamps(5, 2);
city.addLamps(5, 4);

city.addSigns(1, 2);
city.addSigns(1, 4);

city.addSigns(2, 1);
city.addSigns(2, 3);

city.addSigns(3, 2);
city.addSigns(3, 4);

city.addSigns(4, 1);
city.addSigns(4, 3);
city.addSigns(4, 5);

city.addSigns(5, 2);
city.addSigns(5, 4);

city.rebuild();

Space.renderShadows(false);
Space.renderServiceItems(false);


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

addTrafficLight(2, 2, 0);
addTrafficLight(4, 2, 1);
addTrafficLight(2, 4, 1);
addTrafficLight(4, 4, 0);

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

createPath([0, 0, 0, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 0], 4);
createPath([2, 0, 2, 2, 6, 2, 6, 0], 4);
createPath([0, 2, 0, 4, 6, 4, 6, 2], 4);
createPath([0, 4, 0, 6, 6, 6, 6, 4], 4);

createPath([0, 2, 2, 2, 2, 6, 0, 6], 4);
createPath([2, 0, 4, 0, 4, 6, 2, 6], 4);
createPath([4, 0, 6, 0, 6, 6, 4, 6], 4);

Space.setCarDriveController(3, 1.5);
