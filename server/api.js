Zones = new Mongo.Collection('zones');
Luminaries = new Mongo.Collection('luminaries');
Incidences = new Mongo.Collection('incidences');

var Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true
});

Api.addCollection(Zones, {
  routeOptions: {
    authRequired: true
  }
});

Api.addCollection(Luminaries, {
  routeOptions: {
    authRequired: true
  }
});

Api.addCollection(Incidences, {
  routeOptions: {
    authRequired: true
  }
});

Api.addRoute('structured_zones/:id', {}, {
  get: function() {
    return Meteor.call('subzones', this.urlParams.id);
  }
});
Api.addRoute('structured_zones', {}, {
  get: function() {
    return Meteor.call('subzones', null);
  }
})
