function fractal(item, level, scale, ratio, height) {

    item.setScale(scale);
    item.setHeight(height);
    item.setColor(150 * (level + 1) * 0.2, 75 * (level + 1) * 0.2, 0);
    item.addLocalRotation(0, 0, 0, 0, 0, 1, 0.1);
    if (level > 3) {
        var cube = Space.createItem("cube", 0, 0, 0);
        cube.setScale(3 * scale);
        cube.setColor(0, 255 * (1 - Math.random() * 0.25), 0);
        cube.adjustToItem("bottom", item, "top");
        return;
    }

    var pyramid = Space.createItem("Pyramid", 0, 0, 0);
    pyramid.setScale(scale);
    pyramid.setColor(150 * (level + 1) * 0.2, 75 * (level + 1) * 0.2, 0);
    pyramid.adjustToItem("bottom", item, "top");

    var cube0 = Space.createItem("FxCd", 0, 0, 0);
    var cube1 = Space.createItem("FxCd", 0, 0, 0);
    var cube2 = Space.createItem("FxCd", 0, 0, 0);
    var cube3 = Space.createItem("FxCd", 0, 0, 0);

    cube0.adjustToItem("bottom", pyramid, "face0");
    cube1.adjustToItem("bottom", pyramid, "face1");
    cube2.adjustToItem("bottom", pyramid, "face2");
    cube3.adjustToItem("bottom", pyramid, "face3");

    fractal(cube0, level + 1, scale * ratio, ratio, height);
    fractal(cube1, level + 1, scale * ratio, ratio, height);
    fractal(cube2, level + 1, scale * ratio, ratio, height);
    fractal(cube3, level + 1, scale * ratio, ratio, height);
}

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        fractal(Space.createItem("FxCd", 15 - 15 * i, 15 - 15 * j, 0), 0, 0.8, 0.55 + Math.random() * 0.15, 4 + Math.random() * 2);
    }
}
