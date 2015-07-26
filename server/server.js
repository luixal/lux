Accounts.onCreateUser(function(options, user) {
  // building screenname string:
  var screenName;
  if (options.profile.firstName && options.profile.lastName) {
    screenName = options.profile.lastName + ", " + options.profile.firstName;
  } else {
    if (options.profile.firstName) screenName = options.profile.firstName;
    if (options.profile.lastName) screenName = options.profile.lastName;
  }
  // adding built screen name to profile:
  options.profile.name = screenName;
  if (options.profile) user.profile = options.profile;
  // marking user as inactive by default:
  user.active = false;
  return user;
});

Accounts.validateLoginAttempt(function(attempt) {
  return attempt.user.active;
});
