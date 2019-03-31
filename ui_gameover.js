pc.script.create('ui_gameover', function (app) {
    var Ui_gameover = function (entity) {
        this.entity = entity;
        this.score = 0;
    };

    Ui_gameover.prototype = {
        initialize: function () {
            var self = this;

            this.game = app.root.findByName('Game').script.game;

            this.quitButton = this.entity.findByName('SpriteExit').script.sprite;
            this.restartButton = this.entity.findByName('SpriteRestart').script.sprite;
            this.shareButtonFb = this.entity.findByName('SpriteShareFb').script.sprite;
            this.shareButtonTwitter = this.entity.findByName('SpriteShareTwitter').script.sprite;
            this.spriteGameover = this.entity.findByName('SpriteGameover').script.sprite;
            this.spriteHighscore = this.entity.findByName('SpriteHiscore').script.sprite;
            this.spriteScoreBg = this.entity.findByName('SpriteScoreBg').script.sprite;
            this.spriteHighScoreBg = this.entity.findByName('SpriteHiScoreBg').script.sprite;
            this.scoreText = this.entity.findByName('TextScore').script.font_renderer;
            this.scoreTextShadow = this.entity.findByName('TextScoreShadow').script.font_renderer;
            this.leaderboadButton = this.entity.findByName('SpriteLeaderboard').script.sprite;

            this.restartButton.on('click', this.onRestartClicked, this);
            this.quitButton.on('click', this.onQuitClicked, this);
            this.shareButtonFb.on('click', this.onShareFbClicked, this);
            this.shareButtonTwitter.on('click', this.onShareTwitterClicked, this);
            this.leaderboadButton.on('click', this.onLeaderboardClicked, this);

            this.leaderboadButton.entity.enabled = false;
            this.shareButtonFb.entity.enabled = false;

            if (this.game.microgame) {
                this.shareButtonTwitter.entity.enabled = false;
            }

            app.on('fb:login', function () {
                self.leaderboadButton.entity.enabled = true;
                self.shareButtonTwitter.entity.enabled = false;
                self.shareButtonFb.entity.enabled = true;
            });

            if ((/iphone|ipod|ipad|android|iemobile|silk|mobile/).test(navigator.userAgent.toLowerCase())) {
                // use leadbolt
                this.ad = app.root.findByName("Game").script.ad;
            } else {
                // use Google IMA
                // load google script
                var script = document.createElement("script");
                script.setAttribute("src", "http://imasdk.googleapis.com/js/sdkloader/ima3.js");
                document.head.appendChild(script);

                this.ad = app.root.findByName("Game").script.gima;

                app.on("fb:login", function () {
                    this._fb = true;
                }, this);
            }

        },

        onRestartClicked: function () {
            this.game.audio.playClickSound();
            this.game.restart();
        },

        onQuitClicked: function () {
            this.game.audio.playClickSound();
            this.game.splashScreen();
        },

        onShareFbClicked: function () {
            this.game.audio.playClickSound();

            FB.ui({
                method: 'share_open_graph',
                action_type: 'swooop-playcanvas:share',
                action_properties: JSON.stringify({
                    'score': {
                        'og:title': 'Can you beat my score?',
                        'og:image': 'https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/swooop/swooop_1024.png',
                        'og:description': 'I just scored ' + this.score + ' on Swooop',
                        'fb:app_id': window.FB_APP_ID
                    },
                })
            }, function(response) {
                if (response.error) {
                    console.error(response.error);
                    FB.ui({
                        method: 'share',
                        href: "https://apps.facebook.com/swooop-playcanvas",
                    });
                }
            });
        },

        onShareTwitterClicked: function () {
            window.open(pc.string.format("https://twitter.com/intent/tweet?text=I%20just%20scored%20{0}%20in%20Swooop%20by%20@playcanvas.%20Beat%20that!%20http://swooop.playcanvas.com", this.score));
        },

        onLeaderboardClicked: function () {
            this.game.fire('leaderboard');
        },

        setScore: function (score, isHighScore) {
            this.score = score;
            var txt = score.toString();
            this.scoreText.text = txt;
            this.scoreTextShadow.text = txt;
            this.spriteGameover.entity.enabled = !isHighScore;
            this.spriteHighscore.entity.enabled = isHighScore;
            this.spriteScoreBg.entity.enabled = !isHighScore;
            this.spriteHighScoreBg.entity.enabled = isHighScore;
        },

        onEnable: function () {
            if (this.ad && this.ad.canShow()) {
                var music = this.game.audio.isMusicEnabled();
                var sounds = this.game.audio.areSoundsEnabled();

                this.game.audio.toggleMusic(false);
                this.game.audio.toggleSounds(false);
                this.ad.show();
                this.ad.on("complete", function () {
                    this.game.audio.toggleMusic(music);
                    this.game.audio.toggleSounds(sounds);
                }, this);
            }
        }
    };

    return Ui_gameover;
});
