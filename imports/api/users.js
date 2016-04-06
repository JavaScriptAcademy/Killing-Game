import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('onlineusers', function findOnlineUser() {
    return Meteor.users.find({ "status.online": true });
  });
};

// Meteor.methods({

// });


