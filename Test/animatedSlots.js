//https://newcospaces.dx.labs.intellij.net/Studio/Space/CkTcwhNsVW0.GWs1ktTIKDY:Ivoc3z56BbsY5uCApfyR4t

//man1
var manBlue = Scene.createPerson("MASCULINE", "ADULT", 0, 0);
manBlue.setColor(0, 0, 255);
manBlue.setScale(4);
manBlue.setPosition(10, 0, 0);

var glasses = Scene.createItem("LP_VRGlasses", 0, 1, 0);
glasses.setScale(3);
glasses.connectToItem("Nose", manBlue, "Eyes");


//man2
var manYellow = Scene.createPerson("MASCULINE", "ADULT", 0, 0);
manYellow.setColor(255, 255, 0);
manYellow.setScale(4);
manYellow.setPosition(5, 0, 0);

var cube0 = Scene.createItem("CheckerChip", 0, 0, 0);
cube0.setScale(2.4);
cube0.connectToItem("Bottom", manYellow, "Top");

var cube1 = Scene.createItem("CheckerChip", 0, 0, 0);
cube1.setScale(1.2);
cube1.connectToItem("Bottom", cube0, "Top");

cube0.addLocalPosition(0, 0, -0.05);

var manGreen = Scene.createPerson("MASCULINE", "ADULT", 0, 0);
manGreen.setColor(0, 255, 0);
manGreen.setScale(0.5);
manGreen.connectToItem("Bottom", cube1, "Top");

var cube2 = Scene.createItem("CheckerChip", 0, 0, 0);
cube2.setScale(0.3);
cube2.connectToItem("Bottom", manGreen, "Top");

var cube3 = Scene.createItem("CheckerChip", 0, 0, 0);
cube3.setScale(0.15);
cube3.connectToItem("Bottom", cube2, "Top");

cube2.addLocalPosition(0, 0, -0.005);

Scene.schedule(function () {
    manYellow.animateToState("Vaj");
    manGreen.animateToState("Vaj");
    manBlue.animateToState("Vaj");
}, 3);

//balance
var balanceBlue = Scene.createItem("Balance", 0, 0, 0);
balanceBlue.setColor(0, 0, 255);
balanceBlue.setScale(3);

var cubeRed = Scene.createItem("cube", 0, 0, 0);
cubeRed.setColor(255, 0, 0);
cubeRed.connectToItem("Bottom", balanceBlue, "Top1");

var cubeGreen = Scene.createItem("cube", 0, 0, 0);
cubeGreen.setColor(0, 255, 0);
cubeGreen.connectToItem("Bottom", balanceBlue, "Top2");

var balanceYellow = Scene.createItem("LP_Balance", 0, 0, 0);
balanceYellow.setColor(255, 255, 0);
balanceYellow.setScale(1);
balanceYellow.connectToItem("Bottom", cubeRed, "Top");
balanceYellow.rotateLocal(0, 0, 1, Math.PI, 0, function () {});

var cubeWhite = Scene.createItem("cube", 0, 0, 0);
cubeWhite.setColor(255, 255, 255);
cubeWhite.setScale(0.3);
cubeWhite.connectToItem("Bottom", balanceYellow, "Top1");

var cubeBlack = Scene.createItem("cube", 0, 0, 0);
cubeBlack.setColor(0, 0, 0);
cubeBlack.setScale(0.3);
cubeBlack.connectToItem("Bottom", balanceYellow, "Top2");

Scene.schedule(function () {
    balanceBlue.setLeft();
    balanceYellow.setLeft();
}, 2);

Scene.schedule(function () {
    balanceBlue.setBalance();
    balanceYellow.setBalance();
}, 4);

//treasure box
var treasureBox = Scene.createItem("LP_TreasureBox", -5, 0, 0);
treasureBox.setColor(127, 255, 127);
treasureBox.setScale(3);

var cubeBlue = Scene.createItem("cube", 0, 0, 0);
cubeBlue.setColor(0, 0, 255);
cubeBlue.setScale(0.3);
cubeBlue.connectToItem("Bottom", treasureBox, "Top");
