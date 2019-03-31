window.FB_APP_ID = "438089083007435";

pc.script.create('fb_ui', function (app) {
    var Fb_ui = function (entity) {
        this.entity = entity;
    };

    Fb_ui.prototype = {
        initialize: function () {
            var self = this;
            this._ready = false;

            app.on("fb:init", function () {
                this._ready = true;
                FB.getLoginStatus(self.loginChangeFn);
            }, this);

            this._loginHandler = null;
            this._logoutHandler = null;

            this.loginChangeFn = this.loginChangeFn.bind(this);
        },

        loginChangeFn: function (response) {
            if (response.status === "connected") {
                this.showLogout();
                this.hideLogin();
                app.fire("fb:login");
            } else {
                this.showLogin();
                this.hideLogout();
                app.fire("fb:logout");
            }
        },

        showLogin: function () {
            var self = this;

            var login = document.querySelector(".fb-login");
            if (login) {
                login.style.display = "block";
                if (!this._loginHandler) {
                    this._loginHandler = function () {
                        FB.login(self.loginChangeFn, {
                            scope: 'email, user_friends, publish_actions'
                        });
                    };
                    var button = login.querySelector(".fb-button");
                    button.addEventListener("click", this._loginHandler);
                }
            }
        },

        hideLogin: function () {
            var login = document.querySelector(".fb-login");
            if (login) {
                login.style.display = "none";
            }
        },

        showLogout: function () {
            var self = this;
            var logout = document.querySelector(".fb-logout");
            if (logout) {
                logout.style.display = "block";
                if (!this._logoutHandler) {
                    this._logoutHandler = function () {
                        FB.logout(self.loginChangeFn);
                    };
                    var button = logout.querySelector(".fb-button");
                    button.addEventListener("click", this._logoutHandler);
                }
            }
        },

        hideLogout: function () {
            var logout = document.querySelector(".fb-logout");
            if (logout) {
                logout.style.display = "none";
            }
        },

        update: function  () {
            var path;
            if (app.keyboard.wasPressed(pc.KEY_S)) {
                path = pc.string.format('/{0}/scores', window.FB_APP_ID);
                FB.api(path, 'post', {
                    score: 100
                }, function (response) {
                    console.log(response);
                    if (response.error) {
                        FB.login(self.loginChangeFn, {
                            scope: 'email, user_friends, publish_actions'
                        });
                    }
                });
            }

            if (app.keyboard.wasPressed(pc.KEY_L)) {
                path = pc.string.format('/{0}/scores', "438089083007435");
                FB.api(path, 'get', function (response) {
                    console.log(response);
                });
            }
        }
    };

    return Fb_ui;
});
