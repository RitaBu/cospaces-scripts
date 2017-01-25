//#region "Setup"
//Physics Settings
Space.setPhysicsEnabled(true, true);
Space.setPhysicsGravity(3);
//Used objects in the scene
var pCharacter = Space.getItem("IceSkaterWoman");
var posMarker = Space.getItem("PositionMarker");
var orientationMarker = Space.getItem("OrientationMarker");
var playArea = Space.getItem("playArea");
var christmasTree = Space.getItem("Christmas_Tree");
var scoreScreen = Space.getItem("ScoreScreen");
var snowman1 = Space.getItem("Snowman1");
var snowman2 = Space.getItem("Snowman2");
var snowman3 = Space.getItem("Snowman3");
var snowman4 = Space.getItem("Snowman4");
//Arrays used for various checks
var snowmen = [snowman1, snowman2, snowman3, snowman4];
var busySnowMen = [];
var colliders = [snowman1, snowman2, snowman3, snowman4, christmasTree];
var stars = [];
//Metrics (Gameplay Values)
var movementSpeed = 0.025;
var score = 0;
var pCharacterHit = false;
var gameManager;
var movementLogic;
var activeManagers = [];
var collectionCheck;
var gameOver = false;
//Pictures/Sound
var snowBallThrowSFX = Space.loadSound("x2ORHI81dty7NtMvMwwAWK1zTjiLKe9v0LvLAqCCaO");
var snowBallImpactSFX = Space.loadSound("samJ7uxL10pCFvaQRoC7U7SFJ4qlrdsJTSddTrvCBX7");
var starSFX = Space.loadSound("6e93xmAKOgu7cAuSkUzPwPfoU0yNErF7l9zQoGxy61d");
var iceSkateSFX = Space.loadSound("6BVhZ7I6jEK7aXVPfPSBTzsl7r3kj4mVKDMEB51JvBc");
var BGM = Space.loadSound("J6HGqSxIWxfsoDdmQX21Qk9FoZGpQVNJSpM6R6LGSwU");
//#endregion "Setup"

//#region "General Game Logic"
//Set values for various objects
resetGame();
var posMarkerPos = posMarker.getPosition();
christmasTree.setPosition(0, 0, 0);
christmasTree.addToPhysics();
posMarker.addMoveOnItemInteraction(playArea, function() {
  posMarker.setOpacity(1);
});
orientationMarker.setOpacity(0);
scoreScreen.setFontSize(1);

//Game Manager
function startGame(tickRate) {
  if (gameOver !== true) {
    tickRate = ((Math.random() * 2) + 1);
    gameManager = Space.scheduleRepeating(function() {
      var selectedSnowman = snowmen[Math.floor(Math.random() * snowmen.length)];
      //Skip throw if this snowman is already busy
      if (!isInArray(selectedSnowman, busySnowMen)) {
        busySnowMen.push(selectedSnowman);
        ballThrow(selectedSnowman, selectedSnowman.getPosition(), orientationMarker.getPosition());
        Project.log("Push");
      }
    }, tickRate);
    activeManagers.push(gameManager);
  }
}

//Movement Manager - Player
function movementManager() {
  //Execute this code every frame
  movementLogic = Space.scheduleRepeating(function() {
    var pCharacterPos = pCharacter.getPosition();
    var markerPos = posMarker.getPosition();
    var markerPosVector = [markerPos.x, markerPos.y, markerPos.z];
    var pCharacterPosVector = [pCharacterPos.x, pCharacterPos.y, pCharacterPos.z];
    var lerpedPos = lerp(pCharacterPosVector, markerPosVector, movementSpeed);

    //Check if character is too close to any colliding object
    for (i = 0; i < colliders.length; i++) {
      if (pCharacter.distanceToItem(colliders[i]) < 1.25) {
        snowBallImpactSFX.play();
        pCharacterHit = true;
      }
    }
    //Give marker Z offset to hover over character for easy selection.
    //Keep orientationMarker (which is invisible) on the ground to keep pCharacter's faceTo() direction even
    posMarker.setPosition(markerPos.x, markerPos.y, 3);
    orientationMarker.setPosition(markerPos.x, markerPos.y, 0);

    //Switch idle/run animation depending on distance to movement marker
    if (pCharacter.distanceToItem(orientationMarker) < 1.5) {
      if (pCharacter.animationState() != "Idle") {
        pCharacter.setAnimationState("Idle");
        pCharacter.playIdleAnimation("Idle");
        iceSkateSFX.stop();
        posMarker.setOpacity(1);
      }
    } else {
      if (pCharacter.animationState() != "Fast Skating") {
        pCharacter.setAnimationState("Fast Skating");
        pCharacter.playIdleAnimation("Fast Skating");
        iceSkateSFX.play(true);
        posMarker.setOpacity(0);
      }
    }

    //Determine if movement for pCharacter is necessary
    if (pCharacter.distanceToItem(orientationMarker) > 0.1) {
      pCharacter.setPosition(lerpedPos[0], lerpedPos[1], 0);
      pCharacter.faceTo(orientationMarker);
    }

    //Set ChristmasTree Opacity when pCharacter is close to it
    if (pCharacter.distanceToItem(christmasTree) < 4.5) {
      christmasTree.setOpacity(0.6);
    } else {
      christmasTree.setOpacity(1);
    }

    //Rotate star Collectables (to make them more appealing to collect!)
    if (stars.length > 0) {
      for (i = 0; i < stars.length; i++) {
        var v = {
          // initial point
          xPos: stars[i].getPosition().x,
          yPos: stars[i].getPosition().y,
          zPos: stars[i].getPosition().z,
          // terminal point
          xDir: 0,
          yDir: 0,
          zDir: 50
        };
        stars[i].addRotation(v.xPos, v.yPos, v.zPos, v.xDir, v.yDir, v.zDir, 0.1);
      }
    }

    //Update score board accordingly
    scoreScreen.setText("Score: " + score + " !");
    posMarkerPos = posMarker.getPosition();

    if (pCharacterHit) {
      damagePlayer();
    }
  }, 0);
}

