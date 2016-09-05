#include "../lib/server_framework.js"

var server = new ServerFramework();

server.addOnConnectCallback(function(id) {
  for(var i = 0; i < 30; i++) {
    server.sendReliableToClient(id, {msg: String(i)});
  }
});

server.addClientReceiveCallback(function(message){
  DX.log("client received message: " + message.msg);
});

server.initWithItem(DX.createItem("Sumo", 0, 0, 0));