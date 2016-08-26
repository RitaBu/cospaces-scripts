#ifndef FOOD_JS
#define FOOD_JS

#include "lib/server_framework.js"

function FoodClass(booster, range) {
    var angle = Math.random() * Math.PI * 2;
    var radius = 5;
    var thisRef = this;
    this.range = range;
    this.shouldRemove = false;
    /*
    this.id = DX.createItem("Sphere",
        Math.random() * radius * Math.cos(angle),
        Math.random() * radius * Math.sin(angle),
        0);
        */
    this.id = "";
    this.init = function() {
       thisRef.id = DX.createItem("Sphere",
            Math.random() * radius * Math.cos(angle),
            Math.random() * radius * Math.sin(angle),
            0);
    }
    this.getItem = function() {
        return DX.item(thisRef.id);
    }
    this.booster = booster;
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
                thisRef.booster(bestEater);
            }
            thisRef.getItem().remove();
            thisRef.shouldRemove = true;
        }
    }
}

#endif