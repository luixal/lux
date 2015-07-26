Meteor.publish("usersData", function() {
  if (this.userId) {
    return Meteor.users.find({},{ fields: {
      'createdAt': 1,
      'emails': 1,
      'active': 1,
    }});
  } else {
    this.ready();
  }
});
