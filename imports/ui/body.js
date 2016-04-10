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
    // Meteor.subscribe('onlineusers');
  });

});

Template.Body.helpers({
  chatroom(){
    return Chatrooms.findOne({},{ sort: { createdAt: -1 } });
  },
});

//check whether the game is over
Tracker.autorun(function () {
  debugger;
  // let winFlag = false;
  // const chatroom = Chatrooms.findOne({});
  // if(chatroom&&chatroom.roomStatus === 'dialog'){
  //   if(isMurdererWin()){
  //     debugger;
  //     Meteor.call('dialogs.insert', '','System' , "Game is over, all police/citizens are killed. The winners are murderers");
  //     winFlag = true;
  //   }
  //   if(isCitizenWin()){
  //     debugger;
  //     Meteor.call('dialogs.insert', '','System' , "Game is over, all murderers are marked. The winners are police/citizens");
  //     winFlag = true;
  //   }
  //   //the game came is over
  //   if(winFlag){
  //     gameOver();
  //   }
  // };
  // function allRoleDead(playerList, role){
  //   let players = playerList.filter((player) => {
  //     return player.role === role;
  //   });
  //   if(players.every((player) => { return player.status !== 'alive'})){
  //     return true;
  //   };
  //   return false;
  // };
  // function isMurdererWin(){
  //   let chatroom = Chatrooms.findOne({});
  //   if(chatroom){
  //     let playerList = chatroom.playerList;
  //     if(allRoleDead(playerList,'citizen')
  //       ||allRoleDead(playerList,'police')){
  //       return true;
  //     }
  //   };
  //   return false;
  // };
  // function isCitizenWin(){
  //   let chatroom = Chatrooms.findOne({});
  //   if(chatroom){
  //     let playerList = chatroom.playerList;
  //     if(allRoleDead(playerList,'murderer')){
  //       return true;
  //     }
  //   };
  //   return false;
  // };
  // function gameOver(){
  //   let chatroom = Chatrooms.findOne({});
  //   if(chatroom){
  //     let playerList = chatroom.playerList;
  //     broadcastPlayers(getAllRole(playerList, 'murderer'),'murderers');
  //     broadcastPlayers(getAllRole(playerList, 'police'),'police');
  //     broadcastPlayers(getAllRole(playerList, 'citizen'),'citizens');
  //   }
  //   Meteor.call('chatrooms.setStatus', 'over');
  // };
  // function getAllRole(players, role){
  //   return players.filter( (player) => {
  //     return player.role === role;
  //   })
  // };
  // function broadcastPlayers(players, role){
  //   let msg = '';
  //   players.forEach(function (player) {
  //    msg += player.username+' ';
  //  });
  //   Meteor.call('dialogs.insert', '', 'System', 'The '+role+' are--- '+msg);
  // };
});