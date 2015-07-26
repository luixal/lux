Template.create_zone.helpers({
  zones: function() {
    refresh_zones_dropdown();
  }
});

Template.create_zone.events({
  'submit .new-zone': function(event) {
    event.preventDefault();
    // if not name, exiting:
    if (!event.target.zone_name.value) return;
    // else, creating zone with name:
    var zone = {name: event.target.zone_name.value};
    // if parent zone ID present, add it to zone:
    if (event.target.parentZone.value) zone.parentZone = event.target.parentZone.value;
    // calling server method to add zone to collection:
    Meteor.call('addZone', zone, function(error, result){
      if (!error) {
        refresh_zones_dropdown();
        event.target.zone_name.value = "";
      }
    });

    return false;
  }
});

function refresh_zones_dropdown(){
  Meteor.call('getZones', function(error, result){
    var html = '<option value="">Parent Zone</option>';
    for (var i = 0; i < result.length; i++) {
      html = html + '<option value="' + result[i]._id + '">' + result[i].name + '</option>';
    }
    $('#parentZone').html(html);
  });
}

// Zones Tree:
Template.zonesTree.onRendered(function() {
  Meteor.call('tree', function(error, result) {
    if (!error) {
      var treeData = {
        core: {
          data: result
        },
        plugins: ['search', 'state', 'wholerow']
      }
      //$.jstree.defaults.core.data = true;
      //$.jstree.defaults.core.plugins = ['search', 'state', 'wholerow'];
      this.$('#tree').jstree(treeData);
      // search plugin:
      var to = false;
      $('#tree-search').keyup(function () {
        if(to) { clearTimeout(to); }
        to = setTimeout(function () {
          var v = $('#tree-search').val();
          $('#tree').jstree(true).search(v);
        }, 250);
      });
      // listener for node selected:
      $('#tree').on('activate_node.jstree', function(e, data) {
        // node name on: data.node.text
        // node id on: data.node.id
      });
    } else {
      //TODO show popup error:
      console.log("ERROR! Couldn't load zones tree >> " + error);
    }
  });
});
