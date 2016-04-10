import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Chatrooms } from '../api/chatrooms.js';

import './body.html';
import './chatroom/importantEvent.js';
import './chatroom/playerList.js';
import './chatroom/dialogShow.js';
import './chatroom/waiting.js';
import './vote/vote.js';

import '../startup/client/accounts-config.js';

Template.Body.onCreated(function bodyOnCreated() {
  this.autorun(() => {
    Meteor.subscribe('chatrooms');
  });

});

Template.Body.helpers({
  chatroom(){
    return Chatrooms.findOne({},{ sort: { createdAt: -1 } });
  },
});

