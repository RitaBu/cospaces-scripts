var lion = Scene.createItem('LP_Lion', 0, 0, 0);

function changeColor() {
  lion.setColor(255, 255, 255);
  lion.say('Callback executed.');
}

lion.say('Wait for 3 seconds.');

Scene.schedule(changeColor, 3);
