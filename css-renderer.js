pc.script.attribute("cssAsset", "asset", null, {type: "css"});

pc.script.create('css_renderer', function (app) {
    // Creates a new Css_renderer instance
    var Css_renderer = function (entity) {
        this.entity = entity;
    };

    Css_renderer.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.css = app.assets.get(this.cssAsset);
            if (this.css) {
                this.css.on("change", this.template, this);
            }

            this.template();
        },

        template: function () {
            if (this.el) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = pc.createStyle(this.css.resource);
            document.head.appendChild(this.el);
        }
    };

    return Css_renderer;
});
