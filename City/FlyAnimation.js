//animation
//var pos0 = city.getCellCenter(4, 2);
var pos0 = city.getCellCenter(0, 2);
var pos1 = city.getCellCenter(2, 2);
var pos2 = city.getCellCenter(4, 2);

//var line2 = Space.createStraightLineItem(pos1.x, pos1.y, 20, pos2.x, pos2.y, 20);
var line2 = Space.createStraightLineItem(pos1.x, pos1.y, 5, pos2.x, pos2.y, 20);
var line3 = Space.createStraightLineItem(pos0.x, pos0.y, 2, pos2.x, pos2.y, 6);


var heli2 = Space.getItem("C7Z1hl2kmk");
heli2.moveBezierWithOrientation(line2.id(), 0.5, false, Space.getItem("CyA81NYaaV"));

Space.schedule(function() {
    heli.startHelicopter();
    heli.moveBezier(line3.id(), 2, false);
}, 1);

heli2.focusOn(true);
