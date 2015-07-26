Accounts.ui.config({
  requestPermissions: {},
  passwordSignupFields: 'USERNAME_AND_EMAIL',
  forceEmailLowercase: true,
  forceUsernameLowercase: true,
  forcePasswordLowercase: true,
  extraSignupFields: [{
    fieldName: 'firstName',
    fieldLabel: 'First name',
    inputType: 'text',
    visible: true,
  }, {
    fieldName: 'lastName',
    fieldLabel: 'Last name',
    inputType: 'text',
    visible: true,
  }, {
    fieldName: 'phone',
    fieldLabel: 'Phone Number',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (value && (value.length >= 9)) {
        return true;
      } else {
        errorFunction('Phone number must have at leat 9 digits');
        return false;
      }
    }
  }]
});
//accountsUIBootstrap3.setLanguage('es');
