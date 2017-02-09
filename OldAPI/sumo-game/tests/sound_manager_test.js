#include "../SumoSoundManager.js"
#include "../lib/server_framework.js"

var server = new ServerFramework();

var soundManager = new SoundManager(server);

server.initWithItem(DX.createItem("Sumo", 0, 0, 0));

var myItem = DX.item(server.getPlayerId());

DX.setControlEnabled(true);

DX.focusOn(server.getPlayerId(), true);

DX.command(function(cmd) {
  if(cmd == 4) {
    soundManager.playSound("failKick", myItem.position(), false, false);
  }
});

DX.heartbeat(function(dt) {
  soundManager.setListenerPosition(myItem.position());
});