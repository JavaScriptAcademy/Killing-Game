import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import '../imports/api/dialogs.js';
import '../imports/api/chatrooms.js';
import '../imports/api/users.js';
import '../imports/api/scores.js';
import '../imports/startup/server/initData.js';

Meteor.startup(() => {
  // code to run on server at startup
});
