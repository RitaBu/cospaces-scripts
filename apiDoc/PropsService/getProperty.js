var lion = Space.createItem('LP_Lion', 0, 0, 0);

lion.setProperty('nickName', 'Simba');
lion.setProperty('age', 8);
lion.setProperty('favoriteMovie', 'The Lion King');

lion.say('My favorite movie is \'' + lion.getProperty('favoriteMovie') + '\'.');
