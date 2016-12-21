//
var cube01 = Space.createItem("Cube", -0.5, 0, 0);
var cube11 = Space.createItem("Cube", -0.5, 0, 0.5);

var legRight = Space.createGroup();
legRight.add(cube01);
legRight.add(cube11);
legRight.setPivot(cube11, "center");

var cube03 = Space.createItem("Cube", 0.5, 0, 0);
var cube13 = Space.createItem("Cube", 0.5, 0, 0.5);

var legLeft = Space.createGroup();
legLeft.add(cube03);
legLeft.add(cube13);
legLeft.setPivot(cube13, "center");

var cube12 = Space.createItem("Cube", 0, 0, 0.5);

var legs = Space.createGroup();
legs.add(cube12);
legs.add(legLeft);
legs.add(legRight);
legs.setPivot(cube12);

//BODY
var cube22 = Space.createItem("Cube", 0, 0, 1.0);
cube22.setColor(200, 200, 200);

//RIGHT HAND
var cube20 = Space.createItem("Cube", -1, 0, 1.0);
var cube30 = Space.createItem("Cube", -1, 0, 1.5);

var handRight = Space.createGroup();
handRight.add(cube30);
handRight.add(cube20);
handRight.setPivot(cube30, "center");

//LEFT HAND
var cube24 = Space.createItem("Cube", 1, 0, 1.0);
var cube34 = Space.createItem("Cube", 1, 0, 1.5);

var handLeft = Space.createGroup();
handLeft.add(cube34);
handLeft.add(cube24);
handLeft.setPivot(cube34, "center");

//SHOULDERS
var cube31 = Space.createItem("Cube", -0.5, 0, 1.5);
var cube32 = Space.createItem("Cube", 0, 0, 1.5);
var cube33 = Space.createItem("Cube", 0.5, 0, 1.5);

//HANDS
var hands = Space.createGroup();
hands.add(cube31);
hands.add(cube32);
hands.add(cube33);
hands.add(handRight);
hands.add(handLeft);
hands.setPivot(cube32);

//HEAD
var cubeH = Space.createItem("Cube", 0, 0, 2.0);
var eyeRight = Space.createItem("Cube", -0.125, 0.25, 2.25);
eyeRight.setScale(0.25);
eyeRight.setColor(255, 0, 0);
var eyeLeft = Space.createItem("Cube", 0.125, 0.25, 2.25);
eyeLeft.setScale(0.25);
eyeLeft.setColor(255, 0, 0);

var head = Space.createGroup();
head.add(cubeH);
head.add(eyeRight);
head.add(eyeLeft);
head.setPivot(cubeH);

//BODY
var body = Space.createGroup();
body.add(legs);
body.add(cube22);
body.add(hands);
body.add(head);
body.setPivot(legs);

//TEST rotateLocal FOR GROUPED OBJECTS
var handLeftRotate = function() {
    Space.schedule(function() {
        handLeft.rotateLocal(1, 0, 0, -Math.PI * 0.5, 1, function() {
            handLeft.rotateLocal(1, 0, 0, Math.PI * 0.5, 1, handLeftRotate);
        });
    }, 0.5);
};

var handRightRotate = function() {
    Space.schedule(function() {
        handRight.rotateLocal(1, 0, 0, -Math.PI * 0.5, 1, function() {
            handRight.rotateLocal(1, 0, 0, Math.PI * 0.5, 1, handRightRotate);
        });
    }, 0.5);
};

var shouldersRotate = function () {
    Space.schedule(function () {
        hands.rotateLocal(0, 0, 1, Math.PI * 0.2, 2, function () {
            Space.schedule(function () {
                hands.rotateLocal(0, 0, 1, -Math.PI * 0.4, 2, function () {
                    Space.schedule(function () {
                        hands.rotateLocal(0, 0, 1, Math.PI * 0.2, 2, shouldersRotate);
                    }, 1);
                });
            }, 1);
        });
    }, 2);
};

var legTime = 0.8;
var legAngle = Math.PI * 0.25;
var legRotate = function () {
    Space.schedule(function () {
        legRight.rotateLocal(1, 0, 0, legAngle, legTime, null);
        legLeft.rotateLocal(1, 0, 0, -legAngle, legTime, function () {
            legRight.rotateLocal(1, 0, 0, -legAngle, legTime, null);
            legLeft.rotateLocal(1, 0, 0, legAngle, legTime, function () {
                Space.schedule(function () {
                    legRight.rotateLocal(1, 0, 0, -legAngle, legTime, null);
                    legLeft.rotateLocal(1, 0, 0, legAngle, legTime, function () {
                        legRight.rotateLocal(1, 0, 0, legAngle, legTime, null);
                        legLeft.rotateLocal(1, 0, 0, -legAngle, legTime, legRotate);
                    });
                }, legTime);
            });
        });
    }, legTime);
};

var eyeRightRotate = function() {
    eyeRight.rotateLocal(0, 1, 0, -Math.PI * 0.5, 1, eyeRightRotate);
};
var eyeLeftRotate = function() {
    eyeLeft.rotateLocal(0, 1, 0, Math.PI * 0.5, 1, eyeLeftRotate);
};


legRotate();
handLeftRotate();
handRightRotate();
shouldersRotate();
//eyeRightRotate();
//eyeLeftRotate();
