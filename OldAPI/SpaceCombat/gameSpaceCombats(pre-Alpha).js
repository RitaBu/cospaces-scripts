var BULLET_SPEED = 60;
var MAN_OVERHEAT = 4;
var BULLET_DEAD_DISTANCE = 120;
var GUN_OVERHEAT = 0.4;
var DISTANCE_OF_FIRE = 90;
var COLOR = "FF00FF";
var ENEMY_SPEED = 6;
var TURRET_HIGHT = 5;
var DEFAULT_SPAWN_DISTANCE = 120;
var lvlArr = [];
var GAME_START_TIME = 1;
var MAX_EXP_SCALE = 4;
var SCALE_STEP = 0.2;
var MUSIC_LVL = 0.5;
var MAX_POINTS = 2;
var MAX_BOSS = 60;
var NUMBER_OF_PLAYERS = 1;
var shots = 0;
var successful_shots = 0;
var hangar_modelname = "%%fa1c3af72a4c15fbbaebffbebdd232b2fb5336901206bf460fdc5ddadd3d97fe";
var boss_modelname = "%%fa1c3af72a4c15fbbaebffbebdd232b2fb5336901206bf460fdc5ddadd3d97fe:B";
var boss_distance = DEFAULT_SPAWN_DISTANCE;
var hangarHp = 20;

//utils
//---------------------------------------------------

function parseBool(str) {
  return str == "true";
}

function clear(firstToClear) {
  var object = DX.items();
  for (var i = firstToClear; i < object.length; i++) {
    object[i].remove();
  }
}

function sqrtOfSumSqr(point) {
  return Math.sqrt(point[0] * point[0] + point[1] * point[1] + point[2] * point[2]);
}

function playWithVolume(track, volume) {
  // track.stop();
  track.setVolume(volume * MUSIC_LVL);
  track.play();
}

function distance(point, begin, direction) {
  var m1 = [0, 0, 0];
  m1[0] = begin[0] - direction[0];
  m1[1] = begin[1] - direction[1];
  m1[2] = begin[2] - direction[2];
  var vecOfDot = [direction[0] - point[0], direction[1] - point[1], direction[2] - point[2]];
  var product = [vecOfDot[1] * m1[2] - vecOfDot[2] * m1[1], -vecOfDot[0] * m1[2] + vecOfDot[2] * m1[0], vecOfDot[0] * m1[1] - vecOfDot[1] * m1[0]];
  return (sqrtOfSumSqr(product) / sqrtOfSumSqr(m1));
}

function pointDistance(point1, point2) {
  return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
}

function norm(vec) {
  var n = [];
  var len = sqrtOfSumSqr(vec);
  n[0] = vec[0] / len;
  n[1] = vec[1] / len;
  n[2] = vec[2] / len;
  return n;
}

function vecToQuat(vec, angl) {
  var quat = [];
  var n = norm(vec);
  quat[3] = Math.cos(angl / 2);
  quat[0] = n[0] * Math.sin(angl / 2);
  quat[1] = n[1] * Math.sin(angl / 2);
  quat[2] = n[2] * Math.sin(angl / 2);
  return quat;
}


var createEn = function(enm, slot, bending) {
  var en = enm;

  var slt = slot;
  var bend = bending;
  return function() {
    createEnemy(en, slt, bend);
  }
};

function addOneEnemyLine(enem, position, bending, startDelay, delay, count) {
  lvlArr.push(enem, position, bending, startDelay);
  for (var i = 0; i < count - 1; i++) {
    lvlArr.push(delay);
  }
}

//the main game preparation function
function formLvlArray() {
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [0], -7, GAME_START_TIME, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [2], 7, 4, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [1], 0, 4, 2, 4);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [3], 10, 4, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [2], -10, 4, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [3], 3, 2, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [0], 3, 1, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [1], 3, 2, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [2], 4, 2, 1, 4);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [1], -7, 2, 1, 4);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [2], 0, 2, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [0], 1, 2, 2, 3);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [1], 3, 2, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [2], 4, 2, 1, 4);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [3], -7, 2, 1, 4);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [1], 0, 2, 2, 5);
  addOneEnemyLine(["SC_SmallShip", 1 * NUMBER_OF_PLAYERS], [0], 1, 2, 2, 3);
}

