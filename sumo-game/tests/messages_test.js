#include "../lib/server_framework.js"

var server = new ServerFramework();

server.addClientReceiveCallback(function(message) {
  DX.log("received from server: " + JSON.stringify(message));
});

server.addServerReceiveCallback(function(id, message) {
  DX.log("received message from: " + id);
  DX.log("message stringify: " + JSON.stringify(message));
  DX.log("responding to client...");
  server.sendToClient(id, { msg: "hello from server!"});
});



DX.command(function(cmd) {
  DX.log("sending message to the server");
  server.sendToServer({ msg : "kekeke"});
});

server.initWithItem(DX.createItem("Sumo", 0, 0, 0));

DX.setControlEnabled(false);