var imgId = '67d45f92ab27de23acb9e4ae0e8b2536a96296b24b91a5a7990a05b7a173783d';
var lion = Space.createItem('LP_Lion', 0, 0, 0);
lion.move(3, 5);

Space.schedule(function() {
  Project.finishPlayMode(imgId);
}, 3);
