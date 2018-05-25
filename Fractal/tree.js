function fractal(item: Cuboid, level: number, scale: number, ratio: number, height: number): void {

    item.setScale(scale);
    item.setHeight(height);
    item.setColor(150 * (level + 1) * 0.2, 75 * (level + 1) * 0.2, 0);
    item.addLocalRotation(0, 0, 0, 0, 0, 1, 0.1);
    if(level > 3) {
        let cube: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
        cube.setScale(1.5 * scale);
        cube.setColor(0, 255 * (1 - Math.random() * 0.25), 0);
        cube.attachToItem('Bottom', item, 'Top');
        return;
    }

    let pyramid: Frustum = Scene.createItem('Frustum', 0, 0, 0) as Frustum;
    pyramid.setSize(0.25 * Math.sqrt(2), 0, 1, 0.25 * Math.sqrt(2));
    pyramid.setScale(scale);
    pyramid.setColor(150 * (level + 1) * 0.2, 75 * (level + 1) * 0.2, 0);
    pyramid.attachToItem('Bottom', item, 'Top');

    let cube0: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube1: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube2: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube3: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;

    cube0.attachToItem('Bottom', pyramid, 'Face0');
    cube1.attachToItem('Bottom', pyramid, 'Face1');
    cube2.attachToItem('Bottom', pyramid, 'Face2');
    cube3.attachToItem('Bottom', pyramid, 'Face3');

    fractal(cube0, level + 1, scale * ratio, ratio, height);
    fractal(cube1, level + 1, scale * ratio, ratio, height);
    fractal(cube2, level + 1, scale * ratio, ratio, height);
    fractal(cube3, level + 1, scale * ratio, ratio, height);
}

for(let i: number = 0; i < 3; i++) {
    for(let j: number = 0; j < 3; j++) {
        fractal(Scene.createItem('Cuboid', 15 - 15 * i, 15 - 15 * j, 0), 0, 0.8, 0.55 + Math.random() * 0.15, 4 + Math.random() * 2);
    }
}