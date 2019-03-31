var _fbEnabled = false;
if (_fbEnabled) {
    var _fb = false;
    var _pc = false;
    var _app = null;
    var _inst = null;

    window.FB_APP_ID = "438089083007435";

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '438089083007435',
            xfbml      : true,
            version    : 'v2.5'
        });

        _fb = true;

        if (_fb && _pc) {
            _inst.fbInitialize();
        }
    };

    window.pcAsyncInit = function (inst) {
        _pc = true;
        _inst = inst;
        if (_fb && _pc) {
            _inst.fbInitialize();
        }
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    pc.script.create('facebook_setup', function (app) {
        var Facebook_setup = function (entity) {
            this.entity = entity;
            this._initialized = false;
        };

        Facebook_setup.prototype = {
            postInitialize: function () {
                window.pcAsyncInit(this);
            },

            fbInitialize: function () {
                app.fire("fb:init");

            }
        };

        return Facebook_setup;
    });

}
