// Some helper functions
var Helper = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
};

// Classes: Host, Animal, Sound, Game
function Host(item) {
    this.item = item;
    this.isClickable = true;
    this.welcomeMessage = 'Hallo! Kannst du mir sagen, welches Tiergeräusch zu welchem Tier gehört? ' +
        'Du hörst gleich ein Geräusch. ' +
        'Tippe einfach auf das dazugehörige Tier. ' +
        'Bist du bereit? Klick auf mich und lass uns spielen!';
    this.nextTaskMessage = 'Super! Bereit für das nächste Tiergeräusch?';

    this.initialize = function() {
        this.bindEvents();
        this.showMessage(this.welcomeMessage);
    };

    this.bindEvents = function() {
        var self = this;

        this.item.activate(function() {
            if(self.isClickable) {
                self.item.say('');
                self.isClickable = false;
                game.removeAllSpeechBubbles();
                game.playRandomSound();
            }
        });
    };

    this.showMessage = function(message) {
        this.item.say(message);
    };

    this.sayLoud = function(sound) {
        sound.playSound();
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
                host.sayLoud(new Sound('correct', '729d3c7b54e2511e0d7b16352b869f74defb64d9d7448620ecd7fba4c45fbe94'));
                setTimeout(function() {
                    host.sayLoud(new Sound('try_another', '4754000a909e53bff10c57c0fd931a43615fa57987a5e89b3c78202a52009d3c'));
                }, 1800);
                self.item.say('Richtig!');
                host.showMessage(host.nextTaskMessage);
                host.isClickable = true;
            } else {
                self.item.say('Leider falsch. Versuche es nochmal!');
                host.sayLoud(new Sound('not_correct', 'e930c4b7700aa3d7a1d0d4da9f275f090c0b4bcc50356f5d32c309bd10bcd5ce'));
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
    this.lastSoundId = 'mouse';

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

    this.getLastSoundId = function() {
        return this.lastSoundId;
    };

    this.playRandomSound = function() {
        do {
            var randomIndex = Helper.getRandomInt(0, this.sounds.length);
            this.currentSoundId = this.sounds[randomIndex].getSoundId();
        } while(this.getCurrentSoundId() === this.getLastSoundId());

        this.sounds[randomIndex].playSound();
        this.lastSoundId = this.getCurrentSoundId();
    };

    this.removeAllSpeechBubbles = function() {
        this.host.removeSpeechBubble();
        this.animals.forEach(function(animal) {
            animal.removeSpeechBubble();
        });
    };

    this.isRightChoice = function(animalId) {
        return this.getCurrentSoundId() === animalId;
    };
}

// Initialize application.
var host = new Host(DX.item('FJNpNV30CN'));

var animals = [
    new Animal('elephant', DX.item('9np5tnExpc')),
    new Animal('dog', DX.item('VIkx0xO2XE')),
    new Animal('cat', DX.item('RbGraO0IGj')),
    new Animal('bear', DX.item('xVXDONVw9d')),
    new Animal('camel', DX.item('PTIQD6TUWU')),
    new Animal('horse', DX.item('EOBZ04u457')),
    new Animal('mouse', DX.item('LQMTggrwRe')),
    new Animal('lion', DX.item('kbSkFnaMZ5'))
];

var sounds = [
    new Sound('elephant', '3c1f08fc1ec0f02c149e46c497c4decef961188b1f17beed75e1aef95c81aae0'),
    new Sound('dog', '3857c9a5612fbec76981d73e724999bba698501cbbf26e4909a0c11a47b252a2'),
    new Sound('cat', 'adcc795ae4e726a98e58c8fab6e0e388666092ff4332e7f4cd0f69165549a54b'),
    new Sound('bear', 'df6b524bd6d05220d228acdffc2f12b47974fe1a4010d486168874ada178bf49'),
    new Sound('camel', 'a312a82af35e65faa83cd3ec17f0443958cd5be23c9a66738d7e4fc17087193c'),
    new Sound('horse', 'bd0166e10f6cb7fd5676d348ce6a3027f0dedea15a7ebb5e638c1c68f8d20be1'),
    new Sound('mouse', '23760f9ad986a00e2319466c29e5982823796e0b695ded5ebcfc3bf07ad3d40e'),
    new Sound('lion', 'be20e7e83b0074097d87337d36fd38ad2e14e18a5c090b487255c4e0eaac1444')
];

var game = new Game(host, animals, sounds);
game.initialize();
