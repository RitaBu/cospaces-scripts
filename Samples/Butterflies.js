//https://newcospaces.dx.labs.intellij.net/#Project:CkTcwhNsVW0.GWs1ktTIKDY:B89ljVSJD95.HE9vtcbV1x4

var butterfly = Space.getItem("yAv6S4NU8p");
var items = [butterfly];

var tree = Space.getItem("BGkOM-4zZgw.C6EO0xxP9K3");
var trees = [tree];


var bool = [false, false, false, false, false, false, false, false];
var free = [true, true, true, true, true, true, true, true];
var treeIdxs = [-1, -1, -1, -1, -1, -1, -1, -1];

function fly(index, item) {
  return function() {
    bool[index] = !bool[index];
    if (bool[index]) {
      item.moveBezierCircle(0, 0, 3);
      item.playIdleAnimation("Fly");

      free[treeIdxs[index]] = true;
      Space.schedule(fly(index, items[index]), Math.random() * 40);
    } else {
      var treeIdx = 0;
      /*var treeIdx;
       do {
       treeIdx = Math.floor(Math.random() * 8);
       } while (!free[treeIdx]);*/

      free[treeIdx] = false;
      treeIdxs[index] = treeIdx;

      var stop = function() {
        items[index].animateToState("Stand");
        Space.schedule(fly(index, items[index]), 5);
      };

      var tree = trees[treeIdx];
      item.moveBezierToObj(tree, "Top", stop);
    }
  };
}

for (i = 0; i < 1; i++) {
  Space.schedule(fly(i, items[i]), Math.random() * 5);
}