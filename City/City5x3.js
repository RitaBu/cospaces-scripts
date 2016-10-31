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

city.addTrees(8, 5);
city.addTrees(9, 4);

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