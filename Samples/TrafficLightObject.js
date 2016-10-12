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
  setRed(this.getPart("red"));
  setGray(this.getPart("yellow"));
  setGray(this.getPart("green"));
}

function yellowRed() {
  setRed(this.getPart("red"));
  setYellow(this.getPart("yellow"));
  setGray(this.getPart("green"));
}

function yellow() {
  setGray(this.getPart("red"));
  setYellow(this.getPart("yellow"));
  setGray(this.getPart("green"));
}

function green() {
  setGray(this.getPart("red"));
  setGray(this.getPart("yellow"));
  setGreen(this.getPart("green"));
}

Obj.red = red;
Obj.yellowRed = yellowRed;
Obj.yellow = yellow;
Obj.green = green;