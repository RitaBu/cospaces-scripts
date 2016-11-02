var city = Space.createCity(0, 0);
city.buildGridCity(5, 3, 1);

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
Space.renderServiceItems(true);

var rs = city.roadWidth() / 4;
var bs = city.blockSize() / 2;

var velocity = 2;

function createCar(i, line) {
    var modelId = i % 2 === 0 ? "LP_Car" : "LP_Bus";
    var car = Space.createItem(modelId);
    car.moveBezier(line.id(), velocity, true);
    car.setScale(0.8);
}

function createPath(path) {
    var lineId = city.createTrajectory(path);
    var line = Space.getItem(lineId);

    var n = path.length / 2;
    var i = 0;

    createCar(i, line);

    for (i = 1; i < n; i++) {
        line = line.shift();
        createCar(i, line);
    }
}

createPath([0, 0, 0, 2, 2, 2, 2, 0]);

Space.setCarDriveController(3, 1.5);
