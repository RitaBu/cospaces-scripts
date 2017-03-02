var lion = Scene.createItem('LP_Lion', 0, -10, 0);
var horse = Scene.createItem('LP_Horse', 3, 2, 0);

lion.think('Only ' + lion.distanceToItem(horse) + ' units until I get you!');
