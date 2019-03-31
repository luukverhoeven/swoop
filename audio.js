pc.script.attribute('simpleGemSound', 'string');
pc.script.attribute('numSimpleGemSounds', 'number');
pc.script.attribute('megaGemSound', 'string');
pc.script.attribute('numMegaGemSounds', 'number');
pc.script.attribute('triggerBonusModeSound', 'string');
pc.script.attribute('cloudHitSound', 'string');
pc.script.attribute('groundHitSound', 'string');
pc.script.attribute('healSound', 'string');
pc.script.attribute('normalMusic', 'string');
pc.script.attribute('bonusMusic', 'string');
pc.script.attribute('clickSound', 'string');
pc.script.attribute('fuelAlarmSound', 'string');
pc.script.attribute('resetNotesTime', 'number', 0.8);

pc.script.create('audio', function (context) {
    var vector = new pc.Vec3();

    var Audio = function (entity) {
        this.entity = entity;
        this.lastPlayerPosition = new pc.Vec3();
    };

    Audio.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.game = context.root.findByName('Game').script.game;
            this.sounds = this.entity.findByName('Sounds').sound;
            this.music = this.entity.findByName('Music').sound;

            this.originalMusicVolume = this.music.volume;
            this.musicVolume = this.game.storage.loadNumber('music', this.originalMusicVolume);
            if (this.musicVolume > this.originalMusicVolume) {
                this.musicVolume = this.originalMusicVolume;
            }

            this.soundsVolume = this.game.storage.loadNumber('sounds', 1);

            this.game.on('splashscreen', this.onSplashScreen, this);
            this.game.on('pause', this.onPause, this);
            this.game.on('unpause', this.onUnpause, this);
            this.game.on('startgame', this.onStartGame, this);
            this.game.on('pickup', this.onCollectible, this);
            this.game.on('startbonus', this.onBonusStart, this);
            this.game.on('stopbonus', this.onBonusStop, this);
            this.game.on('reset', this.reset, this);
            this.game.on('collision', this.onCollision, this);
            this.game.on('fuelout', this.onFuelOut, this);
            this.game.on('fuellow', this.onLowFuel, this);
            this.game.on('gameover', this.gameover, this);

            this.reset();
        },

        onSplashScreen: function () {
            this.sounds.stop();
        },

        onPause: function () {
            this.sounds.pause();
        },

        onUnpause: function () {
            this.sounds.resume();
        },

        onStartGame: function () {
            this.sounds.play('engine');
        },

        onCollectible: function (collectible) {
            var sound;
            if (collectible.triggerBonusMode) {
                sound = this.triggerBonusModeSound;
            } else if (collectible.isHeal) {
                sound = this.healSound;
            } else if (collectible.isMegaGem) {
                sound = pc.string.format('{0}_{1}', this.megaGemSound, (this.megaGemSoundIndex + 1));
                this.megaGemSoundIndex = (this.megaGemSoundIndex + 1) % this.numMegaGemSounds;
                this.megaGemSoundTimer = this.resetNotesTime;
            } else {
                sound = pc.string.format('{0}_{1}', this.simpleGemSound, (this.simpleGemSoundIndex + 1));
                this.simpleGemSoundIndex = (this.simpleGemSoundIndex + 1) % this.numSimpleGemSounds;
                this.simpleGemSoundTimer = this.resetNotesTime;
            }

            this.playOneOffSound(sound);
        },

        onLowFuel: function () {
            this.playOneOffSound(this.fuelAlarmSound);
        },

        onFuelOut: function () {
            this.onLowFuel();
            this.onCollision();
        },

        playOneOffSound: function (sound) {
            this.sounds.play(sound);
        },

        playClickSound: function () {
            this.playOneOffSound(this.clickSound);
        },

        onBonusStart: function () {
            this.music.stop(this.normalMusic);
            this.music.play(this.bonusMusic);
        },

        onBonusStop: function () {
            this.music.stop(this.bonusMusic);
            this.music.play(this.normalMusic);
        },

        reset: function () {
            this.setMusicVolume(this.musicVolume);
            this.setSoundsVolume(this.soundsVolume);
            this.music.pitch = 1;
            this.music.play(this.normalMusic);
            this.sounds.slot('engine').pitch = 1;
            this.simpleGemSoundIndex = 0;
            this.megaGemSoundIndex = 0;
            this.simpleGemSoundTimer = 0;
            this.megaGemSoundTimer = 0;
            this.lastPlayerPosition.copy(this.game.player.entity.getPosition().clone());
        },

        onCollision: function (isSolidObstacle) {
            this.playOneOffSound(isSolidObstacle ? this.groundHitSound : this.cloudHitSound);
        },

        gameover: function () {
            var self = this;
            var music = this.music;
            var engine = this.sounds.slot('engine');

            var tween = new TWEEN.Tween({
                pitch: 1
            }).to({
                pitch: 0.1
            }, 2000).onUpdate(function () {
                engine.pitch = this.pitch;
                music.pitch = this.pitch;
            }).onComplete(function () {
                engine.pitch = 1;
                music.pitch = 1;
            }).start();
        },

        toggleMusic: function (on) {
            this.setMusicVolume(on ? this.originalMusicVolume : 0);
        },

        setMusicVolume: function (volume) {
            this.musicVolume = volume;
            this.music.volume = volume;
            this.game.storage.store('music', volume);
        },

        isMusicEnabled: function () {
            return !!this.musicVolume;
        },

        toggleSounds: function (on) {
            this.setSoundsVolume(on ? 1 : 0);
        },

        setSoundsVolume: function (volume) {
            this.soundsVolume = volume;
            this.sounds.volume = volume;
            this.game.storage.store('sounds', volume);
        },

        areSoundsEnabled: function () {
            return !!this.soundsVolume;
        },

        update: function (dt) {
            if (this.game.isOver) {
                return;
            }

            this.megaGemSoundTimer -= dt;
            if (this.megaGemSoundTimer <= 0) {
                this.megaGemSoundIndex = 0;
            }

            this.simpleGemSoundTimer -= dt;
            if (this.simpleGemSoundTimer <= 0) {
                this.simpleGemSoundIndex = 0;
            }

            var position = this.game.player.entity.getPosition();
            vector.sub2(position, this.lastPlayerPosition);

            this.lastPlayerPosition.copy(position);
        }
    };

    return Audio;
});