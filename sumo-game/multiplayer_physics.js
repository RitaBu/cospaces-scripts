#include "lib/server_framework.js"

#include "lib/control.js"


var server = new ServerFramework();
var control = new ControlManager();
var localPhysicsEnabled = false;

control.moveControlledItem = function(itemId, direction) {
  var player = DX.item(itemId);
  if(player === null) return;
  var pos = player.position();

  var physicsMultiplier = localPhysicsEnabled ? 10.0 : 1.0;

  if(direction !== 10) {
    player.teleport(pos[0] + 0.02 * physicsMultiplier, pos[1], pos[2]);
  }
}



DX.command(function(cmd) {
  control.setDirection(server.getPlayerId(), cmd);
});


function ServerInfo () {
  this.serverChanged = 0;
}

var counterUsed = false;

server.onServerTick = function() {
  if(!localPhysicsEnabled) {
    DX.setPhysicsEnabled(true);
    localPhysicsEnabled = true;
  }

  if(!counterUsed) {
    counterUsed = true;
    var serverInfoGroup = server.getObjectGroup(ServerInfo);
    if (serverInfoGroup.length === 0) {
      DX.log("registered new ServerInfo");
      server.registerServerObject(new ServerInfo());
    } else {
      DX.log("server changed " + serverInfoGroup[0].serverChanged + " times");
      serverInfoGroup[0].serverChanged++;
    }
  }

}

server.onClientTick = function() {
  if(localPhysicsEnabled) {
    DX.setPhysicsEnabled(false);
    localPhysicsEnabled = false;
  }
  counterUsed = false;
}

server.onFrame = function() {
  control.processControls();
}


server.init("MASCULINE", "ADULT", 0, 0);
control.registerItemId(server.getPlayerId());

DX.focusOn(server.getPlayerId());
DX.setControlEnabled(false);
