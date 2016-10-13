//"auto" - автомобильная маршрутизация;
//"masstransit" - маршрутизация с использованием общественного транспорта;
//"pedestrian" - пешеходная маршрутизация.
function OfficeMap (map) {
    this._map = map;
    this._officePoint = null;
    this._addresses = {
		"Нижний Новгород, Касьянова 6": 'masstransit',
		"Нижний Новгород, Маршала Жукова 8": 'masstransit'
	};
	this._routes = [];

    this.redraw = function (coords) {
        if (coords) {
            this._officePoint.geometry.setCoordinates(coords);
        }

    	var routes = this._routes;

    	for (var i = 0; i < routes.length; i++) {
    		if (this._routes[i]) {
           		this._map.geoObjects.remove(this._routes[i]);
        	}	
    	}
        test = ymaps.templateLayoutFactory.createClass('{{ properties.duration.text }}');
    	if (this._officePoint) {
    		var isFirst = true;
			for (var address in this._addresses) {
				var multiRoute = new ymaps.multiRouter.MultiRoute({
		        referencePoints: [
		            address,
		            this._officePoint
		        ],
		        params: {
		            routingMode: this._addresses[address],
		            avoidTrafficJams: true,
		            results: 1
		        }
			    }, {
			        boundsAutoApply: true,
			        wayPointFinishVisible:false,
			        //wayPointIconContentLayout: ymaps.templateLayoutFactory.createClass('{{ properties.address|route#title|properties.duration.text  }}'),
                    // wayPointIconContentLayout: test,
                    // IconContentLayout: test,
                    // routeBalloonContentLayout: test,
                    // balloonLayout: test,
                    // balloonPanelMaxMapArea: 0
			        //wayPointVisible: false
			    });
			    routes.push(multiRoute);
			    this._map.geoObjects.add(multiRoute);
			}

			if (routes) {
				ymaps.modules.require([
			        'MultiRouteColorizer'
			    ], function (MultiRouteColorizer) {
			    	for (var route in this.routes) {
			        	new MultiRouteColorizer(route);
			        }
			    });
			}
		}
    }
};