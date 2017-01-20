//#region "Setup"
//Physics Settings
Space.setPhysicsEnabled(true, true);
Space.setPhysicsGravity(3);
//Set vars
//Used objects in Scene
var mainCamera = Space.getItem("uNK0GQFFTd");
var player = Space.getItem("5xMlA9TjGD");
var pCharacter = Space.getItem("A88f7ggjYH");
var pCharacterPosLast = pCharacter.getPosition();
var posMarker = Space.getItem("qilvnkYE77");
var orientationMarker = Space.getItem("P2jfYftnOG");
var playArea = Space.getItem("mox5lyN0vo");
var playAreaCollider = Space.getItem("jVtlHfIrnp");
var christmasTree = Space.getItem("kfDr4j2uXI");
var scoreScreen = Space.getItem("u2EynOkEJH");
var snowman1 = Space.getItem("vZ7xVyaXE1");
var snowman2 = Space.getItem("k5Yi8KjL4w");
var snowman3 = Space.getItem("yf0zcB33ac");
var snowman4 = Space.getItem("n4KAmCMgL5");
var snowmen = [snowman1, snowman2, snowman3, snowman4];
var colliders = [snowman1, snowman2, snowman3, snowman4, christmasTree];
var coins = [];
//Metrics
var movementSpeed = 0.025;
var score = 0;
var pCharacterHit = false;
var gameManager;
var movementLogic;
var activeManagers = [];
var collectionCheck;
var gameOver = false;
//Pictures/Sound
var imgId = '67d45f92ab27de23acb9e4ae0e8b2536a96296b24b91a5a7990a05b7a173783d';
var snowBallThrowSFX = Space.loadSound("x2ORHI81dty7NtMvMwwAWK1zTjiLKe9v0LvLAqCCaO");
var snowBallImpactSFX = Space.loadSound("samJ7uxL10pCFvaQRoC7U7SFJ4qlrdsJTSddTrvCBX7");
var coinSFX = Space.loadSound("6e93xmAKOgu7cAuSkUzPwPfoU0yNErF7l9zQoGxy61d");
var iceSkateSFX = Space.loadSound("6BVhZ7I6jEK7aXVPfPSBTzsl7r3kj4mVKDMEB51JvBc");
var BGM = Space.loadSound("J6HGqSxIWxfsoDdmQX21Qk9FoZGpQVNJSpM6R6LGSwU");
//#endregion "Setup"
//#region "General Game Logic"

//Initial Game Parameters
resetGame();
var posMarkerPos = posMarker.getPosition();
var pCharacterPos = pCharacter.getPosition();
christmasTree.setPosition(0, 0, 0);
christmasTree.addToPhysics();
christmasTree.positionConstraint(0, 0, 0);
posMarker.addMoveOnItemInteraction(playArea, function() {
  posMarker.setOpacity(1);
});
orientationMarker.setOpacity(0);
scoreScreen.setFontSize(1);

//Game Manager
function startGame() {
  var tickRate = 2;
  gameManager = Space.scheduleRepeating(function() {
    var selectedSnowman = snowmen[Math.floor(Math.random() * snowmen.length)]
    var snowmanPos = selectedSnowman.getPosition();
    ballThrow(selectedSnowman, snowmanPos, orientationMarker.getPosition());
    if (tickRate >= 0.3) {
      tickRate -= 0.1;
    }
  }, tickRate);
  activeManagers.push(gameManager);
}

