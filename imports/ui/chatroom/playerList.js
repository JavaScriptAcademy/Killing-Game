import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Chatrooms } from '../../api/chatrooms.js';
import { Users } from  '../../api/users.js';

import './playerList.html';
Template.PlayerList.onCreated(function createPlayerlist(){
  this.autorun(() => {
    Meteor.subscribe('onlineusers');
  });

  this.getRoomHolder = () => {
    var holder = Meteor.users.findOne({ "status.online": true });
    if(holder){
      return holder.username;
    }else{
      return '';
    };
  };
  this.getCurrentUserRole = () => {
    debugger;
    let chatroom = Chatrooms.findOne({});
    let currentUser = Meteor.user();
    if(chatroom){
      let playerFind = chatroom.playerList.filter(function(player){
        return player.username === currentUser.username;
      });
      return playerFind[0].role;
    }else{
      return '';
    }
  };
});

Template.PlayerList.helpers({
 onlineUsers(){
  return Meteor.users.find({ "status.online": true }).fetch();
 },
 participants() {
  let chatroom = Chatrooms.findOne({});
  if(chatroom){
    return chatroom.playerList;
  }
  },
 gameStart(){
  if(Chatrooms.findOne({})){
    if(Chatrooms.findOne({}).roomStatus === 'Start')
    return true;
  }else{
    return false;
  }
 },
 isRoomHolder(username){
  const instance = Template.instance();
  if(username === instance.getRoomHolder()){
    return true;
  }else{
    return false;
  }
 },
 showMurder(){
  const instance = Template.instance();
  return instance.getCurrentUserRole() === 'murder';
 },
 showPolice(){
  const instance = Template.instance();
  return instance.getCurrentUserRole() === 'police';
 },
 isMurder(role){
  return role === 'murder';
 },
 isPolice(role){
  return role === 'police';
 }
});