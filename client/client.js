Template.body.helpers({
  'loggedIn': function() {
    //console.log('>> ' + Meteor.role());
    return Meteor.userId();
  }
});

var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        this.render('landing');
      } else {
        if (pause.url === '/') {
          Router.go('dashboard');
        } else {
          this.next();
        }
      }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except: ['landing', 'registerIncidence']
});

Router.route('/', function() {
  //if (!Meteor.userId()) {
    this.render('landing');
  /*} else {
    this.render('map');
  }*/
}, { name: 'landing' });

Router.route('/map', function() {
  this.render('map');
});

Router.route('/users', function() {
  this.render('users');
});

Router.route('/zones', function() {
  this.render('zones');
});

Router.route('/systemLogs', function() {
  this.render('systemLogs');
});

Router.route('/inactive', function() {
  this.render('landingInactive');
});

Router.route('/dashboard', function() {
  this.render('dashboard');
});

Router.route('/registerIncidence/:luminaryId', function() {
  this.render('/registerIncidence', {data: this.params.luminaryId});
}, {name : 'registerIncidence'});

Template.landing.onRendered(function(){
  $('body').addClass('full');
});

Template.landing.onDestroyed(function(){
  $('body').removeClass('full');
});

Template.landingInactive.onRendered(function(){
  $('body').addClass('full');
  Accounts._loginButtonsSession.set('dropdownVisible', true);
});

Template.landingInactive.onDestroyed(function(){
  $('body').removeClass('full');
});
