//
var cube01 = Space.createItem("Cube", -0.5, 0, 0);
var cube11 = Space.createItem("Cube", -0.5, 0, 0.5);

var legRight = Space.createGroup();
legRight.add(cube01);
legRight.add(cube11);
legRight.setOrientationFrom(cube11);

var cube03 = Space.createItem("Cube", 0.5, 0, 0);
var cube13 = Space.createItem("Cube", 0.5, 0, 0.5);

var legLeft = Space.createGroup();
legLeft.add(cube03);
legLeft.add(cube13);
legLeft.setOrientationFrom(cube13);

var cube12 = Space.createItem("Cube", 0, 0, 0.5);

var legs = Space.createGroup();
legs.add(cube12);
legs.add(legLeft);
legs.add(legRight);
legs.setOrientationFrom(cube12);

//BODY
var cube22 = Space.createItem("Cube", 0, 0, 1.0);

//RIGHT HAND
var cube20 = Space.createItem("Cube", -1, 0, 1.0);
var cube30 = Space.createItem("Cube", -1, 0, 1.5);

var handRight = Space.createGroup();
handRight.add(cube30);
handRight.add(cube20);
handRight.setOrientationFrom(cube30);

//LEFT HAND
var cube24 = Space.createItem("Cube", 1, 0, 1.0);
var cube34 = Space.createItem("Cube", 1, 0, 1.5);

var handLeft = Space.createGroup();
handLeft.add(cube34);
handLeft.add(cube24);
handLeft.setOrientationFrom(cube34);

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
hands.setOrientationFrom(cube32);

//HEAD
var head = Space.createItem("Cube", 0, 0, 2.0);

//BODY
var body = Space.createGroup();
body.add(legs);
body.add(cube22);
body.add(hands);
body.add(head);
body.setOrientationFrom(legs);

//TEST addLocalRotation FOR GROUPED OBJECTS
/*
Space.scheduleRepeating(function () {
    handLeft.addLocalRotation(0, 0, 0.25, 1, 0, 0, Math.PI / 200);
    handRight.addLocalRotation(0, 0, 0.25, 1, 0, 0, Math.PI / 200);
    hands.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
}, 0);
*/


var handLeftRotate = function() {
    Space.schedule(function() {
        handLeft.rotateLocal(1, 0, 0, Math.PI * 0.5, 1, function() {
            //handLeft.rotateLocal(1, 0, 0, -Math.PI * 0.5, 1, handLeftRotate);
        });
    }, 1);
};

var handRightRotate = function() {
    Space.schedule(function() {
        handRight.rotateLocal(1, 0, 0, Math.PI * 0.5, 1, function() {
            //handRight.rotateLocal(1, 0, 0, -Math.PI * 0.5, 1, handRightRotate);
        });
    }, 1);
};

var shouldersRotate = function() {
    Space.schedule(function() {
        hands.rotateLocal(0, 0, 1, Math.PI * 0.5, 1, function() {
            //hands.rotateLocal(0, 0, 1, -Math.PI * 0.5, 1, shouldersRotate);
        });
    }, 1);
};

handLeftRotate();
handRightRotate();
//shouldersRotate();
