ymaps.modules.define('MultiRouteColorizer', [
    'util.defineClass'
], function (provide, defineClass) {
    function Colorizer (multiRoute) {
        this.multiRoute = multiRoute;

        multiRoute.events
            .add("update", this.onMultiRouteUpdate, this)
            .add("activeroutechange", this.onActiveRouteChange, this);

        this.activeRoute = multiRoute.getActiveRoute();
        this.colorize();
    }

    Colorizer.suburbanPreset = {
        strokeWidth: 7,
        strokeColor: "#000000",
        strokeStyle: "solid"
    };

    Colorizer.busPreset = {
        strokeWidth: 7,
        strokeColor: "#0085FA",
        strokeStyle: "solid"
    };

    Colorizer.walkPreset = {
        strokeWidth: 7,
        strokeColor: "#333333",
        strokeStyle: "solid"
    };

    defineClass(Colorizer, {
        onActiveRouteChange: function () {
            this.uncolorize();
            this.activeRoute = this.multiRoute.getActiveRoute();
            this.colorize();

            if (this.activeRoute) {
                this.multiRoute.getMap().setBounds(this.activeRoute.getBounds());
            }
        },

        onMultiRouteUpdate: function () {
            this.colorize();
        },

        colorize: function () {
            if (this.activeRoute) {
                this.activeRoute.getPaths().each(function (path) {
                    path.getSegments().each(function (segment) {
                        var segmentType = segment.properties.get("type");
                        if (segmentType == "transport") {
                            this.colorizeTransportSegment(segment);
                        } else {
                            segment.options.set({ preset: Colorizer.walkPreset });
                        }
                    }, this)
                }, this);
            }
        },

        uncolorize: function () {
            if (this.activeRoute) {
                this.activeRoute.getPaths().each(function (path) {
                    path.getSegments().each(function (segment) {
                        segment.options.unset("preset")
                    }, this)
                }, this);
            }
        },

        destroy: function () {
            this.uncolorize();
            this.multiRoute.events
                .remove("update", this.onMultiRouteUpdate, this)
                .remove("activeroutechange", this.onActiveRouteChange, this);
        },

        colorizeTransportSegment: function (segment) {
            var transport = segment.properties.get("transports")[0];
            if (transport.type == "suburban") {
                segment.options.set({ preset: Colorizer.suburbanPreset });
            } else if (transport.type == "underground") {
                segment.options.set({
                    preset: {
                        strokeWidth: 7,
                        strokeColor: transport.Style.color
                    }
                });
            } else {
                segment.options.set({ preset: Colorizer.busPreset });
            }
        }
    });

    provide(Colorizer);
});