function fromArrayToEvents(arr, eventor) {
  var enm = [];
  var position = [];
  var blending = 0;
  var func;
  while (arr.length > 0) {
    var smth = arr.shift();
    if (smth instanceof Array) {
      enm = [];
      enm.additional = smth;
      position = arr.shift();
      if (!position instanceof Array) {
        DX.log("can't find position for " + enm);
      }
      blending = arr.shift();
      func = createEn(enm, position, blending);
    } else {
      if (func != null) {
        eventor.appendEvent(func, smth);
      }
    }
  }
}

//services
//----------------------------------------------------
var ScaledCloud = function(cloud, max, step, color) {
  this.scale = 1;
  this.obj = cloud;
  if (this.scale != 1) {
    this.obj.setScale(this.scale);
  }
  this.max = max;
  this.step = step;
  this.color = color;
};

ScaledCloud.prototype.addScale = function() {
  if (this.scale >= this.max) {
    if (this.obj != undefined) {
      this.obj.remove();
    }
    if (derbises.length > 0 && derbises[0] === this) {
      derbises.shift();
    }
  } else {
    this.scale += this.step;
    this.obj.setScale(this.scale);
    this.obj.setColor(255, Math.floor(230 * (1 - this.scale / this.max)), this.color);
    var pos = this.obj.position();
    this.obj.teleport(pos[0], pos[1], pos[2] - this.step / 5);
  }
};

var Eventor = function() {
  this.events = [];
  this.time = 0;
};

Eventor.prototype.plusDt = function(dt) {
  this.time += dt;
  while (this.events.length > 0 && this.events[0].time < this.time) {
    var event = this.events.shift();
    event.start(event.time);
  }
};


Eventor.prototype.addEvent = function(event, time, needSort) {
  var ev = [];
  ev.start = function(time) {
    event();
  };
  ev.time = this.time + time;
  this.events.push(ev);
  if (needSort) {
    this.events.sort(function(a, b) {
      return a.time - b.time;
    })
  }
};

Eventor.prototype.appendEvent = function(event, time) {
  if (this.events.length != 0) {
    var tim = this.events[this.events.length - 1].time;
    this.addEvent(event, tim - this.time + time, false);
  } else {
    this.addEvent(event, this.time + time, false);
  }
};

var hpService = function(object, hp) {
  this.item = object;
  object.setProperty("hp2", 0);
  object.setProperty("hp1", hp);
};

hpService.prototype.minusHp = function(x, player) {
  var hp1 = parseInt(this.item.getProperty("hp1"));
  var hp2 = parseInt(this.item.getProperty("hp2"));
  var max = 4;//parseInt(this.item.getProperty("maxHp"));
  if (player == 1) {
    hp1 -= x;
    this.item.setProperty("hp1", hp1);
  } else {
    hp2 -= x;
    this.item.setProperty("hp2", hp2);
  }
  if (hp1 + hp2 <= 0) {
    playWithVolume(explosion, 0.5 * (DEFAULT_SPAWN_DISTANCE - pointDistance(this.item.position(), [0, 0, 0])) / DEFAULT_SPAWN_DISTANCE);
    var pos = this.item.position();
    if (this.item.getProperty("hangar1") != 1) {
      var cloud = DX.item(DX.createItem("Cloud", pos[0], pos[1], pos[2] - 0.2));
      cloud.setColor(255, 200, 0);
      var sCloud = new ScaledCloud(cloud, MAX_EXP_SCALE, SCALE_STEP, 0);
      derbises.push(sCloud);
    } else {
      var cloud = DX.item(DX.createItem("Cloud", pos[0], pos[1], pos[2] - 0.2));
      cloud.setColor(255, 200, 0);
      var sCloud = new ScaledCloud(cloud, 10, 0.5, 0);
      derbises.push(sCloud);
      var h = parseInt(DX.getProperty("hangars1"));
      h--;
      DX.setProperty("hangars1", h);
    }
    this.item.remove();
  } else {
    this.item.setColor(255, parseInt(255 * ((hp1 + hp2) / max)), 0);
  }
};

hpService.prototype.getHp = function() {
  var hp1 = parseInt(this.item.getProperty("hp1"));
  var hp2 = parseInt(this.item.getProperty("hp2"));
  return hp1 + hp2;
};

function addHpService(object, defHP) {
  object.hp = new hpService(object, defHP);
}


var Overheat = function(base, max, callback, additional) {
  this.current = base;
  this.max = max;
  this.callback = callback;
  this.additional = additional;
};

