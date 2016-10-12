#ifndef GAME_STATE_JS
#define GAME_STATE_JS

#include "lib/api_adapter.js"

#include "lib/heartbeat_wrapper.js"

function GameState() {
  this.unluckyPlayers = {};
  this.readyPlayers = {};
  this.indicatorIds = {};
  var spawnRadius = 7.0;
  this.state = "waiting";
  var thisRef = this;
  var myServer = null;
  var numberOfColumns = 8;
  var columnRadius = 12.0;
  var firstFreeColumn = 0;
  var columnHeight = 5;

  
  this.init = function(server) {
    if(myServer !== null) return;
    myServer = server;
    server.addServerReceiveCallback(function(id, message) {
      DX.log("server received message.");
      DX.log("id: " + id);
      DX.log("message: " + message);

      if(message.type === "buttons") {
        thisRef.indicatorIds[id] = message.ids;
      }
      
      switch(thisRef.state) {
        case "waiting":
          if(message.type === "ready") {
            DX.log("player " + id + " is ready");
            thisRef.readyPlayers[id] = id;
          }
          break;
        case "playing":
          if(message.type === "fail") {
            DX.log("player " + id + " is failed");
            thisRef.unluckyPlayers[id] = id;
            var columnDeltaAngle = Math.PI * 2 / numberOfColumns;
            var pos = [columnRadius * Math.cos(columnDeltaAngle * firstFreeColumn), columnRadius * Math.sin(columnDeltaAngle * firstFreeColumn), columnHeight];
            firstFreeColumn++;
            server.sendReliableToClient(id, {type: "teleport", pos: pos});
          }
          break;
      }
    });

    server.addOnDisconnectCallback(function(id) {
      DX.log("playerDisconnected: " + id);
      thisRef.clearButtons(id);
    });
  }


  this.clearButtons = function(id) {
    if(id in thisRef.indicatorIds) {
      DX.log("buttons exist in map");
      var firstId = thisRef.indicatorIds[id][0];
      var secondId = thisRef.indicatorIds[id][1];
      var firstItem = DX.item(firstId);
      var secondItem = DX.item(secondId);
      if(firstItem !== null) firstItem.remove();
      if(secondItem !== null) secondItem.remove();
    }
  }

  

  var startGame = function() {
    DX.log("starting game");
    if(thisRef.state === "playing") return;
    thisRef.state = "playing";

    var players = myServer.getPlayersList();
    var deltaAngle = Math.PI * 2 / players.length;
    for(var i = 0; i < players.length; i++) {
      var angle = deltaAngle * i;
      var playerItem = DX.item(players[i]);
      if(playerItem === null) continue;
      var spawnPos = [spawnRadius * Math.sin(angle), spawnRadius * Math.cos(angle), 0];
      myServer.sendReliableToClient(players[i], {
        type : "playing", 
        spawnPos : spawnPos,
        bodyOrientation : angle
      });
    }

    thisRef.unluckyPlayers = {};

    firstFreeColumn = 0;
  }

  var finishGame = function() {
    DX.log("finishing game");
    if(thisRef.state === "waiting") return;
    thisRef.state = "waiting";
    thisRef.readyPlayers = {};

    var players = myServer.getPlayersList();
    for(var i = 0; i < players.length; i++) {
      myServer.sendReliableToClient(players[i], {type : "waiting"});
    }

  }

  Heartbeat.add(function(dt) {
    if(myServer === null) return;
    if(!myServer.getIsServer()) return;
    var players = myServer.getPlayersList();
    switch(thisRef.state) {
      case "waiting":
          var allPlayersAreReady = true;
          for(i = 0; i < players.length; i++) {
            if(!(players[i] in thisRef.readyPlayers)) {
              allPlayersAreReady = false;
            }
          }

          if(allPlayersAreReady) {
            startGame();
          }
          break;
      case "playing":
          var luckyPlayers = 0;
          for(i = 0; i < players.length; i++) {
            if(!(players[i] in thisRef.unluckyPlayers)) {
              luckyPlayers++;
            }
          }
          if(luckyPlayers < 2) {
            finishGame();
          }
          break;
    }
  });

  this.getGameState = function () {
    return thisRef.state;
  }
  
}

#endif