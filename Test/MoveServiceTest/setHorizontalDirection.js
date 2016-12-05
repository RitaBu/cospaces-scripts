var lion = Space.createItem('LP_Lion', 2, 2, 2);

var angle = 0;
var dAngle = Math.PI / 10;

Space.scheduleRepeating(function(){
  lion.setHorizontalDirection(Math.sin(angle), Math.cos(angle));
  angle += dAngle;
}, 0.5);