//Movement Manager - Player
function movementManager() {
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
    if (pCharacter.distanceToItem(christmasTree) < 6.5) {
      christmasTree.setOpacity(0.7);
    } else {
      christmasTree.setOpacity(1);
    }

    //Rotate Coin Collectables
    if (coins.length > 0) {
      for (i = 0; i < coins.length; i++) {
        var v = {
          // initial point
          xPos: coins[i].getPosition().x,
          yPos: coins[i].getPosition().y,
          zPos: coins[i].getPosition().z,
          // terminal point
          xDir: 0,
          yDir: 0,
          zDir: 50
        };
        coins[i].addRotation(v.xPos, v.yPos, v.zPos, v.xDir, v.yDir, v.zDir, 0.1);
      }
    }

    scoreScreen.setText("Score: " + score + " !");
    posMarkerPos = posMarker.getPosition();

    if (pCharacterHit) {
      damagePlayer();
    }
  }, 0);
}

//Snowman Manager
function ballThrow(snowman, origin, target) {
  var snowBall = Space.createItem('Sphere', origin.x, origin.y, 1.5);
  var snowmanPos = snowman.getPosition();
  var bouncedUp = false;
  //var velocityModifier = 0.25;
  //var velocityUpMod = 3;

  //snowBall.addToPhysics();
  snowman.faceTo(orientationMarker);

  //Bounces Snowman Up/Down, throw snowball
  var bounceUpDown = Space.scheduleRepeating(function() {
    if (bouncedUp === true) {
      bounce(snowman, 0, 0.25);
      if (snowman.getPosition().z <= 0.05) {
        bouncedUp = false;
        bounceUpDown.dispose();
      }
    } else {
      bounce(snowman, 1.5, 0.3);
      if (snowman.getPosition().z >= 1.35) {
        bouncedUp = true;

        //Throw snowball at current marker position (not character!)
        snowBallThrowSFX.play();
        //target position minus origin pos
        //== direction * strength
        //++Z
        //applyVelocity
        //applyImpulse!
        /*
         var pos = snowBall.getPhysicsPosition();
         var direction = {
         x: (target.x - pos.x)*(snowBall.distanceToItem(posMarker)*velocityModifier),
         y: (target.y - pos.y)*(snowBall.distanceToItem(posMarker)*velocityModifier),
         z: (target.z - pos.z)*(snowBall.distanceToItem(posMarker)*velocityModifier)
         };

         var x = normalize(direction,1).x * snowBall.distanceToItem(posMarker) / (velocityUpMod*0.6);
         var y = normalize(direction,1).y * snowBall.distanceToItem(posMarker) / (velocityUpMod*0.6);
         snowBall.setVelocity(x,y,velocityUpMod);
         */

        snowBall.throwTo(target.x, target.y, 2, 3, function() {
          var pos = snowBall.getPosition();
          var velocityModifier = 0.5;
          var velocity = [(pos.x - lastPos.x) * velocityModifier, (pos.y - lastPos.y) * velocityModifier, (pos.z - lastPos.z) * velocityModifier * (-4)];

          //Check if snowBall is close enough to pCharacter to cause a hit
          if (snowBall.distanceToItem(pCharacter) < 2.35) {
            damagePlayer();
            snowBall.deleteFromSpace();
            snowBallImpactSFX.play();
          } else {
            //Otherwise enable physics on Snowball and let it roll out
            Project.log((pos.z - lastPos.z) * velocityModifier * (-4));
            snowBall.addToPhysics();
            snowBall.setPhysicsPosition(pos.x, pos.y, pos.z);
            snowBall.setVelocity(velocity[0], velocity[1], velocity[2]);
          }
          //Destroy snowBall after delay
          var destroyBall = Space.schedule(function() {
            if (snowBall !== undefined) {
              snowBall.deleteFromSpace();
            }
          }, 2.5);
        });

      }
    }
    if (snowBall !== null) {
      var lastPos = snowBall.getPosition();
    }
  }, 0);
}
//#endregion "General Game Logic"

//#region "Score Logic"
//Score logic
function spawnCoins() {
  for (; coins.length < 5;) {
    var coin = Space.createItem("LP_Star", generateRandomSpawnPos(7).x, generateRandomSpawnPos(7).y, -1);
    coins.push(coin);
    tweenCoinUp(coin);
    if (coinCollCheck(coin)) {
      coins.pop()
      coin.deleteFromSpace();
    }
  }
}

