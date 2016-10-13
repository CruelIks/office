//"auto" - автомобильная маршрутизация;
//"masstransit" - маршрутизация с использованием общественного транспорта;
//"pedestrian" - пешеходная маршрутизация.
function OfficeMap (map) {
    this._map = map;
    this._officeAddress = "Нижний Новгород, Московский вокзал";
    this._addresses = {
		"Нижний Новгород, Касьянова 6": 'masstransit', 
		"Нижний Новгород, Маршала Жукова 8": 'masstransit'
	};
	this._routes = [];

    this.redraw = function () {
    	var routes = this._routes;

    	for (var i = 0; i < routes.length; i++) {
    		if (this.routes[i]) {
           		this._map.geoObjects.remove(this.routes[i]);
        	}	
    	}
    	if (this._officeAddress) {
    		var isFirst = true;
			for (var address in this._addresses) {
				var multiRoute = new ymaps.multiRouter.MultiRoute({
		        referencePoints: [
		            address,
		            this._officeAddress
		        ],
		        params: {
		            routingMode: 'auto',
		            avoidTrafficJams: true,
		            results: 1
		        }
			    }, {
			        boundsAutoApply: true,
			        wayPointFinishVisible:false,
			        //wayPointIconContentLayout: ymaps.templateLayoutFactory.createClass('{{ properties.address|route#title }}') 
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