var ratio = 0.5;
function fractal(item, level, scale) {

    item.setScale(scale);
    item.setColor(50 + level * 50, 50, 50);
    item.addLocalRotation(0, 0, 0, 0, 0, 1, 0.1);
    if (level > 3) return;

    var cube0 = Space.createItem("cube", 0, 0, 0);
    var cube1 = Space.createItem("cube", 0, 0, 0);
    var cube2 = Space.createItem("cube", 0, 0, 0);
    var cube3 = Space.createItem("cube", 0, 0, 0);
    var cube4 = Space.createItem("cube", 0, 0, 0);

    cube0.adjustToItem("bottom", item, "top");
    cube1.adjustToItem("bottom", item, "front");
    cube2.adjustToItem("bottom", item, "back");
    cube3.adjustToItem("bottom", item, "right");
    cube4.adjustToItem("bottom", item, "left");

    fractal(cube0, level + 1, scale * ratio);
    fractal(cube1, level + 1, scale * ratio);
    fractal(cube2, level + 1, scale * ratio);
    fractal(cube3, level + 1, scale * ratio);
    fractal(cube4, level + 1, scale * ratio);

    if (level == 0) {
        var cube5 = Space.createItem("cube", 0, 0, 0);
        cube5.adjustToItem("bottom", item, "bottom");
        fractal(cube5, 1, scale * ratio);
    }
}

var cube = Space.createItem("cube", 0, 0, 1);
fractal(cube, 0, 1);