//Snowman Manager
function ballThrow(snowman, origin, target) {
  //Creates a snowBall at the Snowman's position, make it a physics object and throw it to the positionMarker's location
  var snowBall = Space.createItem('Sphere', origin.x, origin.y, 1.5);
  var bouncedUp = false;
  var velocityModifier = 0.25;
  var velocityUpMod = 3;

  snowBall.addToPhysics();
  snowman.faceTo(orientationMarker);

  //Bounces Snowman Up/Down, throw snowball
  var bounceUpDown = Space.scheduleRepeating(function() {
    if (bouncedUp === true) {
      bounce(snowman, 0, 0.25);
      if (snowman.getPosition().z <= 0.05) {
        bouncedUp = false;
        busySnowMen.pop();
        bounceUpDown.dispose();
      }
    } else {
      bounce(snowman, 1.5, 0.3);
      if (snowman.getPosition().z >= 1.35) {
        bouncedUp = true;

        //Throw snowball at current marker position (not character!)
        snowBallThrowSFX.play();
        var pos = snowBall.getPhysicsPosition();
        var direction = {
          x: (target.x - pos.x) * (snowBall.distanceToItem(posMarker) * velocityModifier),
          y: (target.y - pos.y) * (snowBall.distanceToItem(posMarker) * velocityModifier),
          z: (target.z - pos.z) * (snowBall.distanceToItem(posMarker) * velocityModifier)
        };

        var x = normalize(direction, 1).x * snowBall.distanceToItem(posMarker) / (velocityUpMod * 0.6);
        var y = normalize(direction, 1).y * snowBall.distanceToItem(posMarker) / (velocityUpMod * 0.6);
        snowBall.setVelocity(x, y, velocityUpMod);
        snowBallCollisionCheck(snowBall);
      }
    }
  }, 0);
}

//Checks if the snowman's snowball collides with the player
function snowBallCollisionCheck(snowBall) {
  var collCheck = Space.scheduleRepeating(function() {
    if (snowBall.distanceToPoint(pCharacter.getPosition().x, pCharacter.getPosition().y, pCharacter.getPosition().z + 2) < 0.5) {
      snowBallImpactSFX.play();
      damagePlayer();
      snowBall.deleteFromSpace();
      collCheck.dispose();
    }
  }, 0);
  Space.schedule(function() {
    if (snowBall !== undefined) {
      collCheck.dispose();
      snowBall.deleteFromSpace();
      if (collCheck !== "undefined") {
        collCheck.dispose();
      }
    }
  }, 2.5);
}

function damagePlayer() {
  //Stop all managers and other update loops
  if (movementLogic !== undefined) {
    movementLogic.dispose();
  }
  for (i = 0; i < activeManagers.length; i++) {
    if (activeManagers[i] !== undefined) {
      activeManagers[i].dispose();
    }
  }

  //Play the falling animation of pCharacter
  posMarker.setOpacity(0);
  pCharacter.setAnimationState("Falling");
  pCharacter.playIdleAnimationWithVelocity("Falling", 2);
  iceSkateSFX.stop();

  pCharacter.say("Ouch!");
  if (!gameOver) {
    Space.schedule(showScoreScreen, 2);
  }
  gameOver = true;
}
//#endregion "General Game Logic"

//#region "Score Logic"
//Score logic
function spawnstars() {
  //Always have five stars in the game to collect. Add it to the array of existing stars.
  //If collected by the player, bounce it upwards, remove it from list and destroy the object.
  for (; stars.length < 5;) {
    var star = Space.createItem("LP_Star", generateRandomSpawnPos(7).x, generateRandomSpawnPos(7).y, -1);
    stars.push(star);
    tweenstarUp(star);
    if (starCollCheck(star)) {
      stars.pop();
      star.deleteFromSpace();
    }
  }
}

