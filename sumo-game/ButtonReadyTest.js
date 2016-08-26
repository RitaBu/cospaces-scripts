#ifndef BUTTON_JS
#define BUTTON_JS

#include "lib/heartbeat_wrapper.js"
#include "lib/FocusGameCamera.js"

var Button = null

function ButtonReady(itemID, dx, dy, dz, func) {
    var item = DX.item(itemID);
    var pos = item.position();
    var dir = item.getAxisY();
    var thisRef = this;
    this.red = 200;
    this.green = 200;
    this.idButton = DX.createItem("CheckerChip", pos[0] + dir[0] * dx, pos[1] + dir[1] * dy, pos[2]);
    this.idMarker = DX.createItem("Sphere", pos[0], pos[1], pos[2] + dz);
    var button = DX.item(this.idButton);
    var marker = DX.item(this.idMarker);
    button.setColor(this.red, 0, 0);
    marker.setColor(this.red, 0, 0);
    this.color = [];
    this.color.push(this.red);
    this.color.push(0);
    this.color.push(0);
    this.time = 5;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.callback = func;
    this.itemID = itemID;
    Button = this;
    this.activated = false;
    
    this.getButtonIds = function () {
        return [thisRef.idButton, thisRef.idMarker];
    }
}

ButtonReady.prototype.move = function() {
    var item = DX.item(this.itemID);
    var button = DX.item(this.idButton);
    var marker = DX.item(this.idMarker);
    if(item != null) {
        var pos = item.position();
        var dir = item.getAxisY();
        if(button != null) {
            button.nonDiscreteTeleport(pos[0] + dir[0] * this.dx,
                pos[1] + dir[1] * this.dy, pos[2]);
        }
        if(marker != null) {
            marker.nonDiscreteTeleport(pos[0], pos[1], pos[2] + this.dz);
        }
    }
}

ButtonReady.prototype.check = function(dt) {
    var button = DX.item(this.idButton);
    var marker = DX.item(this.idMarker);
    var cam = Camera.getCamera();
    if(button != null && marker != null && cam != null) {
        var dir = cam.cameraDirection();
        var pos = cam.position();
        var t = -pos[2] / dir[2];
        if(isFinite(t) && dir[2] < 0) {
            var a = pos[0] + t * dir[0];
            var b = pos[1] + t * dir[1];
            var c = pos[2] + t * dir[2];

            var itemPos = button.position();
            var l = Math.sqrt((a - itemPos[0]) * (a - itemPos[0]) +
                (b - itemPos[1]) * (b - itemPos[1]));

            if (l > 1) {
                button.setColor(this.red, 0, 0);
                marker.setColor(this.red, 0, 0);
                this.color[0] = this.red;
                this.color[1] = 0;
                this.color[2] = 0;
            } else {
                var dr = this.red / this.time * dt;
                var dg = this.green / this.time * dt;

                if (this.color[0] - dr > 0) {
                    this.color[0] -= dr;
                } else {
                    this.color[0] = 0;
                }

                if (this.color[1] + dg < 255) {
                    this.color[1] += dg;
                } else {
                    this.color[1] = 255;
                }

                this.color[2] = 0;
                button.setColor(parseInt(this.color[0]), parseInt(this.color[1]), parseInt(this.color[2]));
                marker.setColor(parseInt(this.color[0]), parseInt(this.color[1]), parseInt(this.color[2]));
                if(this.color[1] >= this.green) {
                    button.remove();
                    this.activated = true;
                    this.callback();
                }
            }
        }
    }
}

ButtonReady.prototype.remove = function() {
    var marker = DX.item(this.idMarker);
    if(marker != null) {
        marker.remove();
    }
}

Heartbeat.add(function (dt) {
    if(Button != null) {
        Button.move();
        if(!Button.activated) {
            Button.check(dt);
        }
    }
});

#endif

/*var id = DX.createItem("Sphere",0,0,0);
var item = DX.item(id);
item.setScale(3);
DX.focusOn(id);
var b = new ButtonReady(id, 0.2,0.2,4);
DX.setHeartbeatInterval(0);
DX.heartbeat(function (dt) {
    b.move();
    b.check();
})*/