import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Chatrooms } from '../../api/chatrooms.js';
import { Users } from  '../../api/users.js';

import './playerList.html';
Template.PlayerList.onCreated(function createPlayerlist(){
  this.autorun(() => {
    Meteor.subscribe('onlineusers');
  });
});

Template.PlayerList.helpers({
 participants() {
  console.log(Meteor.users.find({ "status.online": true }).count());
  return Meteor.users.find({ "status.online": true }).fetch();
 },
});