var money = 0;
var coef = new Object();
coef.sci = 1;
coef.bat = 1;
coef.inc = 1;
coef.citInc = 1.03;
var DEF_COEF = 1.3;
var playerCoef = 0;

var next = 0;

var lasthp1 = 0;
var lasthp2 = 0;

var myUnits = [];
var gamePhase;

var modeUnit = function () {
  this.mode = "attack";
  this.obj = DX.item(DX.createItem("Cube", 0, 16 * playerCoef, 0));
  var temp = this;
  this.obj.say("attack mode (units have normal strength and will invade in case of winning)");
  this.obj.setColor(255, 0, 0);
  DX.setProperty("mode" + player, "attack");
  this.obj.activate(function () {
    if (gamePhase == "recovery") {
      if (temp.mode == "attack") {
        temp.mode = "defense";
        temp.obj.setColor(0, 255, 0);
        temp.obj.say("defense mode (units become stronger, but will not invade after battle)");
        DX.setProperty("mode" + player, "defense");
      } else if (temp.mode == "defense") {
        temp.mode = "attack";
        temp.obj.say("attack mode (units have normal strength and invade in case of winning)");
        temp.obj.setColor(255, 0, 0);
        DX.setProperty("mode" + player, "attack");
      }
    }
  });
};


var Unit = function (coef) {
  this.hp = parseInt(coef * 100);
  this.att = parseInt(coef * 40);
  this.baseHp = this.hp;
};

Unit.prototype.attack = function () {
  var t = Math.floor((Math.random() * 3) + 1);
  return 0.5 * t * this.att;
};

var House = function (x, y) {
  this.obj = DX.item(DX.createItem("House", x, y, 0));
  this.obj.setScale(3);
  this.obj.setColor(127 * (1 - playerCoef), 0, 127 * ( playerCoef + 1));
  this.update(citizens, money);
};

House.prototype.update = function (cit, mon) {
  this.obj.think("Now citizens " + cit);
  this.obj.say("Now money " + mon)
};

var Scientist = function (x, y, price, model, step, cname, name) {
  this.price = price;
  this.basePrice = price;
  this.obj = DX.item(DX.createItem(model, x, y, 0));
  var temp = this;
  this.obj.say("Price for update is " + this.price);
  this.obj.think("Current coefficient is " + coef[cname])
  this.name = name;
  this.cname = cname;
  this.step = step;
  switch (cname) {
    case "bat":
      this.obj.setColor(128, 0, 0);
      break;
    case "sci":
      this.obj.setColor(0, 128, 0);
      break;
    case "inc":
      this.obj.setColor(128, 128, 0);
      break;
    case "citInc":
      this.obj.setColor(128, 255, 0);
  }
  this.obj.activate(function () {
    if (money >= temp.price) {
      DX.log(temp.cname);
      money -= temp.price;
      temp.basePrice = parseInt(1.2 * temp.price);
      temp.price = parseInt(temp.basePrice * coef.sci);
      coef[temp.cname] = parseFloat(temp.step + parseFloat(coef[temp.cname])).toFixed(2);
      temp.obj.say("Price for update is " + temp.price);
      temp.obj.think("Current coefficient is " + coef[temp.cname]);
    }
  })
};

Scientist.prototype.update = function () {
  this.price = parseInt(this.basePrice * coef.sci);
  this.obj.say("Price for update is " + this.price);
  this.obj.think("Current coefficient is " + coef[cname]);
};

function clear(firstToClear) {
  var object = DX.items();
  for (var i = firstToClear; i < object.length; i++) {
    object[i].remove();
  }
}

function toBattle() {
  var realC = parseInt(DX.getProperty("realC" + player));
  DX.log("realC" + player + " " + realC);
  var deads = myUnits.length - realC;
  for (var i = myUnits.length; i > realC; i--) {
    var un = myUnits.pop();
    var newX = un.position()[0];
    if (i - 10 >= 0) {
      myUnits[i - 10].moveTo(newX, 0.5 * playerCoef);
    }
    un.remove();
  }
}

