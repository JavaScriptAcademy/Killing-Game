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
  return Meteor.users.find({ "status.online": true }).fetch();
 },
 roomHolder(){
  var holder = Meteor.users.findOne({ "status.online": true });
  if(holder){
    return holder;
  }else{
    return '';
  }
 }
});