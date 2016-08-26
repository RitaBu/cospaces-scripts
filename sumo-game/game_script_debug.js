#include "player.js"
#include "lib/server_framework.js"
#include "lib/heartbeat_wrapper.js"
#include "food.js"
#include "game_state.js"

function ServerInfo() {
    this.food = null;
    this.scene = null;
    this.columns = null;
    this.gameState = null;
    //this.init = function() {
    //    DX.log("called init of ServerInfo");
    //    thisRef.gameState = new GameState();
    //}
}

var info = server.getServerObjectFromClient(ServerInfo);

var colomns = function() {};
var foodFunc = function() {};

if(info == null || info.gameState.getGameState() == "waiting") {


    var player = new Player();
    var food;
    var foodsp = true;

    var serverInfo = null;


    if (DX.setUnitAttachedToCamera) {
        DX.setUnitAttachedToCamera(false);
    }


//DX.setHeartbeatInterval(0);
    var time = 0;
    var started = false;
    Heartbeat.add(function (dt) {
        player.update(dt);
    });
    DX.command(function (cmd) {
        var it = DX.item(server.getPlayerId());
        if(it!=null) {
            var com = parseInt(cmd);
            switch (com) {
                case 3:
                    DX.log("jump!");
                    player.jump();
                    break;
                case 4:
                    DX.log("punch!!");
                    player.checkWhoIsPunched();
                    break;
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    player.setDir(com);
                    break;
                case 10:
                    player.stop();
            }
        }
    });

    controlManager.moveControlledItem = function (itemId, direction) {
        movePlayer(itemId, direction, server.getDt());
    }


    server.onServerTick = function () {
        if (server.getServerObject(ServerInfo) === null) {
            isServerCreated = true;
            server.registerServerObject(new ServerInfo());
        }
        serverInfo = server.getServerObject(ServerInfo);
        if (serverInfo.gameState === null) {
            serverInfo.gameState = new GameState();
        }
        serverInfo.gameState.init(server);
        if(serverInfo.scene == null || DX.item(serverInfo.scene) === null) {
            serverInfo.scene = DX.createItem("%%dff80a1a652caaf9b12bfa106255b85a21b348262ead9feec7c40470622be9f2", 0, 0, 0); //sumo arena
        }
        foodFunc();
        colomns();
        //controlManager.processControls();
    }

    server.onFrame = function () {
        controlManager.processControls();
    }


    player.start();
    controlManager.registerItemId(server.getPlayerId());
    var foodSpawnTime = 5;

    var colomns = function () {
        var r = 12;
        var h = -5;
        var s = 10;
        if (serverInfo.columns == null) {
            serverInfo.columns = [];
            for (alpha = 0; alpha < 2 * Math.PI; alpha += Math.PI / 4) {
                var id = DX.createItem("Cylinder", r * Math.cos(alpha),
                    r * Math.sin(alpha), h);
                var item = DX.item(id);
                item.setScale(s);
                serverInfo.columns.push(id);
            }
        } else {
            for (i = 0; i < serverInfo.columns.length; i++) {
                if (DX.item(serverInfo.columns[i]) == null) {
                    var alpha = Math.PI / 4 * i;
                    var id = DX.createItem("Cylinder", r * Math.cos(alpha),
                        r * Math.sin(alpha), h);
                    var item = DX.item(id);
                    item.setScale(s);
                    serverInfo.columns[i] = id;
                }
            }
        }
    }

    var foodFunc = function() {
        if (serverInfo.gameState.getGameState() != "playing") {
            if (serverInfo.food !== null) {
                var foodItem = DX.item(serverInfo.food.id);
                if (foodItem != null) {
                    foodItem.remove();
                }
                serverInfo.food = null;
                foodsp = true;
            }
            return;
        }
        if (serverInfo.food == null && foodsp) {
            DX.log("spawn init");
            foodsp = false;
            DX.runLater(function (dt) {
                    DX.log("spawn");
                    serverInfo.food = new FoodClass(scaleBuff, 1);
                    serverInfo.food.init();
                    DX.setProperty("food" + server.getPlayerId(), serverInfo.food.id);
                }
                , foodSpawnTime);
        } else if (serverInfo.food != null) {
            if (!serverInfo.food.shouldRemove) {
                serverInfo.food.update();
            }
            if (serverInfo.food.shouldRemove) {
                serverInfo.food = null;
                foodsp = true;
            }
        }
    }

    server.clientReceiveCallback = function (msg) {
        if (msg.type == "teleport") {
            player.item.teleport(msg.pos[0], msg.pos[1], msg.pos[2]);
            return;
        }
        player.setGameState(msg.type);
        if (msg.type == "playing") {
            player.item.teleport(msg.spawnPos[0], msg.spawnPos[1], 0);
            if(Camera.getCamera() !== null) {
                Camera.getCamera().setBaseRotation(msg.bodyOrientation + Math.PI);
                Camera.getCamera().setCameraAH(msg.bodyOrientation + Math.PI, -Math.PI / 6);
            }
        }

    }

    function scaleBuff(item) {
        var onBuff = getProperty(item, "buff");
        var onBuffVal;
        if (onBuff == null) {
            item.setProperty("buff", 0);
        } else {
            onBuffVal = parseInt(onBuff);
            item.setProperty("buff", onBuffVal + 1);
        }
    }
}


