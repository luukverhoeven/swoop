pc.script.create("fb-leaderboard", function (app) {

    FbLeaderboard = function () {
        this.data = [];
        this.picsCache = {};
    };

    FbLeaderboard.prototype = {
        refresh: function () {
            var self = this;
            self.data = [];

            // get scores for all your friends
            var path = pc.string.format('/{0}/scores', window.FB_APP_ID);
            FB.api(path, 'get', function (response) {
                self.parse(response.data, function () {
                    app.fire("fb:leaderboard:refresh", self);
                });
            });
        },

        parse: function (data, callback) {
            var self = this;
            var total = data.length;

            data.forEach(function (entry, index) {
                var id = entry.user.id;

                var item = {
                    id: entry.user.id,
                    name: entry.user.name,
                    score: entry.score
                };
                self.data.push(item);


                if (self.picsCache[id]) {
                    item.image = self.picsCache[id];

                    total--;
                    if (total <= 0) {
                        self.addDebugData();
                        callback();
                    }

                } else {
                    var path = pc.string.format('/{0}/picture', id);
                    FB.api(path, function (response) {
                        if (response && !response.error) {
                            var pic = new pc.Asset('picture_' + id, 'texture');
                            pic.file = {
                                url: response.data.url
                            };
                            app.assets.add(pic);

                            item.image = pic;
                            self.picsCache[id] = pic;
                        }

                        total--;
                        if (total <= 0) {
                            self.addDebugData();
                            callback();
                        }
                    });
                }
            });
        },

        addDebugData: function () {
            return;
            var id = null;
            for (var key in this.picsCache) {
                id = key;
                break;
            }

            if (! id)
                return;

            // debug
            this.data.push({
                id: '12312132312',
                name: 'John Smith',
                score: 500,
                image: this.picsCache[id]
            });
            this.data.push({
                id: '122312132312',
                name: 'Maria Smith',
                score: 40,
                image: this.picsCache[id]
            });

            this.data.push({
                id: '122312132312',
                name: 'Will Smith',
                score: 406,
                image: this.picsCache[id]
            });

            this.data.push({
                id: '122312132312',
                name: 'Someone Else',
                score: 10,
                image: this.picsCache[id]
            });

            this.data.push({
                id: '122312132312',
                name: 'Yet Another',
                score: 100,
                image: this.picsCache[id]
            });

            this.data.push({
                id: '122312132312',
                name: 'Yet Another',
                score: 50,
                image: this.picsCache[id]
            });

            this.sort();
        },

        sort: function () {
            this.data.sort(function (a, b) {
                return (b.score - a.score);
            });
        }
    };

    var leaderboard = new FbLeaderboard();
    app.on("fb:login", function () {
        leaderboard.refresh();
    });

    app.on('fb:leaderboard', leaderboard.refresh, leaderboard);

    // submit score
    app.on('highscore', function (score) {
        if (! score)
            return;

        var uid = FB.getUserID();
        if (! uid)
            return;

        var path = pc.string.format('/{0}/scores', uid);
        FB.api(path, 'post', {
            score: score
        }, function (response) {
            if (response.error) {
                console.error(response);
            } else {
                console.log('submitted score');
            }
        });
    });

    FbLeaderboardScript = function (entity) {
    };
    return FbLeaderboardScript;

});
