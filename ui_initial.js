pc.script.create('ui_initial', function (app) {
    var Ui_initial = function (entity) {
        this.entity = entity;
    };

    Ui_initial.prototype = {
        initialize: function () {
            this.playButton = this.entity.findByName('SpritePlay').script.sprite;
            this.playButton.on('click', this.onPlayClicked, this);
            this.game = app.root.findByName('Game').script.game;

            // this.fbButton = this.entity.findByName('SpriteLogin').script.sprite;
            // this.fbButton.entity.enabled = false;
            // this.fbButton.on('click', this.onFbClicked, this);
            // app.on('fb:init', this.onFbInit, this);
            // app.on('fb:login', this.onFbLogin, this);
        },

        onPlayClicked: function () {
            this.game.audio.playClickSound();
            this.game.startGame();
        },

        // onFbInit: function () {
        //     var self = this;
        //     app.fb.getLoginStatus(function (loggedin) {
        //         self.fbButton.entity.enabled = !loggedin;
        //     });
        // },

        // onFbLogin: function () {
        //     this.fbButton.entity.enabled = false;
        // },

        // onFbClicked: function () {
        //     app.fb.login();
        // },

        update: function (dt) {
            if (app.keyboard.wasPressed(pc.input.KEY_SPACE) ||
                app.keyboard.wasPressed(pc.input.KEY_RETURN)) {
                this.onPlayClicked();
            }
        }
    };

    return Ui_initial;
});