Overheat.prototype.plus = function(dt) {
  this.current += dt;
  if (this.max < this.current) {
    this.current -= this.max;
    this.callback(this);
  }
};

function fire(gun) {
  if (cmd == 11 || !isCmdWasUsed) {
    isCmdWasUsed = false;
    laserSounds.play(0.2);
    shots++;
    turret.shot(function(obj) {
      if (obj != undefined) {
        successful_shots++;
        var hp1 = parseInt(obj.getProperty("hp1"));
        var hp2 = parseInt(obj.getProperty("hp2"));
        playWithVolume(laserHit, 0.5 * (DEFAULT_SPAWN_DISTANCE - pointDistance(obj.position(), [0, 0, 0])) / DEFAULT_SPAWN_DISTANCE);
        addHpService(obj, hp1 + hp2);
        obj.hp.minusHp(1, player);
      }
    });

  } else {
    gun.current = gun.max;
  }
}

function createEnemy(enm, slot, bending) {
  var t = Math.floor(Math.random() * 9);
  var position = hangars[slot].getSlotTransform("_Ship0" + t).position();
  // DX.log("diff|" + (hangars[slot].getSlotTransform("_Ship03").position()[2] - hangars[slot].position()[2]));
  // position[2] -= (hangars[slot].getSlotTransform("_Ship03").position()[2] - hangars[slot].position()[2]);
  var q = vecToQuat([0, 0, 1], Math.PI);
  var str = DX.createItem(enm.additional[0], position[0], boss_distance, position[2]);
  var p = DX.item(str);
  p.setColor(128, 200, 255);
  p.teleportRotate(position[0], boss_distance, position[2], q[0], q[1], q[2], q[3]);
  //p.teleportRotate(dt % 10 - 5, 20, (dt + 5 ) % 5 + 2, q[0], q[1], q[2], q[3]);
  addHpService(p, parseInt(enm.additional[1]));
  // p.setProperty("maxHp",parseInt(enm.additional[1]) );
  p.startBezier3DPath();
  for (var i = 1; i < MAX_POINTS; i++) {
    var coef = (i % 2) * 2 - 1;
    p.addToBezier3DPath(bending * coef, (i * boss_distance / MAX_POINTS), i * (position[2] - TURRET_HIGHT) / MAX_POINTS, i * position[0] / MAX_POINTS, i * boss_distance / MAX_POINTS, TURRET_HIGHT);
  }
  p.addToBezier3DPath(bending, 0, (position[2] - TURRET_HIGHT + 4) / 2, 2.5, 0, TURRET_HIGHT);
  p.finishBezier3DPath(ENEMY_SPEED);

}


function addDifficulty() {
  MAN_OVERHEAT -= 0.25;
  ENEMY_SPEED += 0.4;
  MAX_POINTS++;
  if (MAX_POINTS == 5) {
    MAX_POINTS = 2;
  }
}


function enableTurret(realDt) {
  var camera = DX.camera().cameraDirection();
  var pos1 = DX.camera().position();
  turret.setTarget(pos1[0] + camera[0] * DISTANCE_OF_FIRE, pos1[1] + camera[1] * DISTANCE_OF_FIRE, pos1[2] + camera[2] * DISTANCE_OF_FIRE);
  gun.plus(realDt);
}
//Music part
//----------------------------------------------------

var laserSounds = [];
var ls = DX.resource("d6fdced1c6fc4cdceb8d7ccff76f49451eb20b854ed2bd4fbd646ddbae9e424c");
laserSounds.push(ls);
ls = DX.resource("c014e8d182180cd6b59d49f4f57a0112e00568039271c0e6c3854d31f45a5a2a");
laserSounds.push(ls);
ls = DX.resource("d6fdced1c6fc4cdceb8d7ccff76f49451eb20b854ed2bd4fbd646ddbae9e424c");
laserSounds.push(ls);
laserSounds.play = function(volume) {
  var x = Math.floor(Math.random() * 3);
  laserSounds[x].setVolume(volume * MUSIC_LVL);
  laserSounds[x].play();
};
var explosion = DX.resource("372616d4c4071cd28ff50b399c8667056dc12d5146e66413cd7ee8210e7349b3");
var background = DX.resource("226fed584e7544cf907ba983593bb1993a1f04e31d91b43d890fd2505daeb8c3");
var laserHit = DX.resource("2589ced263581e91c1a408a00ea1285d3a17ad9e868405cbfbc8702703b6bd77");
var engine = DX.resource("861224258e102747f82f603ddef82659d92170e4ee11089bbc3bca3edf63ffb3");
var neog = DX.resource("85b7349b44baf89db09b63b19a3ef6af840fc51fd998b204bb88966797e47a95");

