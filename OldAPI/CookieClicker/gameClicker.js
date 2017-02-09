var money = 0;
var incom = 0;
var next = 0;

function clear(firstToClear) {
  var object = DX.items();
  for (var i = firstToClear; i < object.length; i++) {
    object[i].remove();
  }
}

clear(0);

var messages = ["Click me to hide a message", "Click cookie to get 1 coin", "Click scoutBoy to hire him", "Click at another object when you have enough money", "You have boosters right behind you", "Collect 1 000 000 cookies as fast as you can!"];

function sendMessage(str) {
  var dir = DX.camera().cameraDirection();
  messageCube.teleport(dir[0] * 4, dir[1] * 4, 3);
  messageCube.say(str);
}

var cookieItemService = function (name, x, y, price, step, mess, income) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.price = price;
  this.step = step;
  this.mess = mess;
  this.income = income;
  this.obj = null;
  this.objUp = DX.item(DX.createItem("Cube", x, y, 0));
  this.objUp.price = 1000;
  this.objUp.think(this.mess);
  this.objUp.say(this.objUp.price);
  var temp = this.objUp;
  var temp2 = this;
  this.objUp.activate(function () {
    if (temp.price <= money) {
      money -= temp.price;
      temp.price *= 6;
      temp.say(temp.price);
      temp2.income *= 2;
      for (var i = 0; i < temp2.objs.length; i++) {
        temp2.objs[i].say("+" + temp2.income);
      }
    }
  });
  this.objs = [];
  this.count = null;
};


createFirst = function (x, y, service) {
  service.x = x;
  service.y = y;
  service.l = Math.sqrt(x * x + y * y);
  service.ny = x / service.l;
  service.nx = -y / service.l;
  service.obj = DX.item(DX.createItem(service.name, service.x, service.y));
  service.obj.think(service.price);
  service.obj.activate(function () {
    if (money >= service.price) {
      money -= service.price;
      service.count++;
      var t = DX.item(DX.createItem(service.name, service.x + service.x / service.l * service.count / 3
          + service.nx * (service.count % 3 - 1), service.y
          + service.y / service.l * service.count / 3
          + service.ny * (service.count % 3 - 1), 0));
      service.price = parseInt(service.price * service.step);
      service.obj.think(service.price);
      t.say("+" + service.income);
      service.objs.push(t);
    }
  });
};

cookieItemService.prototype.getIncome = function () {
  return this.income * this.count;
};

var house = new cookieItemService("House", 2, -2, 2000, 1.6, "Irregular working hours for houses", 150);
var granny = new cookieItemService("OldWoman", 0, -2, 50, 1.4, "Energy drinks for grannyies", 4);
var boyScout = new cookieItemService("Boy", -2, -2, 10, 1.2, "Meldonium for BoyScouts", 1);
createFirst(0, 6, boyScout);
createFirst(2, 2, granny);
createFirst(-4, 4, house);

var services = [];
services.push(granny);
services.push(boyScout);
services.push(house);

var Overheat = function (base, max, callback, additional) {
  this.current = base;
  this.max = max;
  this.callback = callback;
  this.additional = additional;
};

Overheat.prototype.plus = function (dt) {
  this.current += dt;
  DX.log(this.current);
  if (this.max < this.current) {
    this.current -= this.max;
    this.callback(this);
  }
};


function collect(cl) {
  incom = 0;
  for (var i = 0; i < services.length; i++) {
    incom += services[i].getIncome();
  }
}

var collectMoney = new Overheat(0, 1, collect, []);

var messageCube = DX.item(DX.createItem("Cube", 0, 0, 0));

messageCube.activate(function () {
  messageCube.teleport(0, 0, 0);
  messageCube.say("");
  next += 1;
});

var str2 = DX.createItem("CheckerChip", 0, 3, 0);
var str1 = DX.createPerson("MASCULINE", "ADULT", 0, 0);
var cookie = DX.item(str2);
cookie.setScale(6);
cookie.setColor(165, 42, 42);
var manHero = DX.item(str1);
manHero.teleport(0, 0, 2);


cookie.activate(function () {
  money += 1;
});

DX.focusOn(str1, true);

var beginTime = 0;
var prevDt = 0;
sendMessage(messages[next]);
var result = 0;

DX.heartbeat(
    function (dt) {
      if (beginTime === 0) {
        beginTime = dt;
        prevDt = dt;
      }
      var realDt = dt - prevDt;
      if (next == 1) {
        sendMessage(messages[next]);
      }
      if (money > 10 && next == 2) {
        sendMessage(messages[next]);
      }
      if (money > 50 && next == 3) {
        sendMessage(messages[next]);
      }
      if (money > 1000 && next == 4) {
        sendMessage(messages[next]);
      }
      if (money > 10000 && next == 5) {
        sendMessage(messages[next]);
      }
      prevDt = dt;

      collectMoney.plus(realDt);
      money += incom;

      cookie.say(money);
      cookie.think("+" + incom);
      if (money > 1000000) {
        if (result == 0) {
          result = (dt - beginTime);
        }
        sendMessage("You won! Time is " + result);
      }
    });