pc.script.create("ui-leaderboard", function (app) {
    var UiLeaderboardScript = function (entity) {
        this.entity = entity;
        this.template = null;
        this.container = null;
    };

    UiLeaderboardScript.prototype = {
        initialize: function () {
            this.game = app.root.findByName('Game').script.game;
            this.template = this.entity.findByName('Template');
            this.template.enabled = false;
            app.on('fb:leaderboard:refresh', this.onLeaderboardRefresh, this);

            app.loader._handlers['texture'].crossOrigin = true;

            var bthRestart = this.entity.findByName('SpriteRestart').script.sprite;
            bthRestart.on('click', function () {
                this.game.audio.playClickSound();
                this.game.restart();
            }, this);

            var bthQuit = this.entity.findByName('SpriteQuit').script.sprite;
            bthQuit.on('click', function () {
                this.game.audio.playClickSound();
                this.getUi().showScreen('gameover');
            }, this);
        },

        getUi: function () {
            return this.entity.getParent().script.ui;
        },

        onEnable: function () {
            var self = this;

            if (this.container) {
                this.container.destroy();
                this.container = null;
            }

            setTimeout(function () {
               if (self.entity.enabled) {
                    // refresh leaderboard
                    app.fire('fb:leaderboard');
                }
            });
        },

        // onDisable: function () {
        //     if (! this.children)
        //         return;

        //     var children = this.children.getChildren();
        //     var i = children.length;
        //     while(i--) {
        //         children[i].enabled = false;
        //         children[i].destroy();
        //     }
        // },

        onLeaderboardRefresh: function (leaderboard) {
            if (! this.entity.enabled) return;

            var me = FB.getUserID();

            var entriesBeforeMe = 3;
            var entriesAfterMe = 3;
            var spacing = 70;
            var top = -200;

            var items = leaderboard.data;

            if (!items.length) {
                return;
            }

            this.container = new pc.Entity();
            this.container.name = 'container';
            this.entity.addChild(this.container);

            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i].id === me) {

                    for (var j = i - entriesBeforeMe; j <= i + entriesAfterMe; j++) {
                        if (j < 0) {
                            entriesBeforeMe--;
                            entriesAfterMe++;
                            continue;
                        }

                        if (j < items.length) {
                            this.createEntry(j + 1, items[j], top);
                        } else {
                            this.createInvite(top);
                            break;
                        }

                        top -= spacing;
                    }

                    break;
                }
            }
        },

        createInvite: function (top) {
            var clone = this.template.clone();
            this.container.addChild(clone);
            clone.enabled = true;

            clone.findByName('TextScore').enabled = false;
            clone.findByName('TextPosition').enabled = false;
            clone.findByName('TextName').enabled = false;
            clone.findByName('SpritePicture').enabled = false;

            var invite = clone.findByName('SpriteInvite').script.sprite;
            invite.y += top;

            var highscore = this.game.getHighScore();
            var msg = highscore ?
                'My best score is ' + highscore + ', can you beat it?' :
                "I think you'll like SWOOOP!";

            invite.on('click', function () {
                FB.ui({method: 'apprequests',
                  message: msg
                }, function(response){
                });
            });
        },

        createEntry: function (position, data, top) {
            var clone = this.template.clone();
            this.container.addChild(clone);
            clone.enabled = true;

            var pos = clone.findByName('TextPosition').script.font_renderer;
            pos.text = '#' + position;
            pos.y += top;

            var score = clone.findByName('TextScore').script.font_renderer;
            score.text = data.score.toString();
            score.y += top;

            var name = clone.findByName('TextName').script.font_renderer;
            name.text = data.name.toUpperCase();
            name.y += top;

            var picture = clone.findByName('SpritePicture').script.sprite;
            picture.y += top;
            picture.setTextureAsset(data.image);

            clone.findByName('SpriteInvite').enabled = false;
        }
    };

    return UiLeaderboardScript;
});
