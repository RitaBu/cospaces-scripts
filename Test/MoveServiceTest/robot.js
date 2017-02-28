//
var says = ["Че те надо блядь?",
            "Че ты на меня смотришь, сука?",
            "Иди на хуй отсюда!",
            "Ты сейчас пизды получишь!",
            "Ты не понял, мудак, блядь?",
            "Я тебе сейчас в ебало дам...",
            "Пидор, блядь, сраный",
            "Куда съебываешь?",
            "Стой, пидор!",
            "Уебок, блядь",
            "Гондон",
            "Сука, блядь, охуевшая"
];

var footRight = Scene.createItem("Cube");
var legRight = Scene.createItem("Cube");
footRight.connectToItem("top", legRight, "bottom");

var footLeft = Scene.createItem("Cube");
var legLeft = Scene.createItem("Cube");
footLeft.connectToItem("top", legLeft, "bottom");

var legs = Scene.createItem("Cube");
legLeft.connectToItem("right", legs, "left");
legRight.connectToItem("left", legs, "right");

//BODY
var body = Scene.createItem("Cube", 0, 0, 1.0);
body.setColor(200, 200, 200);

legs.connectToItem("top", body, "bottom");

//RIGHT HAND
var palmRight = Scene.createItem("Cube");
var handRight = Scene.createItem("Cube");
palmRight.connectToItem("top", handRight, "bottom");


//LEFT HAND
var palmLeft = Scene.createItem("Cube");
var handLeft = Scene.createItem("Cube");
palmLeft.connectToItem("top", handLeft, "bottom");

//SHOULDERS
var shoulderRight = Scene.createItem("Cube");
var shoulderLeft = Scene.createItem("Cube");

handLeft.connectToItem("right", shoulderLeft, "left");
handRight.connectToItem("left", shoulderRight, "right");

//HANDS
var hands = Scene.createItem("Cube");
shoulderLeft.connectToItem("right", hands, "left");
shoulderRight.connectToItem("left", hands, "right");

hands.connectToItem("bottom", body, "top");

//HEAD
var head = Scene.createItem("Cube", 0, 0, 2.0);
var eyeRight = Scene.createItem("Cube", -0.125, 0.25, 2.25);
eyeRight.setScale(0.25);
eyeRight.setColor(255, 0, 0);
var eyeLeft = Scene.createItem("Cube", 0.125, 0.25, 2.25);
eyeLeft.setScale(0.25);
eyeLeft.setColor(255, 0, 0);

head.add(eyeRight);
head.add(eyeLeft);

head.connectToItem("bottom", hands, "top");

//TEST rotateLocal FOR GROUPED OBJECTS
var flatHandLeftRotate = function() {
    palmLeft.rotateLocal(0, 0, 1, Math.PI * 0.5, 2, flatHandLeftRotate);
};

var flatHandRightRotate = function() {
    palmRight.rotateLocal(0, 0, 1, -Math.PI * 0.5, 2, flatHandRightRotate);
};

var handLeftRotate = function() {
    Scene.schedule(function() {
        handLeft.rotateLocal(1, 0, 0, -Math.PI * 0.5, 1, function() {
            handLeft.rotateLocal(1, 0, 0, Math.PI * 0.5, 1, handLeftRotate);
        });
    }, 1.5);
};

var handRightRotate = function() {
    Scene.schedule(function() {
        handRight.rotateLocal(1, 0, 0, -Math.PI * 0.5, 1, function() {
            handRight.rotateLocal(1, 0, 0, Math.PI * 0.5, 1, handRightRotate);
        });
    }, 1.5);
};

var shouldersRotate = function () {
    Scene.schedule(function () {
        hands.rotateLocal(0, 0, 1, Math.PI * 0.1, 2, function () {
            Scene.schedule(function () {
                hands.rotateLocal(0, 0, 1, -Math.PI * 0.2, 2, function () {
                    Scene.schedule(function () {
                        hands.rotateLocal(0, 0, 1, Math.PI * 0.1, 2, shouldersRotate);
                    }, 1);
                });
            }, 1);
        });
    }, 2);
};

var legTime = 0.8;
var distance = 0.9;
var legAngle = Math.PI * 0.25;
var i = 0;
var legRotate = function () {
    Scene.schedule(function () {
        body.moveLinearLocal(0, distance, 0, legTime * 2, null);
        head.say(says[i++]);
        legRight.rotateLocal(1, 0, 0, legAngle, legTime, null);
        legLeft.rotateLocal(1, 0, 0, -legAngle, legTime, function () {
            legRight.rotateLocal(1, 0, 0, -legAngle, legTime, null);
            legLeft.rotateLocal(1, 0, 0, legAngle, legTime, function () {
                Scene.schedule(function () {
                    head.say(says[i++]);
                    body.moveLinearLocal(0, distance, 0, legTime * 2, null);
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

//flatHandLeftRotate();
//flatHandRightRotate();

legRotate();
handLeftRotate();
handRightRotate();
shouldersRotate();
//eyeRightRotate();
//eyeLeftRotate();
