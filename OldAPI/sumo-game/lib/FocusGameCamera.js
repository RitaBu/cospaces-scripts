#ifndef FOCUS_GAME_CAMERA_H
#define FOCUS_GAME_CAMERA_H

#include "api_adapter.js"

#include "heartbeat_wrapper.js"
#include "vector_utils.js"

var Camera = (function (){
    var myItemId = null;
    var myHeight = 2.0;
    var focusOn = function(itemId) {
        myItemId = itemId;
    };
    
    var getCamera = function() {
        return myCamera;
    }

    var setCameraHeight = function(height) {
        myHeight = height;
    }

    var rotateMultiplier = 0.2;

    var myRotationDelta = 0;

    var bodyRotation = 0;

    var getCameraHeight = function() {
        return myHeight;
    }

    var setRotationDelta = function(rotationDelta) {
        myRotationDelta += rotationDelta;
    }

    var setBodyRotation = function(argBodyRotation) {
        bodyRotation = argBodyRotation;
    }

    var myCamera = null;

    var runLaterFunc =  function(dt) {
        Heartbeat.add(function(dt) {
            if(myCamera === null) {
                myCamera = DX.camera();
                myCamera.setPlayerCamera();
            }
            if(myItemId === null) return;
            var item = DX.item(myItemId);
            if(item === null) return;
            var pos = item.position();
            //myCamera.setPosition(pos[0], pos[1], pos[2] + 1.0);
            //var camDirection = [];
            //var tempCamDir = myCamera.cameraDirection();
            //camDirection.push(tempCamDir.x);
            //camDirection.push(tempCamDir.y);
            //camDirection.push(tempCamDir.z);
            var camDirection = myCamera.cameraDirection();
            camDirection = vec3getNormal(camDirection);
            camDirection = vec3mul(camDirection, -1 * myCamera.getCameraDistance());
            myCamera.setPosition(pos[0] + camDirection[0], pos[1] + camDirection[1], pos[2] + camDirection[2] + myHeight);

            bodyRotation += myRotationDelta * rotateMultiplier;
            myRotationDelta = (1 - rotateMultiplier) * myRotationDelta;

            myCamera.setBaseRotation(bodyRotation);

        });};

    DX.schedule(runLaterFunc, 0.1);

    return {
        focusOn : focusOn,
        getCamera : getCamera,
        setCameraHeight : setCameraHeight,
        getCameraHeight : getCameraHeight,
        setRotationDelta : setRotationDelta,
        setBodyRotation : setBodyRotation
    };
})();

#endif