function battler() {
  var coef1 = parseFloat(DX.getProperty("coef.bat1"));
  var coef2 = parseFloat(DX.getProperty("coef.bat2"));
  var realC1 = parseInt(DX.getProperty("realC1"));
  var realC2 = parseInt(DX.getProperty("realC2"));
  if (DX.getProperty("mode1") == "defense") {
    coef1 *= DEF_COEF;
  }
  if (DX.getProperty("mode2") == "defense") {
    coef2 *= DEF_COEF;
  }
  DX.log("coef1 " + coef1 + " coef2 " + coef2);
  if (realC1 != 0 && realC2 != 0) {
    var c1 = Math.min(realC1, 10);
    var units1 = [];
    var att1 = [];
    for (var i = 0; i < c1; i++) {
      var un = new Unit(coef1);
      units1.push(un);
      att1.push(un.attack());
    }
    if (lasthp1 != 0) {
      units1[units1.length - 1].hp = lasthp1;
    }
    DX.log(att1);
    var c2 = Math.min(realC2, 10);
    var units2 = [];
    var att2 = [];
    for (var i = 0; i < c2; i++) {
      var un = new Unit(coef2)
      units2.push(un);
      att2.push(un.attack());
    }
    if (lasthp2 != 0) {
      units2[units2.length - 1].hp = lasthp2;
    }
    DX.log(att2);
    var un = units1.pop();
    for (var i = 0; i < c2; i++) {
      var at = att2.pop();
      un.hp -= at;
      if (un.hp <= 0) {
        un = units1.pop();
        if (un == null) {
          i = c2;
        }
      }
    }
    if (un != null) {
      lasthp1 = un.hp;
      units1.push(un);
    }
    realC1 = realC1 - c1 + units1.length;
    var un = units2.pop();
    for (var i = 0; i < c1; i++) {
      var at = att1.pop();
      un.hp -= at;
      if (un.hp <= 0) {
        un = units2.pop();
        if (un == null) {
          i = c1;
        }
      }
    }
    if (un != null) {
      lasthp2 = un.hp;
      units2.push(un);
    }
    realC2 = realC2 - c2 + units2.length;
    DX.log("c1 " + realC1);
    DX.log("c2 " + realC2);
    DX.setProperty("realC1", realC1);
    DX.setProperty("realC2", realC2);
  } else {
    DX.setProperty("Phase", "invasion");
    lasthp1 = 0;
    lasthp2 = 0;
  }
};

var messages = ["Click me to start game"];

function sendMessage(str) {
  var dir = DX.camera().cameraDirection();
  messageCube.teleport(0, 4 * playerCoef, 3);
  messageCube.say(str);
}


var cityService = function (name, x, y, citizens) {
  this.x = x;
  this.y = y;
  this.citizens = citizens;
  this.name = name;
};


var unitsService = function (name, x, y, price, rect) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.price = price;
  this.obj = null;
  var temp = this;
  this.count = 0;
  this.recr = rect;
};

createFirst = function (x, y, service) {
  service.x = x;
  service.y = y;
  service.l = Math.sqrt(x * x + y * y);
  service.ny = x / service.l;
  service.nx = -y / service.l;
  service.obj = DX.item(DX.createItem(service.name, service.x, service.y));
  service.obj.think(service.price);
  service.obj.setScale(2);
  service.obj.setColor(127 * (1 - playerCoef), 0, 127 * ( playerCoef + 1));
  service.obj.teleport(-4, 8 * playerCoef, 0);
  service.obj.activate(function () {
    if (money >= service.price && (gamePhase == "recovery") && citizens >= service.recr) {
      money -= service.price;
      citizens -= service.recr;
      service.count = myUnits.length;
      service.obj.say("Army supply " + (200 * service.count));
      var t = DX.item(DX.createItem(service.name, service.x + service.x / service.l * service.count / 10 + service.nx * (service.count % 10 - 5), service.y + service.y / service.l * service.count / 10 + service.ny * (service.count % 10 - 5), 0));
      service.price = parseInt(service.price);
      service.obj.think(service.price);
      t.setColor(127 * (1 - playerCoef), 0, 127 * ( playerCoef + 1));
      myUnits.push(t);
    }
  });
};

var Overheat = function (base, max, callback, additional) {
  this.current = base;
  this.max = max;
  this.callback = callback;
  this.additional = additional;
};

Overheat.prototype.plus = function (dt) {
  this.current += dt;
  if (this.max < this.current) {
    this.current -= this.max;
    this.callback(this);
  }
};

var battlePhase = new Overheat(0, 7, battler, null);
var invPhase = new Overheat(0, 15, function () {
  DX.setProperty("Phase", "recovery");
}, null);

var defPhase = new Overheat(0, 5, function () {
  DX.setProperty("Phase", "invasion");
}, null);

DX.setControlEnabled(false);
var numberOfPlayers = 1;
var player = 0;
var temp = DX.getProperty("Server")
DX.log(temp);
if (temp === null || temp == 2) {
  player = 1;
  playerCoef = 1;
  DX.log("first");
  DX.setProperty("Server", 1);
  DX.setProperty("GS1", "stop");
  DX.setProperty("GS2", "stop");
  DX.setProperty("Phase", "stop");
  COLOR = "FF0000";
} else {
  DX.log("second");
  player = 2;
  playerCoef = -1;
  numberOfPlayers = 2;
  DX.setProperty("Server", 2);

  COLOR = "00FF00";
}

