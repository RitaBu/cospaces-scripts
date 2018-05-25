let ratio: number = 0.5;

function fractal(item: Cuboid, level: number, scale: number): void {

    item.setScale(scale);
    item.setColor(50 + level * 50, 50, 50);
    item.addLocalRotation(0, 0, 0, 0, 0, 1, 0.1);
    if(level > 3) return;

    let cube0: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube1: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube2: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube3: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    let cube4: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;

    cube0.attachToItem('Bottom', item, 'Top');
    cube1.attachToItem('Bottom', item, 'Front');
    cube2.attachToItem('Bottom', item, 'Back');
    cube3.attachToItem('Bottom', item, 'Right');
    cube4.attachToItem('Bottom', item, 'Left');

    fractal(cube0, level + 1, scale * ratio);
    fractal(cube1, level + 1, scale * ratio);
    fractal(cube2, level + 1, scale * ratio);
    fractal(cube3, level + 1, scale * ratio);
    fractal(cube4, level + 1, scale * ratio);

    if(level == 0) {
        let cube5: Cuboid = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
        cube5.attachToItem('Bottom', item, 'Bottom');
        fractal(cube5, 1, scale * ratio);
    }
}

let cube: Cuboid = Scene.createItem('Cuboid', 0, 0, 1) as Cuboid;
fractal(cube, 0, 0.5);