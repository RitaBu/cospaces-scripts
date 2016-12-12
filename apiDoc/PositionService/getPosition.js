var bird = Space.createItem('LP_BlackBird', 1.5, 2, 2);

var birdPos = bird.getPosition();

bird.say('I\'m at: (' + birdPos.x + ', ' + birdPos.y + ', ' + birdPos.z + ')');