function coinCollCheck(coin) {
  flag = false;
  for (i = 0; i < colliders.length; i++) {
    if (coin.distanceToItem(colliders[i]) < 3) {
      flag = true;
    }
  }
  return flag;
}

function tweenCoinUp(coin) {
  var bounceCoin = Space.scheduleRepeating(function() {
    bounce(coin, 0.30, 0.1);
    if (coin.getPosition().z >= 0.25) {
      bounceCoin.dispose();
    }
  }, 0);
}

function coinDistanceCheck() {
  collectionCheck = Space.scheduleRepeating(function() {
    for (i = 0; i < coins.length; i++) {
      if (pCharacter.distanceToItem(coins[i]) < 1) {
        collectCoin(coins[i], i);
        coinSFX.setVolume(0.1);
        coinSFX.play();
      }
    }
  }, 0);
}

function collectCoin(coin, index) {
  coins.splice(index, 1);
  var bounceCoin = Space.scheduleRepeating(function() {
    bounce(coin, 3, 0.1);
    if (coin.getPosition().z >= 2.90) {
      coin.deleteFromSpace();
      bounceCoin.dispose();
      score++;
      spawnCoins();
    }
  }, 0);
}

function showScoreScreen() {
  var description = "You collected " + score + " Stars! Click below to try again!";
  christmasTree.showInfoPanel("Game Over", "tN6PG64rEhvtee7rYuhoixAFQqPoLt8oxZVEWV4qZoJ", description, false, function() {
    resetGame();
  });
}

function damagePlayer() {
  //Stop movement logic and update loop
  if (movementLogic !== undefined) {
    movementLogic.dispose();
  }
  for (i = 0; i < activeManagers.length; i++) {
    if (activeManagers[i] !== undefined) {
      activeManagers[i].dispose();
    }
  }

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
//#endregion "Score Logic"

//#region "Helper Functions"
//Lerping
function lerp(a, b, t) {
  var len = a.length;
  if (b.length != len) return;

  var x = [];
  for (var i = 0; i < len; i++)
    x.push(a[i] + t * (b[i] - a[i]));
  return x;
}

//delta
function getDeltaPos(pCharacterPos, pCharacterPosLast) {
  return {
    x: (pCharacterPos.x - pCharacterPosLast.x),
    y: (pCharacterPos.y - pCharacterPosLast.y),
    z: (pCharacterPos.z - pCharacterPosLast.z)
  };
};

//Bounce
function bounce(object, target, speed) {
  var objectPos = object.getPosition();
  var objectPosVector = [objectPos.x, objectPos.y, objectPos.z];
  var targetDirVector = [objectPos.x, objectPos.y, target];
  var lerpedBounce = lerp(objectPosVector, targetDirVector, speed);
  object.setPosition(lerpedBounce[0], lerpedBounce[1], lerpedBounce[2]);
}

//Normalize
function normalize(point, scale) {
  var norm = Math.sqrt(point.x * point.x + point.y * point.y);
  if (norm != 0) { // as3 return 0,0 for a point of zero length
    point.x = scale * point.x / norm;
    point.y = scale * point.y / norm;
    return {x: point.x, y: point.y};
  }
}

//Reset parameters to default
function resetGame() {
  gameOver = false;
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
  for (i = 0; i < coins.length; i++) {
    coins[i].deleteFromSpace();
  }

  activeManagers = [];
  coins = [];

  var startCheck = Space.scheduleRepeating(function() {
    if (posMarkerPos.x > posMarker.getPosition().x) {
      movementManager();
      Space.schedule(startGame, 5);
      spawnCoins();
      coinDistanceCheck();
      posMarker.say('');
      startCheck.dispose();
    }
  }, 0);
}

playBGM();
function playBGM() {
  BGM.setVolume(0.1);
  BGM.play(true);
}

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