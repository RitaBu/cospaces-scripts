#ifndef FOOD_JS
#define FOOD_JS

#include "lib/server_framework.js"
#include "Color.js"


function getRandomInt(min, max) {
    DX.log("random min: " + min);
    DX.log("random max: " + max);
    var randNumber = Math.random() * (max - min + 1) + min;
    DX.log("random number: " + randNumber);
    return Math.floor(randNumber);
}

function powerBuff(p) {
    p.scale += 0.3;
    p.strength += 3;
    p.item.setScale(p.scale);
    DX.runLater(function (dt) {
        p.scale = Math.max(p.scale - 0.2, p.playerCash.scale);
        p.strength = Math.max(p.strength - 2, p.playerCash.strength);
        p.item.setScale(p.scale);
    },30);
}

function jumpBuff(p) {
    p.jumpPower += 3;
    DX.runLater(function (dt) {
        //p.jumpPower -= 3;
        //if(p.jumpPower < p.playerCash.jumpPower) p.jumpPower = p.playerCash.jumpPower;
        p.jumpPower = Math.max(p.jumpPower - 3, p.playerCash.jumpPower);
    },15);
}

function speedBuff(p) {
    p.speed += 2;
    DX.runLater(function(dt) {
        //p.speed -= 1.5;
        //if(p.speed < p.playerCash.speed) p.speed = p.playerCash.speed;
        p.speed = Math.max(p.speed - -1.5, p.playerCash.speed);
    });
}

var buffs = [powerBuff, jumpBuff, speedBuff];
var buffColors = [red, indigo, green];

function FoodClass(range) {
    DX.log("food constructor called");
    var angle = Math.random() * Math.PI * 2;
    this.color = null;
    var minRadius = 2;
    var maxRadius = 8;
    var thisRef = this;
    this.range = range;
    this.shouldRemove = false;

    this.id = "";
    this.init = function() {
        DX.log("food init called");
        do {
            var a = Math.random() * maxRadius;
            var b = Math.random() * maxRadius;
            var r = Math.sqrt(a*a + b*b)
        } while( r < minRadius || r > maxRadius );
        thisRef.id = DX.createItem("Sphere",a, b, 0);
        var foodItem = DX.item(thisRef.id);
        DX.log("color object: " + JSON.stringify(thisRef.color));
        foodItem.setColor(thisRef.color.r, thisRef.color.g, thisRef.color.b);
    }
    this.getItem = function() {
        return DX.item(thisRef.id);
    }
    var boosterIndex = getRandomInt(0,buffs.length - 1);
    this.booster = buffs[boosterIndex];
    this.color = buffColors[boosterIndex];
    this.update = function() {
        var playerList = server.getPlayersList();
        var bestEater = null;
        var r = 2 * thisRef.range;
        for(i = 0; i < playerList.length; i++) {
            var eater = DX.item(playerList[i]);
            if (eater != null) {
                var dist = eater.distanceToItem(thisRef.getItem());
                if (dist < thisRef.range && dist < r) {
                    bestEater = eater;
                    r = dist;
                }
            }
        }
        if(bestEater != null) {
            if(thisRef.booster != null) {
                server.sendToClient(bestEater.id(), {type: "buff", func: thisRef.booster});
            }
            thisRef.getItem().remove();
            thisRef.shouldRemove = true;
        }
    }
}

#endif