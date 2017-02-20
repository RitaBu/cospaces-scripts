var voltSeq = [
  Space.getItem('11enBREUY6'),
  Space.getItem('UJrmZKCLq5'),
  Space.getItem('ps9fmH1Mle'),
  Space.getItem('86tJAgFR3y'),
  Space.getItem('x974MUvKl0'),
  Space.getItem('6NzrG0cNBY'),
  Space.getItem('pJyF6sbk3H'),
  Space.getItem('yjZxEZBTVu'),
  Space.getItem('r7xtoR9N5Q'),
  Space.getItem('fewduIY9Ci')
];

var index = 0;
Space.scheduleRepeating(function () {
  for (var i = 0; i < voltSeq.length; i++) {
    if (index % 10 === i) {
      voltSeq[i].setScale(10);
    } else {
      voltSeq[i].setScale(0);
    }
  }
  index++;
}, 1 / 10);
