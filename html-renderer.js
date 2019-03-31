pc.script.attribute("htmlAsset", "asset", null, {type: "html"});

pc.script.create('html_renderer', function (app) {
    // Creates a new Html_renderer instance
    var Html_renderer = function (entity) {
        this.entity = entity;
    };

    Html_renderer.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            if (this.htmlAsset) {
                this.html = app.assets.get(this.htmlAsset);
                this.html.on("change", function () {
                    this.template();
                }, this);
            }

            this.template();
        },

        template: function () {
            if (this.parent) {
                this.parent.parentNode.removeChild(this.parent);
            }

            this.parent = document.createElement("div");
            this.parent.id = this.entity.getName();
            this.parent.classList.add("html-asset");

            var content = this.html.resource;
            this.parent.innerHTML = content;

            var imgs = this.parent.querySelectorAll("img[data-asset]");
            for (var i = 0; i < imgs.length; i++) {
                try {
                    var id = parseInt(imgs[i].getAttribute("data-asset"), 10);
                    var asset = app.assets.get(id);
                    if (asset)
                        imgs[i].src = app.assets.get(id).file.url;
                } catch (e) {
                    console.error(e);
                }
            }

            document.body.appendChild(this.parent);
        }
    };

    return Html_renderer;
});
