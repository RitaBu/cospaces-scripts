#include "player.js"
#include "lib/server_framework.js"
#include "lib/heartbeat_wrapper.js"
#include "food.js"
#include "game_state.js"
#include "Color.js"

var foodCount = 3;

function ServerInfo() {
    this.food = [];
    for(server_info_i = 0; server_info_i < foodCount; server_info_i++) {
        this.food.push(null);
    }
    this.scene = null;
    this.columns = null;
    this.gameState = null;
    this.colorMap = null;
    this.colorStack = null;
}

var info = server.getServerObjectFromClient(ServerInfo);

var colomns = function() {};
var foodFunc = function() {};

if(info == null || info.gameState.getGameState() == "waiting") {


    var player = new Player();
    var foodsp = [];
    for(i = 0; i < foodCount; i++) {
        foodsp.push(true);
    }

    var serverInfo = null;



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
                case 5:
                    DX.log("rotating");
                    Camera.setRotationDelta(Math.PI / 2);
                    break;
                case 6:
                    DX.log("rotating");
                    Camera.setRotationDelta(-Math.PI / 2);
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
        player.movePlayer(direction, server.getDt());
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
            serverInfo.scene = DX.createItem("%%ffdbcebdf440742dc4eeeec4aeda03fb71623decf36e4f538ecf257bae4bc08a", 0, 0, 0); //sumo arena
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

    foodFunc = function() {
        if (serverInfo.gameState.getGameState() != "playing") {
            /*
            if (serverInfo.food !== null) {
                var foodItem = DX.item(serverInfo.food.id);
                if (foodItem != null) {
                    foodItem.remove();
                }
                serverInfo.food = null;
                foodsp = true;
            }
            */
            DX.log("food non-playing");
            for(i = 0; i < foodCount; i++) {
                if(serverInfo.food[i] !== null) {
                    var foodItem = DX.item(serverInfo.food[i].id);
                    if (foodItem != null) {
                        foodItem.remove();
                    }
                    serverInfo.food[i] = null;
                    foodsp[i] = true;
                }
            }
            return;
        }


        for(food_i = 0; food_i < foodCount; food_i++) {
            if (serverInfo.food[food_i] == null && foodsp[food_i]) {
                DX.log("spawn init");
                foodsp[food_i] = false;
                var temp_food_i = food_i;
                (function(i){
                    DX.runLater(function (dt) {
                            DX.log("food_i in food runLater: " + i);
                            serverInfo.food[i] = new FoodClass(1);
                            serverInfo.food[i].init();
                        }
                        , foodSpawnTime + Math.random() * foodSpawnTime / 2);
                })(food_i);

            } else {
                //DX.log("else called for i: " + i);
                //DX.log("food: " + JSON.stringify(serverInfo.food[i]));
                if (serverInfo.food[food_i] != null) {
                    DX.log("serverInfo.food[i] != null");
                    if (!serverInfo.food[food_i].shouldRemove) {
                        DX.log("i: " + food_i);
                        DX.log("calling food update");
                        serverInfo.food[food_i].update();
                    }
                    if (serverInfo.food[food_i].shouldRemove) {
                        serverInfo.food[food_i] = null;
                        DX.log("setting food to null");
                        foodsp[food_i] = true;
                    }
                }
            }
        }
    }

    server.addClientReceiveCallback(function (msg) {
        if (msg.type == "teleport") {
            player.parabolaOnJump.finishImmediately();
            player.parabolaOnPunched.finishImmediately();
            player.item.teleport(msg.pos[0], msg.pos[1], msg.pos[2]);
            return;
        }
        player.setGameState(msg.type);
        if (msg.type == "playing") {
            player.item.teleport(msg.spawnPos[0], msg.spawnPos[1], 0);
            if(Camera.getCamera() !== null) {
                Camera.setBodyRotation(msg.bodyOrientation + Math.PI);
                Camera.getCamera().setCameraAH(msg.bodyOrientation + Math.PI, -Math.PI / 6);
            }
        }
        if (msg.type == "buff") {
            DX.log("buff: " + msg.func);
            msg.func(player);
        }

    });

    server.addOnConnectCallback(function (id) {
        if (server.getServerObject(ServerInfo) === null) {
            isServerCreated = true;
            server.registerServerObject(new ServerInfo());
        }

        info = server.getServerObject(ServerInfo);
        if(info.colorMap == null) {
            info.colorMap = {};
            info.colorStack = [];
            for(var i = 0; i < 8; i++) {
                info.colorStack.push(i);
            }
        }

        if(info.colorMap[id] == null) {
            var c = info.colorStack.pop();
            info.colorMap[id] = c;
            var color = colors[c];
            var it = DX.item(id);
            it.setColor(color.r, color.g, color.b);
        }

        DX.log(info.colorStack);
    });

    server.addOnDisconnectCallback(function (id) {
        info = server.getServerObject(ServerInfo);
        DX.log(info.colorMap[id]);
        if(info != null && info.colorMap!=null) {
            info.colorStack.push(info.colorMap[id]);
            info.colorMap[id] = null;
        }
    });
}


