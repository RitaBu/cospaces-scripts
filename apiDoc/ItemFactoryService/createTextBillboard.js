var textBillboard = Scene.createTextBillboard(0, 0, 1);

textBillboard.setBackgroundColor(79, 44, 108);
textBillboard.setFontSize(0.3);
textBillboard.setLying(false);
textBillboard.setSize(2, 1);
textBillboard.setText('CoSpaces');
textBillboard.setTextColor(255, 255, 255);
textBillboard.setColor(0, 205, 170);
textBillboard.showPodium(true);

Space.log(textBillboard.text()); // CoSpaces
