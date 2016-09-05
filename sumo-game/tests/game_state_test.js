#include "../game_state.js"
#include "../lib/server_framework.js"

var server = new ServerFramework();

server.addClientReceiveCallback(function(msg) {
  DX.log("client received message from server: " + JSON.stringify(msg));
});

server.onFirstServerTick = function() {
  if(server.getServerObject(GameState) === null) {
    server.registerServerObject(new GameState());
  }
  var gameState = server.getServerObject(GameState);
  gameState.init(server);
  DX.log("game state: " + gameState.getGameState());
}

DX.command(function(cmd) {
  var code = parseInt(cmd);
  switch(code) {
    case 3:
        DX.log("sending ready");
        server.sendToServer({type: "ready"});
      break;
    case 4:
        DX.log("sending fail");
        server.sendToServer({type: "fail"});
      break;
  }
});

DX.setControlEnabled(true);

server.initWithItem(DX.createItem("Sumo", 0, 0, 0));

DX.focusOn(server.getPlayerId());