Template.users.helpers({

  myCollection: function() {
    return Meteor.users.find({});
  },

  settings: function() {
    return {
      fields: [
        {
          key: 'username',
          label: 'Username',
          fn: function(value, object) { return object.username }
        },
        {
          key: 'email',
          label: 'E-Mail',
          fn: function(value, object) { return object.emails[0].address }
        },
        {
          key: 'verified',
          label: 'Verified',
          fn: function(value, object) { return (object.emails[0].verified) ? new Spacebars.SafeString("<font class='verified' color='green'>True</font>") : new Spacebars.SafeString("<font class='verified' color='red'>False</font>") }
        },
        {
          key: 'active',
          label: 'Active',
          fn: function(value, object) { return (object.active) ? new Spacebars.SafeString("<font class='active' color='green'>True</font>") : new Spacebars.SafeString("<font class='active' color='red'>False</font>") }
        },
        {
          key: 'name',
          label: 'Name',
          fn: function(value, object) { return object.profile.firstName + ' ' + object.profile.lastName }
        },
        {
          key: 'phone',
          label: 'Phone',
          fn: function(value, object) { return object.profile.phone }
        },
        {
          key: 'createdAt',
          label: 'Creation Date',
          fn: function(value, object) {
            return moment(object.createdAt).fromNow() + ': ' + moment(object.createdAt).format('DD/MM/YYYY HH:mm:ss');
          }
        },
      ]
    };
  }
});

Template.users.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();
    var post = this;
    // checks if the actual clicked element has the class `delete`
    if (event.target.className === 'active') {
      var username = this.username;
      var status = (this.active) ? 'INACTIVE' : 'ACTIVE';
        sweetAlert({
          title: username,
          text: "Are you sure you want to mark this user as <b>" + status + "</b>" ,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          closeOnConfirm: false,
          closeOnCancel: true,
          html: true
        },
        function(isConfirm){
          if (isConfirm) {
            sweetAlert({
              title: "Great!",
              text: "User " + username + " has been marked as <b>" + status + "</b>",
              html: true,
              type: "success"
            });
          }
        }
      );
    }
  }
});
