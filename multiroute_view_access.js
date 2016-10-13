function init () {
    
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
                officeMap._officePoint = results[selected];
                officeMap.redraw(point);
        })
        .add('load', function (event) {
            if (!event.get('skip') && officeTextbox.getResultsCount()) {
                officeTextbox.showResult(0);
            }
        });
    officePoint = new ymaps.Placemark([56.32386095093268, 43.95450537026966]);
    myMap.geoObjects.add(officePoint);
    
    var officeMap = new OfficeMap(myMap);
    officeMap._officePoint = officePoint;
    officeMap.redraw();

    myMap.controls.add(officeTextbox);
    
    var trafficControl = new ymaps.control.TrafficControl({ state: {
        providerKey: 'traffic#actual',
        trafficShown: false
    }});
    myMap.controls.add(trafficControl);
    trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true);

    myMap.events.add("click", function (event) {
        //officeMap._officePoint.geometry.setCoordinates(event.get('coords'));
        officeMap.redraw(event.get('coords'));
    });
}

ymaps.ready(init);