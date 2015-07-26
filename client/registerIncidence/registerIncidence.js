var MESSAGE_SUCCESS = "A ticket has been registered on this luminary";
var SUB_MESSAGE_SUCCESS = "We will sortly pass by to check it out and fit it";
var ICON_SUCCESS = '/imgs/logo_2.png';

var MESSAGE_FAIL = "Sorry, we can't register the ticket right now";
var SUB_MESSAGE_FAIL = "Please, try again later";
var ICON_FAIL = '/imgs/error_circle.png';

Template.registerIncidence.helpers({
  message: function() {
    if (Luminaries.find({_id: Template.currentData()}).count() > 0) return MESSAGE_SUCCESS;
    return MESSAGE_FAIL;
  },

  submessage: function() {
    if (Luminaries.find({_id: Template.currentData()}).count() > 0) return SUB_MESSAGE_SUCCESS;
    return SUB_MESSAGE_FAIL;
  },

  icon: function() {
    if (Luminaries.find({_id: Template.currentData()}).count() > 0) return ICON_SUCCESS;
    return ICON_FAIL;
  }
});

Template.registerIncidence.onRendered(function() {
  var luminaryId = Template.currentData();
  if (Luminaries.find({_id: luminaryId}).count() > 0) {
    Incidences.insert({
      luminaryId: luminaryId,
      createdAt: new Date()
    });
  }
});
