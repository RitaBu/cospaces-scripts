var lion = Space.createItem('LP_Lion', 0, 0, 0);
lion.setProperty('age', 17);

// execute a function if the value of the age property changes
lion.onPropertyChanged('age', function() {
  lion.say('Uuuhhh! Partyyy!');
});

function lionAges() {
  lion.setProperty('age', parseInt(lion.getProperty('age')) + 1);
}

// lion ages after 2 seconds
Space.schedule(function() {
  lionAges();
}, 2);