//initialize
//----------------------------------------------------

var boss;
var hangars = [];
DX.setControlEnabled(false);
var numberOfPlayers = 1;
var player = 0;
var temp = DX.getProperty("Server");
if (temp === null || temp == 2) {
  player = 1;
  DX.setProperty("Server", 1);
  DX.setProperty("GI", 1);
  COLOR = "FF0000";
} else {
  DX.log(temp);
  player = 2;
  numberOfPlayers = 2;
  DX.setProperty("Server", 2);
  DX.setProperty("GI", 2);
  COLOR = "FFFF00";
}


var eventor = new Eventor();
var introEventor = new Eventor();

eventor.addEvent(function() {
  playWithVolume(engine, 0.2);
}, GAME_START_TIME, true);

if (player == 1) {
  clear(0);
  formLvlArray();
  fromArrayToEvents(lvlArr, eventor);
  DX.setMood(0);
  DX.setTerrain("");
  var planet = DX.item(DX.createItem("Planet", 0, -5, TURRET_HIGHT - 5.5));
  planet.setScale(24);
  DX.setProperty("hangars1", 4);
  boss = DX.item(DX.createItem(boss_modelname, 0, -DEFAULT_SPAWN_DISTANCE, TURRET_HIGHT));
}

var derbises = [];

var gun = new Overheat(0, GUN_OVERHEAT, fire, "");
var dontLoose = true;
var cmd = 0;
var isCmdWasUsed = false;
DX.setProperty("dontLoose", true);

var str2 = DX.createItem("SC_Turret", (1.5 - player) * 4, 0, 0);
var str1 = DX.createPerson("MASCULINE", "ADULT", (1.5 - player) * 4, 0);
var turret = DX.item(str2);
turret.teleport((1.5 - player) * 4, 0, TURRET_HIGHT);
var manHero = DX.item(str1);
var beginTime = 0;
var prevDt = 0;

manHero.teleport((1.5 - player) * 4, 1, TURRET_HIGHT);

DX.command(function(cmd1) {
  DX.log("cmd" + cmd1);
  cmd = cmd1;
  if (cmd == 11) {
    isCmdWasUsed = false;
  }
});

turret.setup(BULLET_SPEED, 2, BULLET_DEAD_DISTANCE, COLOR, "hp1");

var initialize = false;
DX.focusOn(str1, true);
DX.camera().setCameraVerticalLimits(-Math.PI / 3, Math.PI / 3);
DX.setHeartbeatInterval(0);
DX.camera().lockMousePointer(true);
DX.camera().enableAim(true);
DX.camera().setAimColor(COLOR);

