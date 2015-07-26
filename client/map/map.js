Luminaries = new Mongo.Collection('luminaries');
Incidences = new Mongo.Collection('incidences');

Template.mapView.onRendered(function() {
  GoogleMaps.load();
});

Template.mapView.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    // aux variables:
    var userMarker;
    var markers = new Object();
    var bounds = initBounds;
    var MAX_ZOOM = 17;
    var currentZone = setCurrentZone( $('#tree').jstree("get_selected")[0] );
    // observers handlers:
    var luminariesObserverHandler;
    var incidencesObserverHandler;

    $('#tree').on('activate_node.jstree', function(e, data) {
      if (currentZone === data.node.id) return;
      setCurrentZone(data.node.id);
    });

    function setCurrentZone(zoneId) {
      // remove existing markers:
      removeMarkers();
      // stop observer handerls:
      if (luminariesObserverHandler) luminariesObserverHandler.stop();
      if (incidencesObserverHandler) incidencesObserverHandler.stop();

      currentZone = zoneId;
      // Luminaries collection observer:
      luminariesObserverHandler = Luminaries.find({zone: currentZone}).observe({
        added: function(luminary) {
          addMarker(
            luminary.latitude,
            luminary.longitude,
            'imgs/markers/resized/marker_green.png',
            {
              id: luminary._id,
              name: luminary.name
            }
          );
          initBounds();
          map.instance.fitBounds(bounds);
        },

        removed: function(luminary) {
          markers[luminary._id].setMap(null);
          delete markers[luminary._id];
        },

        changed: function(luminary, oldLuminary) {
          delete markers[oldLuminary._id];
          var marker = markers[oldLuminary._id];
          marker.extra.name = luminary._id;
          marker.setPosition({
            lat: luminary.latitude,
            lng: luminary.longitude
          });
          initBounds();
          map.instance.fitBounds(bounds);
        }
      });

      // Incidences collection observer (filtered by luminaries in collection):
      var init = true;
      var luminariesIds = Luminaries.find({zone: currentZone}).map( function(x) {return x._id;})
      incidencesObserverHandler = Incidences.find( { "luminaryId" : { $in: luminariesIds } } ).observe({

        added: function(incidence) {
          markers[incidence.luminaryId].setIcon(getIncidenceIcon(incidence));
          if (!init) FlashMessages.sendWarning('New incidence registered on luminary: <b>' + incidence.luminaryId) + '</b>';
        },

        removed: function(incidence) {
          markers[incidence.luminaryId].setIcon('imgs/markers/resized/marker_green.png');
        },

        changed: function(incidence, oldIncidence) {
          markers[incidence.luminaryId].setIcon(getIncidenceIcon(incidence));
        }
      });
      init = false;
    }

    function addMarker(lat, lng, icon, extra) {
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, lng),
        map: map.instance,
        icon: icon,
        extra: extra
      });

      google.maps.event.addListener(marker, 'click', function(event){
        // generating message for info window:
        var htmlContent = 'Luminary ID: <b>' + marker.extra.id + '</b><br>Luminary Name: <b>' + marker.extra.name + '</b>';
        var incidences = Incidences.find({luminaryId: marker.extra.id}, {sort: {createdAt: -1}}).fetch();
        if (incidences.length > 0) {
          htmlContent += '<br><p style="color: #ff0000">Incidences Registered: <b>' + incidences.length + '</b><br>Last Incidence registered ' + moment(incidences[0].createdAt).fromNow() + ': <b>' + moment(incidences[0].createdAt).format('DD/MM/YYYY hh:mm:ss') + '</b></p>'
        }
        // showing info window:
        var infoWindow = new google.maps.InfoWindow({
          content: htmlContent
        });
        infoWindow.open(map.instance, marker);
      });

      markers[marker.extra.id] = marker;
      return marker;
    }

    function removeMarkers() {
      for (markerId in markers) {
        markers[markerId].setMap(null);
      }
      markers = new Object();
    }

    function initBounds() {
      // creating new bounds object:
      bounds = new google.maps.LatLngBounds();
      // populating bounds object:
      for (var markerId in markers) {
        bounds.extend(markers[markerId].position);
      }
      // appling bounds and setting maximum zoom level if necessary:
      if (Object.keys(markers).length > 0) {
        map.instance.panToBounds(bounds);
        var listener = google.maps.event.addListener(map.instance, "idle", function() {
          map.instance.setZoom(Math.min(MAX_ZOOM, map.instance.getZoom()));
          google.maps.event.removeListener(listener);
        });
      }
    }

    function getIncidenceIcon(incidence) {
      var diffDays = dateDiffInDays(incidence.createdAt, new Date())
      if (diffDays === 0) return 'imgs/markers/resized/marker_orange.png';
      if (diffDays > 0) return 'imgs/markers/resized/marker_red_exclamation.png';
    }

    function dateDiffInDays(date) {
      var MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      // var diffTime = Math.abs(date.getTime() - (new Date()).getTime());
      // var diffDays = Math.round(diffTime / MS_PER_DAY);
      // return diffDays;
      var now = new Date();
      var utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
      var utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

      return Math.floor((utc2 - utc1) / MS_PER_DAY);
    }

    // add user location on map:
    navigator.geolocation.getCurrentPosition(function(position) {
      var position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      userMarker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: position,
        map: map.instance,
        icon: 'imgs/markers/resized/marker_user_2.png',
        extra: {
          id: 'user',
          name: 'User'
        }
      });
      map.instance.setCenter(position);
      map.instance.setZoom(MAX_ZOOM);
    });

  });
});

Template.mapView.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
});

// Template.mapView.events({
//   'click #btn-find-me': function() {
//     console.log('find me!');
//     map.instance.setCenter(userMarker.position);
//     map.instance.setZoom(MAX_ZOOM);
//   }
// });
