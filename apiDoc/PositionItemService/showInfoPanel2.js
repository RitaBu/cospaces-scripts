var lion = Space.createItem('LP_Lion', 0, 0, 0);

// Set up arguments for the showInfoPanel() method call.
var config = {
  title: 'Panthera leo',
  imgId: '1932c8e1308811e7cc87a01d096c07b7c1dab7af7c9d7e786a96b1ceb5d58d4b',
  description: 'The lion is one of the big cats in the genus Panthera and a member of the family Felidae. The commonly used term African lion collectively denotes the several subspecies in Africa.',
  autoHide: true,
  onHide: function() {
    lion.say('Info panel closed.');
  }
};

// Show the info panel by clicking on the lion.
lion.onActivate(function() {
  lion.showInfoPanel(config.title, config.imgId, config.description, config.autoHide, config.onHide);
});
