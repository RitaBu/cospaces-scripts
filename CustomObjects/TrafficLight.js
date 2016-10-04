function setRed(light) {
  light.setColor(254, 0, 0);
}

function setYellow(light) {
  light.setColor(254, 221, 0);
}

function setGreen(light) {
  light.setColor(0, 254, 0);
}

function setGray(light) {
  light.setColor(211, 211, 211);
}

function red() {
  setRed(this.part("red"));
  setGray(this.part("yellow"));
  setGray(this.part("green"));
}

function yellowRed() {
  setRed(this.part("red"));
  setYellow(this.part("yellow"));
  setGray(this.part("green"));
}

function yellow() {
  setGray(this.part("red"));
  setYellow(this.part("yellow"));
  setGray(this.part("green"));
}

function green() {
  setGray(this.part("red"));
  setGray(this.part("yellow"));
  setGreen(this.part("green"));
}

Obj.red = red;
Obj.yellowRed = yellowRed;
Obj.yellow = yellow;
Obj.green = green;