if (player == 1) {
  DX.log("clear");
  clear(0);
}

var messageCube = DX.item(DX.createItem("Cube", 0, 0, 20));

messageCube.activate(function () {
  messageCube.teleport(0, 0, 20);
  messageCube.say("");
  next += 1;
  if (next == 1) {
    DX.setProperty("GS" + player, "ready");
    if (DX.getProperty("GS" + (3 - player)) == "ready") {
      DX.setProperty("Phase", "battle")
    }
  }
});

var str1 = DX.createPerson("MASCULINE", "ADULT", 0, 2 * playerCoef);

var units = new unitsService("Man", 0, 2 * playerCoef, 1000, 1000);

createFirst(0, 5 * playerCoef, units);
var services = [];

services.push(units);

var manHero = DX.item(str1);
manHero.teleport(0, 13 * playerCoef, 4);

manHero.animateToState("Praying");

gamePhase = "recovery";
DX.setProperty("Phase", gamePhase);
DX.focusOn(str1, true);

var myHouse = new House(0, 10 * playerCoef);
var batSci = new Scientist(3, 15 * playerCoef, 10000, "Man", 0.1, "bat", "battle power");
var mUnit = new modeUnit();

var beginTime = 0;
var prevDt = 0;
var result = 0;
var setInBattlePhase = false;
var setInInvasionPhase = false;
var setInRecoveryPhase = true;
var citizens = 1000000;
var isBattle = true;

DX.setProperty("citizens" + player, citizens);
money = (citizens * coef.inc / 100) * 5;
var timer = 0;

DX.heartbeat(
    function (dt) {
      gamePhase = DX.getProperty("Phase");
      DX.log(gamePhase);
      if (beginTime === 0) {
        beginTime = dt;
        prevDt = dt;
      }
      var realDt = dt - prevDt;
      prevDt = dt;
      if (gamePhase == "battle") {
        if (setInBattlePhase == false) {
          timer = 0;
          setInRecoveryPhase = false;
          DX.setProperty("realC" + player, myUnits.length);
          DX.setProperty("coef.bat" + player, coef.bat);
          for (var i = myUnits.length; i > 0 && i > myUnits.length - 10; i--) {
            var x = myUnits.length - i;
            myUnits[i - 1].moveTo(x, 0.5 * playerCoef);
          }
          setInBattlePhase = true;
          isBattle = (DX.getProperty("mode1") == "attack") || (DX.getProperty("mode2") == "attack");
        }
        if (isBattle) {
          if (player == 1) {
            battlePhase.plus(realDt);
          }
          toBattle();
        } else {
          defPhase.plus(realDt);
        }
      } else if (gamePhase == "invasion") {
        if (setInInvasionPhase == false) {
          var c = myUnits.length;
          if (c > 0 && (DX.getProperty("mode" + player) == "attack")) {
            for (var i = 0; i < c; i++) {
              myUnits[i].moveTo(0, -10 * playerCoef);
            }
            var cit = DX.getProperty("citizens" + (3 - player));
            cit -= c * coef.bat * 20 * 1000;
            DX.setProperty("citizens" + (3 - player), cit);
          }
          setInInvasionPhase = true;
          setInRecoveryPhase = false;
        }
        citizens = parseInt(DX.getProperty("citizens" + player));
        myHouse.update(citizens, money);
        invPhase.plus(realDt);
      } else if (gamePhase == "recovery") {
        if (setInRecoveryPhase == false) {
          setInBattlePhase = false;
          setInInvasionPhase = false;
          var c = myUnits.length;
          if (c > 0) {
            for (var i = 0; i < c; i++) {
              myUnits[i].moveTo(units.x + units.x / units.l * (i + 1) / 10 + units.nx * ((i + 1) % 10 - 5), units.y + units.y / units.l * (i + 1) / 10 + units.ny * ((i + 1) % 10 - 5), 0);
            }
          }
          citizens = parseInt(DX.getProperty("citizens" + player));
          citizens = parseInt(citizens * coef.citInc);
          money += parseInt(citizens * coef.inc / 100);
          units.obj.say("Army supply " + (200 * myUnits.length));
          money -= parseInt(myUnits.length * 200);

          setInRecoveryPhase = true;
        }
        if (player == 2) {
          timer += realDt;
          messageCube.teleport(0, 0, 2.5);
          messageCube.say(timer);
          if (timer > 25) {
            DX.setProperty("Phase", "battle");
            messageCube.teleport(0, 0, 20);
          }
        }
        myHouse.update(citizens, money);
        DX.setProperty("citizens" + player, citizens);
      }
    }
);