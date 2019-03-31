pc.script.create('fb_utils', function (app) {
    app.fb = {
        login: function () {
            FB.login(function () {
                app.fire('fb:login');
            }, {
                scope: 'email, user_friends, publish_actions'
            });
        },

        getLoginStatus: function (callback) {
            FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        }
    };

    app.on('fb:init', function () {
        app.fb.getLoginStatus(function (loggedin) {
            if (loggedin)
                app.fire('fb:login');
        });
    });

    var Fb_utils = function (entity) {
        this.entity = entity;
    };

    return Fb_utils;
});
