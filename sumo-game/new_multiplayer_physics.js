#include "lib/server_framework.js"
#include "lib/control.js"

var server = new ServerFramework();
var localPhysicsEnabled = false;

server.onFirstServerTick = function() {
  localPhysicsEnabled = true;
  DX.setPhysicsEnabled(true);
}

server.onClientTick = function() {
  if(localPhysicsEnabled) {
    localPhysicsEnabled = false;
    DX.setPhysicsEnabled(false);
  }
}

var playerModels = {};



server.addOnConnectCallback(function(id) {
  playerModels[id] = DX.createItem("Sumo", 0, 0, 0);
  var item = DX.item(playerModels[id]);
  item.clearPhysicsBody();
  item.setColor(255, 0, 255);
});

server.addOnDisconnectCallback(function(id) {
  var playerItem = DX.item(id);
  if(playerItem != null) {
    playerItem.clearPhysicsBody();
  }
  var playerModel = DX.item(playerModels[id]);
  if(playerModel === null) return;
  playerModel.remove();
  //control.unregisterItemId(id);
});



server.onServerTick = function() {
  var players = server.getPlayersList();
  for (i = 0; i < players.length; i++) {
    var player = DX.item(players[i]);
    if (player == null) continue;
    server.sendToClient(players[i], {
      type : "position",
      pos : player.position(),
      body : playerModels[players[i]]
    });
  }
  //control.processControls();
  //refreshControlledPlayers();
}



server.addClientReceiveCallback(function(message) {
  if(message.type === "position") {
    var localBody = DX.item(message.body);
    localBody.nonDiscreteTeleport(message.pos[0], message.pos[1], message.pos[2]);
  }

});

server.addServerReceiveCallback(function(id, message) {
  var body = DX.item(id);
  if(body === null) return;
  switch(message.cmd) {
    case 11:
      body.setVelocity(0, 3, 1);
      break;
    case 13:
      body.setVelocity(-3, 0, 1);
      break;
    case 15:
      body.setVelocity(0, -3, 1);
      break;
    case 17:
      body.setVelocity(3, 0, 1);
      break;
  }
});

DX.command(function(cmd) {
  server.sendToServer({ cmd: parseInt(cmd), type : "command"});
});

DX.setControlEnabled(false);

server.initWithItem(DX.createItem("Sumo", 0, 0, 0));

var propertyUpdateFunc = function(unused) {
  PropertyUtils.updateProperties();
  DX.runLater(propertyUpdateFunc, 1.0 / 60.0);
}

propertyUpdateFunc();
