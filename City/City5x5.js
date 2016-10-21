var city = Space.createCity(5, 5, 1);

city.addTrees(1, 1, true);
city.addTrees(2, 1, true);
city.addTrees(4, 1, true);
city.addTrees(5, 1, true);

city.addTrees(4, 2, true);

city.addTrees(2, 4, true);
city.addTrees(3, 4, true);
city.addTrees(4, 4, true);

city.addTrees(1, 1, false);
city.addTrees(1, 2, false);
city.addTrees(1, 3, false);

city.addTrees(2, 1, false);
city.addTrees(2, 3, false);

city.addTrees(4, 1, false);
city.addTrees(4, 3, false);

city.removeRoad(1, 1, 3);
city.removeRoad(1, 1, 2);
city.removeRoad(1, 1, 1);
city.removeRoad(1, 1, 0);

Space.setRenderShadows(false);