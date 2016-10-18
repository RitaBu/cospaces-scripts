#ifndef EXTRAPOLATOR_JS
#define EXTRAPOLATOR_JS

#include "vector_utils.js"

function Extrapolator() {
  var that = this;
  var myStartPoint = [0, 0, 0];
  var myVelocity = [0, 0, 0];
  var myAcceleration = [0, 0, 0];
  var time = 0;
  var actualStartPoint = [0, 0, 0];
  
  this.getActualPosition = function() {
    return vec3add(actualStartPoint, vec3mul(myVelocity , time));
  }
  this.setActualPosition = function(x, y, z) {
    actualStartPoint = [x, y, z];
    time = 0;
  }
  this.set = function(startPoint, velocity, acceleration) {
    if(vec3lengthSquared(acceleration) > 0.1) {
      DX.log("acceleration: " + acceleration);
    }
    actualStartPoint = that.getActualPosition();
    myStartPoint = startPoint;
    myVelocity = velocity;
    myAcceleration = acceleration;
    
    time = 0;
    
  }
  this.update = function(dt) {
    time += dt;
    actualStartPoint = vec3add(vec3mul(actualStartPoint, 0.8), vec3mul(myStartPoint, 0.2));
    myVelocity = vec3add(myVelocity, vec3mul(myAcceleration, dt));
  }
}

#endif