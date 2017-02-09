#ifndef NEW_SERVER_LIBRARY_JS
#define NEW_SERVER_LIBRARY_JS

#include "api_adapter.js"

#include "property_utils.js"
#include "object_utils.js"
#include "heartbeat_wrapper.js"

var masterProperty = getProperty(DX, "master_property");
if(masterProperty === null) {
  DX.log("this client is master. close the browser");
} else {
  DX.log("this client is not master");
}
DX.setProperty("master_property", "kekeke");



var ServerFramework = function() {
  if (!(this instanceof ServerFramework)) return; //exit, if it is called without new

  var lastServerTime = null;
  var thisPlayerId = null;

  //callbacks
  this.onServerTick = null;
  this.onFirstServerTick = null;
  this.onClientTick = null;
  //this.onPlayerConnected = null;
  //this.onPlayerDisconnected = null;
  this.onFrame = null;
 
  var dt = 1.0 / 45.0; //should be dynamycally updated
  
  var localTime = 0;
  var frameLocalTime = 0;
  var thisRef = this;
  var isServer = false;
  
  var serverReceiveCallbackList = [];
  var clientReceiveCallbackList = [];
  var onDisconnectedCallbackList = [];
  var onConnectedCallbackList = [];

  //messaging variables

  var clientLock = false;
  var clientReliableMessagesList = [];
  var clientUnreliableMessage = null;
  function ServerMessageData(argId) {
    this.id = argId;
    this.lock = false
    this.reliableMessagesList = [];
    this.unreliableMessage = null;
  }

  var serverMessageMap = {};
  
  //time variables
  
  var playerUpdatePeriod = 2.0;
  var playerCheckPeriod = 15.0;
  var playerUpdateTime = 0.0;
  var playerCheckTime = 0.0;

  var serverCheckPeriod = 20.0;
  var serverCheckTime = 0.0;
  
  var serverUpdateTime = 0.0;
  var serverUpdatePeriod = 2.0;

  var objectGroupsRefreshPeriod = 0.2;
  var objectGroupsRefreshTime = 0.0;
  
//server variables:
  var localPlayers = {};
  var objectGroups = {};
  var subscribedPlayers = {};
  var firstServerTick = false;
  
  var captureServer = function() {
    DX.log("trying to capture the server");
    localPlayers = {};
    objectGroups = {};
    subscribedPlayers = {};
    var objectGroupsJson = getProperty(DX, "object_groups");
    if(objectGroupsJson !== null) {
      objectGroups = Serializer.parse(objectGroupsJson);
    }
    PropertyUtils.setPropertyWithCompare("server_time", localTime);
    PropertyUtils.setPropertyWithCompare("server_id", thisPlayerId);
    firstServerTick = true;
  }

  var serverCheckFunction = function(unused) {
    var serverTime = getProperty(DX, "server_time");
    if(serverTime === null || lastServerTime === parseInt(serverTime)) {
      captureServer();
    }
    lastServerTime = parseInt(serverTime);
    //DX.runLater(serverCheckFunction, serverCheckPeriod);
  }

  var checkPlayerID = function(playerID) {
    if(getProperty(DX, "players_list") === null) {
      return false;
    }
    var playerIDs = getProperty(DX, "players_list").split(" ");
    for(i = 0; i < playerIDs.length; i++) {
      if(playerIDs[i] === playerID) {
        return true;
      }
    }
    return false;
  }
  
  var setPlayersList = function(playersList) {
    var playersListStr = "";
    for(i = 0; i < playersList.length; i++) {
      playersListStr += playersList[i];
      if(i != playersList.length - 1) {
        playersListStr += " ";
      }
    }
    PropertyUtils.setPropertyWithCompare("players_list", playersListStr);
  }

  var removePlayer = function(playerID) {
    DX.log("removePlayer called");
    //if(thisRef.onPlayerDisconnected !== null) {
    //  thisRef.onPlayerDisconnected(playerID);
    //}
    callOnDisconnectedCallbacks(playerID);
    var playersList = thisRef.getPlayersList();
    var newPlayersList = [];
    for(i = 0; i < playersList.length; i++) {
      if(playersList[i] != playerID) newPlayersList.push(playersList[i]);
    }
    setPlayersList(newPlayersList);
    var player = DX.item(playerID);
    if(player !== null) {
      player.remove();
    }
  }

  var serverCheckPlayers = function() { //O(n^2), but there is about 10 players, so that's ok
    var playerIDs = thisRef.getPlayersList();
    for(i = 0; i < playerIDs.length; i++) {
      if(playerIDs[i] in localPlayers) {
        if(localPlayers[playerIDs[i]] === getProperty(DX, playerIDs[i])) {
          removePlayer(playerIDs[i]);
        }
      }
      localPlayers[playerIDs[i]] = getProperty(DX, playerIDs[i]);
    }
  }

  var serverCounter = 0;
  
  var callServerReceiveFunctions = function(id, message) {
    for(server_callback_i = 0; server_callback_i < serverReceiveCallbackList.length; server_callback_i++) {
      serverReceiveCallbackList[server_callback_i](id, message);
    }
  }

  var callClientReceiveFunctions = function(message) {
    for(client_callback_i = 0; client_callback_i < clientReceiveCallbackList.length; client_callback_i++) {
      clientReceiveCallbackList[client_callback_i](message);
    }
  }
  
  var callOnConnectedCallbacks = function(id) {
    for(on_connected_i = 0; on_connected_i < onConnectedCallbackList.length; on_connected_i++) {
      onConnectedCallbackList[on_connected_i](id);
    }
  }
  
  var callOnDisconnectedCallbacks = function(id) {
    for(on_disconnected_i = 0; on_disconnected_i < onDisconnectedCallbackList.length; on_disconnected_i++) {
      onDisconnectedCallbackList[on_disconnected_i](id);
    }
  }

  var subscribeToPlayer = function(id) {
    subscribedPlayers[id] = id;
    PropertyUtils.onPropertyChanged(id + "#message_receive", function(new_val){
      if(isServer) {
        var obj = Serializer.parse(String(new_val));
        callServerReceiveFunctions(obj.id, obj.message);
        PropertyUtils.setProperty(id + "#message_receive_approve", "kekeke");
      }
    });
    PropertyUtils.onPropertyChanged(id + "#message_approve", function(new_val){
      if(isServer) {
        serverMessageMap[id].lock = false;
        sendMessageToClient(serverMessageMap[id]);
      }
    });
  }

  var serverFunction = function(unused) {
    localTime++;
    var serverId = getProperty(DX, "server_id");
    
    if(serverId === thisPlayerId) {
      isServer = true;

      if(firstServerTick) {
        firstServerTick = false;
        if(thisRef.onFirstServerTick !== null) {
          thisRef.onFirstServerTick();
        }
      }

      var tempPlayersList = thisRef.getPlayersList();
      for(i = 0; i < tempPlayersList.length; i++) {
        if(!(tempPlayersList[i] in subscribedPlayers)) {
          subscribeToPlayer(tempPlayersList[i]);
        }
      }
      
      objectGroupsRefreshTime += dt;
      if(objectGroupsRefreshTime > objectGroupsRefreshPeriod) {
        objectGroupsRefreshTime = 0.0;
        PropertyUtils.setPropertyWithCompare("object_groups", Serializer.serialize(objectGroups));
      }

      var nextPlayer = getProperty(DX, "next_player");

      PropertyUtils.setPropertyWithCompare("next_player", null);
      if(nextPlayer !== null && !checkPlayerID(nextPlayer)) {
        
        //if(thisRef.onPlayerConnected !== null) {
        //  thisRef.onPlayerConnected(nextPlayer);
        //}
        callOnConnectedCallbacks(nextPlayer);

        if(getProperty(DX, "players_list") === null) {

          PropertyUtils.setPropertyWithCompare("players_list", nextPlayer);
        } else {

          var playerIDs = thisRef.getPlayersList();

          playerIDs.push(nextPlayer);
          var playerListStr = "";
          for(i = 0; i < playerIDs.length; i++) {
            playerListStr += playerIDs[i];
            if(i !== playerIDs.length - 1) {
              playerListStr += " ";
            }
          }
          PropertyUtils.setPropertyWithCompare("players_list", playerListStr);
        }

      }

      if (thisRef.onServerTick !== null) {
        thisRef.onServerTick();
      }

      serverUpdateTime += dt;
      if(serverUpdateTime > serverUpdatePeriod) {
        serverUpdateTime = 0;
        PropertyUtils.setPropertyWithCompare("server_time", localTime);
      }


      playerCheckTime += dt;
      if(playerCheckTime > playerCheckPeriod) {
        playerCheckTime = 0;
        serverCheckPlayers();
      }


    } else {
      isServer = false;
      if(thisRef.onClientTick !== null) {
        thisRef.onClientTick();
      }
    }
    //DX.runLater(serverFunction, dt);
  }
  
  var frameFunction = function(unused) {
    frameLocalTime++;
    if(!checkPlayerID(thisPlayerId)) {
      PropertyUtils.setPropertyWithCompare("next_player", thisPlayerId);
    }

    playerUpdateTime += dt;
    if(playerUpdateTime >= playerUpdatePeriod) {
      playerUpdateTime = 0;
      PropertyUtils.setPropertyWithCompare(thisPlayerId, frameLocalTime);
    }
    if(thisRef.onFrame !== null) {
      thisRef.onFrame();
    }
    //DX.runLater(frameFunction, dt);
  }

  //GETTERS

  this.getPlayerId = function() {
    return thisPlayerId;
  }

  this.getDt = function() {
    return 1.0 / 60.0;
  }

  this.getPlayersList = function() {
    if(getProperty(DX, "players_list") === null) {
      return [];
    } else {
      return getProperty(DX, "players_list").split(" ");
    }
  }

  this.getIsServer = function() {
    return isServer;
  }

  //COMMUNICATON FUNCTIONS

  var sendMessageToServer = function() {};
  var sendMessageToClient = function(serverMessageData) {};

  this.sendToServer = function(message) {
    clientUnreliableMessage = message;
    if(!clientLock) {
      sendMessageToServer();
    }
  }
  
  this.sendReliableToServer = function(message) {
    clientReliableMessagesList.push(message);
    if(!clientLock) {
      sendMessageToServer();
    }
  }
  
  
  this.addServerReceiveCallback = function(serverReceiveCallback) {
    serverReceiveCallbackList.push(serverReceiveCallback);
  }
  
  this.addClientReceiveCallback = function(clientReceiveCallback) {
    clientReceiveCallbackList.push(clientReceiveCallback);
  }
  
  this.addOnDisconnectCallback = function(callback) {
    onDisconnectedCallbackList.push(callback);
  }
  
  this.addOnConnectCallback = function(callback) {
    onConnectedCallbackList.push(callback);
  }

  this.sendToClient = function(id, message) {
    if(!(id in serverMessageMap)) {
      serverMessageMap[id] = new ServerMessageData(id);
    }
    serverMessageMap[id].unreliableMessage = message;
    if(!serverMessageMap[id].lock) {
      sendMessageToClient(serverMessageMap[id]);
    }
  }
  
  this.sendReliableToClient = function(id, message) {
    if(!(id in serverMessageMap)) {
      serverMessageMap[id] = new ServerMessageData(id);
    }
    serverMessageMap[id].reliableMessagesList.push(message);
    if(!serverMessageMap[id].lock) {
      sendMessageToClient(serverMessageMap[id]);
    }
  }

  sendMessageToServer = function() {
    var message = null;
    var isReliable = false;
    if(clientReliableMessagesList.length > 0) {
      message = clientReliableMessagesList.shift();
      isReliable = true;
    } else {
      message = clientUnreliableMessage;
      clientUnreliableMessage = null;
    }
    if(message != null) {
      var sealedMessage = {};
      sealedMessage.id = thisRef.getPlayerId();
      sealedMessage.message = message;
      sealedMessage.timeStamp = frameLocalTime;
      sealedMessage.isReliable = isReliable;
      PropertyUtils.setProperty(thisRef.getPlayerId() + "#message_receive", Serializer.serialize(sealedMessage));
      if(isReliable) {
        clientLock = true;
      }
    }
  }

  sendMessageToClient = function(serverMessageData) {
    var message = null;
    var isReliable = false;
    if(serverMessageData.reliableMessagesList.length > 0) {
      message = serverMessageData.reliableMessagesList.shift();
      isReliable = true;
    } else {
      message = serverMessageData.unreliableMessage;
      serverMessageData.unreliableMessage = null;
    }
    if(message != null) {
      var sealedMessage = {};
      sealedMessage.message = message;
      sealedMessage.timeStamp = frameLocalTime;
      sealedMessage.isReliable = isReliable;
      PropertyUtils.setProperty(serverMessageData.id + "#message", Serializer.serialize(sealedMessage));
      if(isReliable) {
        serverMessageData.lock = true;
      }
    }
  }




  //SERVER OBJECTS

  this.registerServerObject = function(obj) {
    if(!(obj.getName() in objectGroups)) {
      objectGroups[obj.getName()] = [];
    }
    objectGroups[obj.getName()].push(obj);
  }

  this.unregisterServerObject = function(obj) {
    if(obj.getName() in objectGroups) {
      var newList = [];
      for(i = 0; i < objectGroups[obj.getName()].length; i++) {
        if(objectGroups[obj.getName()][i] !== obj) {
          newList.push(objectGroups[obj.getName()][i]);
        }
      }
      objectGroups[obj.getName()] = newList;
    }
  }
  
  this.getServerObject = function(ctor) {
    var objGroup = thisRef.getObjectGroup(ctor);
    if(objGroup.length === 0) {
      return null;
    } else {
      return objGroup[0];
    }
  }

  this.getObjectGroup = function(ctor) {
    var groupName = getName(ctor);
    if(groupName in objectGroups) {
      return objectGroups[getName(ctor)];
    } else {
      return [];
    }
  }

  var refreshObjectGroups = function() {
    var objectGroupsJson = getProperty(DX, "object_groups");
    if(objectGroupsJson !== null) {
      objectGroups = Serializer.parse(objectGroupsJson);
    }
  }

  this.getServerObjectFromClient = function(ctor) {
    refreshObjectGroups();
    return thisRef.getServerObject(ctor);
  }

  //INIT FUNCTIONS
  
  this.initWithItem = function(item) {
    DX.log("initializing server with item: " + item);
    thisPlayerId = item;

    DX.log("typeof item in server init: " + typeof item);

    var counter = 1;


    serverCheckFunction(serverCheckPeriod);
    Heartbeat.add(function(argDt) {
      if(DX.item(thisPlayerId) === null) return;

      serverFunction(argDt);
      serverCheckTime += argDt;
      if(serverCheckTime > serverCheckPeriod) {
        serverCheckTime = 0;
        serverCheckFunction(serverCheckPeriod);
      }
      frameFunction(argDt);
      
      dt = argDt;
    });
    
    if(thisRef.onServerTick === null) DX.log("onServerTick is null, so there is no server code. You could set the callback function.");
    if(thisRef.onFrame === null) DX.log("onFrame is null");
    if(thisRef.onClientTick === null) DX.log("onClientTick is null");
    if(thisRef.onPlayerDisconnected === null) DX.log("onPlayerDisconnected is null");

    PropertyUtils.onPropertyChanged(thisPlayerId + "#message", function(new_val){
      var obj = Serializer.parse(String(new_val));
      //thisRef.clientReceiveCallback(obj.message);
      callClientReceiveFunctions(obj.message);
      PropertyUtils.setProperty(thisPlayerId + "#message_approve", "kekeke");
    });

    PropertyUtils.onPropertyChanged(thisPlayerId + "#message_receive_approve", function(new_val) {
      clientLock = false;
      sendMessageToServer();
    });
  }

  this.init = function(gender, age, x, y) {
    DX.log("server.init called");
    thisPlayerId = DX.createPerson(gender, age, x, y);
    DX.log("thisPlayerId.stringify: " + JSON.stringify(thisPlayerId));
    thisRef.initWithItem(thisPlayerId);
  }
}

#endif