// Some helper functions
var Helper = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
};

// Classes: Host, Animal, Sound, Game
function Host(item) {
    this.item = item;
    this.welcomeMessage = 'Hallo! Kannst du mir sagen, welches Tiergeräusch zu welchem Tier gehört? ' +
        'Du hörst gleich ein Geräusch. ' +
        'Tippe einfach auf das dazugehörige Tier. ' +
        'Bist du bereit? Dann lass uns spielen!';

    this.initialize = function() {
        this.bindEvents();
        this.showMessage(this.welcomeMessage);
    };

    this.bindEvents = function() {
        var self = this;

        this.item.activate(function() {
            self.item.say('');
            game.playRandomSound();
        });
    };

    this.showMessage = function(message) {
        this.item.say(message);
    };

    this.removeSpeechBubble = function() {
        this.item.say('');
    };
}

function Animal(animalId, item) {
    this.animalId = animalId;
    this.item = item;

    this.initialize = function() {
        this.bindEvents();
    };

    this.bindEvents = function() {
        var self = this;

        this.item.activate(function() {
            game.removeAllSpeechBubbles();
            if(game.isRightChoice(self.getAnimalId())) {
                self.item.say('Richtig!');
                game.playRandomSound();
            } else {
                self.item.say('Leider falsch. Versuche es nochmal!');
            }
        });
    };

    this.getAnimalId = function() {
        return this.animalId;
    };

    this.removeSpeechBubble = function() {
        this.item.say('');
    };
}

function Sound(id, soundClipId) {
    this.id = id;
    this.soundClip = DX.resource(soundClipId);

    this.getSoundId = function() {
        return this.id;
    };

    this.playSound = function() {
        this.soundClip.play();
    };
}

function Game(host, animals, sounds) {
    this.host = host;
    this.animals = animals;
    this.sounds = sounds;
    this.currentSoundId;

    this.initialize = function() {
        var self = this;

        this.removeAllSpeechBubbles();

        this.host.initialize();

        this.animals.forEach(function(animal) {
            animal.initialize();
        });
    };

    this.getCurrentSoundId = function() {
        return this.currentSoundId;
    };

    this.playRandomSound = function() {
        var randomIndex = Helper.getRandomInt(0, this.sounds.length);
        this.currentSoundId = this.sounds[randomIndex].getSoundId();
        this.sounds[randomIndex].playSound();
    };

    this.removeAllSpeechBubbles = function() {
        this.host.removeSpeechBubble();
        this.animals.forEach(function(animal) {
            animal.removeSpeechBubble();
        });
    };

    this.isRightChoice = function(animalId) {
        if(this.getCurrentSoundId() === animalId) {
            return true;
        } else {
            return false;
        }
    };
}

// Initialize application.
var host1 = DX.item('FJNpNV30CN');
var animal1 = DX.item('9np5tnExpc'); // Elephant
var animal2 = DX.item('VIkx0xO2XE'); // Dog
var animal3 = DX.item('RbGraO0IGj'); // Cat
var animal4 = DX.item('xVXDONVw9d'); // Bear
var animal5 = DX.item('PTIQD6TUWU'); // Camel
var animal6 = DX.item('EOBZ04u457'); // Horse
var animal7 = DX.item('LQMTggrwRe'); // Mouse

var host = new Host(host1);

var animals = [
    new Animal('elephant', animal1),
    new Animal('dog', animal2),
    new Animal('cat', animal3),
    new Animal('bear', animal4),
    new Animal('camel', animal5),
    new Animal('horse', animal6),
    new Animal('mouse', animal7)
];

var sounds = [
    new Sound('elephant', '3c1f08fc1ec0f02c149e46c497c4decef961188b1f17beed75e1aef95c81aae0'),
    new Sound('dog', '3857c9a5612fbec76981d73e724999bba698501cbbf26e4909a0c11a47b252a2'),
    new Sound('cat', 'adcc795ae4e726a98e58c8fab6e0e388666092ff4332e7f4cd0f69165549a54b'),
    new Sound('bear', 'df6b524bd6d05220d228acdffc2f12b47974fe1a4010d486168874ada178bf49'),
    new Sound('camel', 'a312a82af35e65faa83cd3ec17f0443958cd5be23c9a66738d7e4fc17087193c'),
    new Sound('horse', 'bd0166e10f6cb7fd5676d348ce6a3027f0dedea15a7ebb5e638c1c68f8d20be1'),
    new Sound('mouse', '23760f9ad986a00e2319466c29e5982823796e0b695ded5ebcfc3bf07ad3d40e')
];

var game = new Game(host, animals, sounds);
game.initialize();