function intro() {

  var teleport_sound = DX.resource("c0c7d3b65578f9c631762f5505ae88a3666d6535e1dbfe0516f1dc96edda9efb");
  playWithVolume(teleport_sound, 1);
  background.setVolume(0.75 * MUSIC_LVL);
  background.play(true);
  if (player == 1) {
    introEventor.addEvent(function() {
      var cloud = DX.item(DX.createItem("Cloud", 0, DEFAULT_SPAWN_DISTANCE, TURRET_HIGHT));
      var scaled_step = 2;
      var duration = 2.5;
      var final_scale = (1 + scaled_step * duration * 10);
      var telep = new ScaledCloud(cloud, final_scale, scaled_step, 255);
      for (var i = 2; i < final_scale / scaled_step + scaled_step * 2; i++) {
        introEventor.addEvent(telep.addScale.bind(telep), i * 0.1, true);
      }
      introEventor.addEvent(function() {
        boss.teleport(0, DEFAULT_SPAWN_DISTANCE, TURRET_HIGHT);
        boss.setColor(133, 133, 133);
        for (var i = 0; i < 4; i++) {

          var pos = boss.getSlotTransform("Hangar0" + i).position();
          hangars[i] = DX.item(DX.createItem(hangar_modelname, pos[0], pos[1], pos[2]));
          hangars[i].setColor(128, 200, 255);
          var q = vecToQuat([0, 0, 1], Math.PI);
          hangars[i].teleportRotate(pos[0], pos[1], pos[2], q[0], q[1], q[2], q[3]);
          hangars[i].startBezier3DPath();
          hangars[i].addToBezier3DPath(pos[0], MAX_BOSS + (pos[1] - MAX_BOSS) / 2, pos[2], pos[0], MAX_BOSS, pos[2]);
          hangars[i].finishBezier3DPath(0.5);
          //hangars[i].moveTo(pos[0], MAX_BOSS);
        }
        initialize = true;
        //boss.moveToItem(planet, (DEFAULT_SPAWN_DISTANCE - MAX_BOSS + 3));
        boss.startBezier3DPath();
        boss.addToBezier3DPath(0, MAX_BOSS + (MAX_BOSS) / 2, TURRET_HIGHT, 0, MAX_BOSS, TURRET_HIGHT);
        boss.finishBezier3DPath(0.5);
        eventor.addEvent(function() {
          for (var i = 0; i < 4; i++) {
            addHpService(hangars[i], hangarHp);
            hangars[i].setProperty("hangar1", 1)
          }
        }, 120, true); //
      }, 2.7, true);
    }, 2, true);
  } else {
    introEventor.addEvent(function() {
      initialize = true
    }, 5, false);
  }
}

//game
//------------------------------------------------------------------------
var introAdded = false;
DX.heartbeat(
    function(dt) {
      numberOfPlayers = parseInt(DX.getProperty("GI"));
      if (beginTime === 0) {
        beginTime = dt;
        prevDt = dt;
      }
      var realDt = dt - prevDt;
      prevDt = dt;
      if (!initialize) {
        var init = (DX.getProperty("Server") == NUMBER_OF_PLAYERS);
        if (init) {
          if (!introAdded) {
            playWithVolume(neog, 1);
            introEventor.addEvent(intro, 10, true);
            introAdded = true;
          }
          introEventor.plusDt(realDt);
        }
      } else {
        dontLoose = parseBool(DX.getProperty("dontLoose"));
        if (dontLoose) {
          //setting target
          enableTurret(realDt);
          eventor.plusDt(realDt);
          //loose condition
          var mans = DX.items();
          var min = DEFAULT_SPAWN_DISTANCE;
          for (var i = numberOfPlayers * 2; i < mans.length; i++) {
            var man = mans[i];
            if (man.getProperty("hp1") != undefined) {
              var pos = man.position();
              var dist = pointDistance(pos, manHero.position());
              min = Math.min(dist, min);
              if (pos[1] <= 0.4) {
                man.remove();
                dontLoose = false;
                clear(0);
                var st = DX.createItem("CUBE", 0, 0, TURRET_HIGHT);
                DX.item(st).say(dt - beginTime);
                DX.setProperty("dontLoose", false);
              }
            }
          }
          if (player == 1) {
            boss_distance = pointDistance(boss.position(), [0, 0, 0]);
            if (boss_distance < MAX_BOSS) {
              var q = vecToQuat([0, 0, 1], Math.PI);
              boss.teleportRotate(0, MAX_BOSS, TURRET_HIGHT, q[0], q[1], q[2], q[3]);
            }
          }
          playWithVolume(engine, (DEFAULT_SPAWN_DISTANCE - min) / DEFAULT_SPAWN_DISTANCE);
          //explosions control
          if (derbises.length > 0) {
            for (var i = 0; i < derbises.length; i++) {
              if (derbises[i] != undefined) {
                eventor.addEvent(derbises[i].addScale.bind(derbises[i]), 0.1 + i / 100, true);
              }
            }
          }
          if (parseInt(DX.getProperty("hangars1")) == 0) {
            DX.finishWithImage("8f61e6ed57e8db3ba9dfc9e1c3f9eb0c5831d4d50ca66d4c61f44855e7be86a3");
            // DX.finish();
          }
        } else {
          clear(1);
          DX.camera().setCameraVerticalLimits(-Math.PI / 2, 0);
          DX.camera().lockMousePointer(false);
          DX.camera().enableAim(false);
          DX.setProperty("dontLoose", false);
          DX.setProperty("Server", null);
          DX.finishWithImage("75332bf3558708c46130fe20fe632fb8561f3abdbacfd161e271a79faf029419");

        }
      }
    });