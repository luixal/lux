Meteor.methods({
  'subzones': function(id) {
    // if not ID provided, return full zones tree:
    if (!id) {
      var results = new Array();
      // getting root zones (zones with no parentZone field):
      var rootZones = Zones.find({parentZone: {$exists: false}});
      // getting subtree for each root zone and adding it to results array:
      rootZones.forEach(function(rootZone){
        results.push(Meteor.call('build_nested_subzones_array', rootZone._id));
      });
      // returning response:
      if (results.length > 0) {
        return {status: 'success', data: results};
      } else {
        return {
          statusCode: 404,
          body: {status: 'fail', message:'No zones'}
        }
      }
    // if we have an ID, use that zone as root and return that zones subtree:
    } else {
      var zone = Meteor.call('build_nested_subzones_array', id);
      if (zone) {
        return {status: 'success', data: zone};
      } else {
        return {
          statusCode: 404,
          body: {status: 'fail', message:'No zone with id ' + id}
        }
      }
    }
  },

  // aux method, should be just a javascript function:
  'build_nested_subzones_array': function(id) {
    var zone = Zones.findOne(id);
    zone.subzones = new Array();
    var subzonesCursor = Zones.find({parentZone: zone._id});
    if (subzonesCursor.count() > 0) {
      subzonesCursor.forEach(function(subzone) {
        zone.subzones.push(Meteor.call('build_nested_subzones_array', subzone._id));
      });
    }
    return zone;
  },

  'getZones': function() {
    return Zones.find().fetch();
  },

  'addZone': function(zone) {
    Zones.insert(zone);
  },


  // jsTree generation code:
  'tree': function(id) {
    // if not ID provided, return full zones tree:
    if (!id) {
      var results = new Array();
      // getting root zones (zones with no parentZone field):
      var rootZones = Zones.find({parentZone: {$exists: false}});
      // getting subtree for each root zone and adding it to results array:
      rootZones.forEach(function(rootZone){
        results.push(Meteor.call('subtree', rootZone._id));
      });
      // returning response:
      if (results.length > 0) {
        return results;
      } else {
        return false;
      }
    // if we have an ID, use that zone as root and return that zones subtree:
    } else {
      var zone = Meteor.call('subtree', id);
      if (zone) {
        return zone;
      } else {
        return false;
      }
    }
  },

  // aux method, should be just a javascript function:
  'subtree': function(id) {
    var zone = Zones.findOne(id);
    zone.children = new Array();
    var subzonesCursor = Zones.find({parentZone: zone._id});
    if (subzonesCursor.count() > 0) {
      subzonesCursor.forEach(function(subzone) {
        zone.children.push(Meteor.call('subtree', subzone._id));
      });
    }
    // adding fields needed for jstree:
    zone.id = zone._id;
    zone.text = zone.name;
    // if has children, adding how many to the name:
    //var children = Zones.find({parentZone: zone._id}).count();
    var children = Luminaries.find({zone: zone._id}).count();
    if (children > 0) zone.text += ' (' + children + ')';

    return zone;
  },

  'addLuminary': function(luminary) {
    Luminaries.insert(luminary);
  },

  'getLuminaries': function() {
    return Luminaries.find({}).fetch();
  },

  'getLuminariesByZone': function(zoneId) {
    // return Luminaries.find().fetch();
    var results = new Array();
    var luminaries = Luminaries.find({zone: zoneId});
    luminaries.forEach(function(luminary) {
      luminary.incidences = new Array();
      luminary.incidences = Incidences.find({luminaryId: luminary._id}).fetch();
      results.push(luminary);
    });
    return results;
    // return Luminaries.find({zone: zoneId}).fetch();
  }

});
