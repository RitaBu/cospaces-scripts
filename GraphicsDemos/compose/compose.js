var items = Scene.getItems();

var itemsCopy = items.map(function (item) {
  item.setOpacity(0);
  return Scene.copyItem(item);
});

items.forEach(function (item, index) {
  var xPos = Math.random() * 60 - 30;
  var yPos = Math.random() * 60 - 30;
  var angle = Math.random() * Math.PI * 2;

  item.setOpacity(1);
  item.addLocalRotation(0, 0, 0, 0, 0, 1, angle);
  item.setPosition(xPos, yPos, 0);

  (function (item, index) {
    var itemCopy = itemsCopy[index];
    var itemCopyPos = itemCopy.getPosition();
    item.moveTo(itemCopyPos.x, itemCopyPos.y, itemCopyPos.z, function () {
      var time = Math.random() * 2 + 3;
      item.rotateAs(itemCopy, time);
    });
  })(item, index);
});