//If a star is created too close to a snowman or the christmas tree, delete it
//and remove it from the game without adding to the player score
function starCollCheck(star) {
  flag = false;
  for (i = 0; i < colliders.length; i++) {
    if (star.distanceToItem(colliders[i]) < 3) {
      flag = true;
    }
  }
  return flag;
}

//Smoothly emerges the star from the ground when it is created
function tweenstarUp(star) {
  var bouncestar = Space.scheduleRepeating(function() {
    bounce(star, 0.30, 0.1);
    if (star.getPosition().z >= 0.25) {
      bouncestar.dispose();
    }
  }, 0);
}

//Checks the distance of every star to pCharacter.
//If close enough, play a sound and start the collectstar function
function starDistanceCheck() {
  collectionCheck = Space.scheduleRepeating(function() {
    for (i = 0; i < stars.length; i++) {
      if (pCharacter.distanceToItem(stars[i]) < 1) {
        collectstar(stars[i], i);
        starSFX.setVolume(0.1);
        starSFX.play();
      }
    }
  }, 0);
}

//bounce the star up when it is collected, add to the player score and create new stars
function collectstar(star, index) {
  stars.splice(index, 1);
  var bouncestar = Space.scheduleRepeating(function() {
    bounce(star, 3, 0.1);
    if (star.getPosition().z >= 2.90) {
      star.deleteFromSpace();
      bouncestar.dispose();
      score++;
      spawnstars();
    }
  }, 0);
}

//Displays the game over / score screen
function showScoreScreen() {
  var description = "You collected " + score + " Stars! Click below to try again!";
  christmasTree.showInfoPanel("Game Over", "tN6PG64rEhvtee7rYuhoixAFQqPoLt8oxZVEWV4qZoJ", description, false, function() {
    resetGame();
  });
}
//#endregion "Score Logic"

//#region "Helper Functions"
//Lerping (smooth position from point A to B. Used when a positin is calculated every new frame)
function lerp(a, b, t) {
  var len = a.length;
  if (b.length != len) return;

  var x = [];
  for (var i = 0; i < len; i++)
    x.push(a[i] + t * (b[i] - a[i]));
  return x;
}

//Bounce helper. Uses lerping
function bounce(object, target, speed) {
  var objectPos = object.getPosition();
  var objectPosVector = [objectPos.x, objectPos.y, objectPos.z];
  var targetDirVector = [objectPos.x, objectPos.y, target];
  var lerpedBounce = lerp(objectPosVector, targetDirVector, speed);
  object.setPosition(lerpedBounce[0], lerpedBounce[1], lerpedBounce[2]);
}

//Normalize. See http://mathworld.wolfram.com/NormalizedVector.html
function normalize(point, scale) {
  var norm = Math.sqrt(point.x * point.x + point.y * point.y);
  if (norm != 0) { // as3 return 0,0 for a point of zero length
    point.x = scale * point.x / norm;
    point.y = scale * point.y / norm;
    return {x: point.x, y: point.y};
  }
}

//Check for a value in an array
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

//Reset all game related parameters to their default value
function resetGame() {
  pCharacterHit = false;
  score = 0;
  posMarker.setOpacity(1);
  posMarker.setPosition(1, 5, 4);
  posMarkerPos = posMarker.getPosition();
  pCharacter.setPosition(1, 5, 0);
  pCharacter.say('');

  if (pCharacter.animationState() != "Idle") {
    pCharacter.setAnimationState("Idle");
    pCharacter.playIdleAnimation("Idle");
  }
  if (movementLogic !== undefined) {
    movementLogic.dispose();
  }
  for (i = 0; i < activeManagers.length; i++) {
    if (activeManagers[i] !== undefined) {
      activeManagers[i].dispose();
    }
  }
  for (i = 0; i < stars.length; i++) {
    stars[i].deleteFromSpace();
  }

  activeManagers = [];
  stars = [];
  posMarkerPos.x = posMarker.getPosition().x;

  var startCheck = Space.scheduleRepeating(function() {
    if (posMarkerPos.x > posMarker.getPosition().x) {
      movementManager();
      gameOver = false;
      Space.schedule(startGame, 10);
      Space.schedule(startGame, 30);
      Space.schedule(startGame, 60);
      Space.schedule(startGame, 90);
      spawnstars();
      starDistanceCheck();
      posMarker.say('');
      startCheck.dispose();
    }
  }, 0);
}

//Play background music. Loop it indefinetely
playBGM();
function playBGM() {
  BGM.setVolume(0.1);
  BGM.play(true);
}

//Creates random coordinates on the x and y axis
function generateRandomSpawnPos(radius) {
  var a = Math.random() * (2 * Math.PI);
  var cx = 0;
  var cy = 0;

  var xPos = cx + radius * Math.cos(a);
  var yPos = cy + radius * Math.sin(a);

  return {
    x: xPos,
    y: yPos
  };
}
//#endregion "Helper Functions"