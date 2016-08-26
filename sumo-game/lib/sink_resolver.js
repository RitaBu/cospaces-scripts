#ifndef SINK_RESOLVER_JS
#define SINK_RESOLVER_JS

#include "heartbeat_wrapper.js"
#include "vector_utils.js"

function SinkResolver(server) {
  var thisPlayerId = "";
  var playersUpdatePeriod = 1.0;
  var playersUpdateTime = 0.0;
  var sphereRadius = 0.5;
  var downSpeed = 0.3;
  var sinkRate = 0.1;
  var isMovingDown = true;
  var playersList = [];
  Heartbeat.add(function(dt){

    //updating players list
    playersUpdateTime += dt;
    if(playersUpdateTime > playersUpdatePeriod) {
      playersUpdateTime = 0;
      playersList = server.getPlayersList();
    }

    //resolving collisions with other players
    var thisItem = DX.item(thisPlayerId);
    if(thisItem === null) return;
    var thisPosition = thisItem.position();

    for(var i = 0; i < playersList.length; i++) {
      if(playersList[i] == thisPlayerId) continue;
      var playerItem = DX.item(playersList[i]);
      if(playerItem === null) continue;
      var distance = thisItem.distanceToItem(playerItem);
      distance -= sphereRadius * 2;
      if(distance > 0) continue;
      distance = -distance;
      
      var playerPosition = playerItem.position();
      
      var deltaPosition = vec3sub(thisPosition, playerPosition);
      
      if(vec3lengthSquared(deltaPosition) > 0) {
        var normal = vec3getNormal(deltaPosition);
        normal = vec3mul(normal, distance * sinkRate);
        var newPosition = vec3add(normal, thisPosition);
        thisItem.nonDiscreteTeleport(newPosition[0], newPosition[1], newPosition[2]);
        thisPosition = thisItem.position();
      }
    }

    //moving player down
    if(isMovingDown) {
      thisItem.nonDiscreteTeleport(thisPosition[0], thisPosition[1], thisPosition[2] - downSpeed * dt);  
    }
    
    //resolving floor sinking
    var floorPenetration = thisPosition[2];
    if(floorPenetration < 0) {
      floorPenetration = -floorPenetration;
      thisItem.nonDiscreteTeleport(thisPosition[0], thisPosition[1], thisPosition[2] + floorPenetration * sinkRate);
      thisPosition = thisItem.position();
    }

  });

  this.setPlayerId = function(id) {
    thisPlayerId = id;
  }
  
  this.setMovingDown = function(movingDown) {
    isMovingDown = movingDown;
  }
}

#endif