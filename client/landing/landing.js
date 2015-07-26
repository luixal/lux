Template.landing.events({
  'click #btn_login': function() {
    Accounts._loginButtonsSession.set('inSignupFlow', false);
    Template._loginButtons.toggleDropdown();
    return false;
  },

  'click #btn_register': function() {
    Accounts._loginButtonsSession.set('inSignupFlow', true);
    Template._loginButtons.toggleDropdown();
    return false;
  }
});
