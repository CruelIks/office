function init () {
    

    ymaps.modules.require([
        'MultiRouteColorizer'
    ], function (MultiRouteColorizer) {
        //new MultiRouteColorizer(multiRoute);
    });

    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 2,
        controls: []
    }, {
        buttonMaxWidth: 300
    });

    var officeTextbox = new ymaps.control.SearchControl({
        options: {
            useMapBounds: true,
            noCentering: true,
            noPopup: true,
            noPlacemark: true,
            placeholderContent: 'Адрес офиса',
            size: 'large',
            float: 'none',
            position: { left: 100, top: 44 }
        }
    });

    officeTextbox.events.add('resultselect', function (e) {
            var results = officeTextbox.getResultsArray(),
                selected = e.get('index'),
                point = results[selected].geometry.getCoordinates();
                officeMap._officeAddress = results[selected];
                officeMap.redraw();
        })
        .add('load', function (event) {
            if (!event.get('skip') && officeTextbox.getResultsCount()) {
                officeTextbox.showResult(0);
            }
        });

    var officeMap = new OfficeMap(myMap);
    officeMap.redraw();

    myMap.controls.add(officeTextbox);
    
    var trafficControl = new ymaps.control.TrafficControl({ state: {
        providerKey: 'traffic#actual',
        trafficShown: false
    }});
    myMap.controls.add(trafficControl);
    trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true);    
}

ymaps.ready(init);