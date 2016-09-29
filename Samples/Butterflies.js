//http://newcospaces.dx.labs.intellij.net/#Project:CkTcwhNsVW0.GWs1ktTIKDY:B89ljVSJD95.HE9vtcbV1x4

var items = DX.items();
var bool = [false, false, false, false, false, false, false, false];
var free = [true, true, true, true, true, true, true, true];
var treeIdxs = [-1, -1, -1, -1, -1, -1, -1, -1];

function fly(index, item) {
  return function() {
    bool[index] = !bool[index];
    if (bool[index]) {
      item.flyLikeButterfly(0, 0, 3);
      free[treeIdxs[index]] = true;
    } else {
      var treeIdx;
      do {
        treeIdx = Math.floor(Math.random() * 8);
      } while (!free[treeIdx]);

      free[treeIdx] = false;
      treeIdxs[index] = treeIdx;

      var tree = items[treeIdx + 8];
      var pos = tree.position()
      item.flyLikeButterflyTo(pos[0], pos[1], 1.25);
    }
    DX.runLater(fly(index, items[index]), Math.random() * 40);
  };
}

for (i = 0; i < 8; i++) {
  DX.runLater(fly(i, items[i]), Math.random() * 10);
}