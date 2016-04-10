import './importantEvent.html';
import { Chatrooms } from '../../api/chatrooms.js';
import { Dialogs } from '../../api/dialogs.js';
import { Meteor } from  'meteor/meteor';

let countdown;

Template.ImportantEvent.onCreated(function eventCreated(){
  this.autorun(() => {
    Meteor.subscribe('onlineusers');
  });
  countdown = new ReactiveCountdown(30);
  countdown.start(function() {
    console.log('time ends');
    let time = Chatrooms.findOne({}).gameTime;
    if(time === 'day'){
      Meteor.call('chatrooms.setStatus','vote');
    }
  });
});

Template.ImportantEvent.onRendered(function listsShowPageOnRendered() {
  console.log('entered onRendered');
  // countdown.stop(()=>);

});

Template.ImportantEvent.helpers({
  gameStart(){
    if(Chatrooms.findOne({})){
      return Chatrooms.findOne({}).roomStatus !== 'ready';
    }else{
      return '';
    }
  },
  daytime(){
    if(Chatrooms.findOne({})){
      return Chatrooms.findOne({}).gameTime === 'day';
    }else{
      return '';
    }
  },
  getCountdown() {
   return countdown.get();
  },
});

Template.ImportantEvent.events({
  'click #startButton'(event){
    Meteor.call('chatrooms.setStatus','Start');
    Meteor.call('dialogs.insert','','System','Game start!');
    //set role to player
    let players = Meteor.users.find({ "status.online": true }).fetch();
    let playerNum = players.length;
    let murderNum = policeNum = parseInt(playerNum/3);
    let index = 0;
    let playerList = [];
    for(;index<murderNum;index++){
      let newPlayer = {
        username:players[index].username,
        role:'murderer',
        status:'alive',
        voted:'false',
      };
      playerList.push(newPlayer);
    };
    for(;index<murderNum+policeNum;index++){
      // Meteor.call('chatrooms.insertPlayer',players[index].username,'police');
      let newPlayer = {
        username:players[index].username,
        role:'police',
        status:'alive',
        voted:'false',
      };
      playerList.push(newPlayer);
    }
    for(;index<playerNum;index++){
      // Meteor.call('chatrooms.insertPlayer',players[index].username,'citizen');
      let newPlayer = {
        username:players[index].username,
        role:'citizen',
        status:'alive',
        voted:'false',
      };
      playerList.push(newPlayer);
    }
    Meteor.call('chatrooms.insertPlayers',playerList);
    Meteor.call('chatrooms.setStatus','vote');
  },
});

//route to vote page when vote begins. citizen will be routed to waiting page
Tracker.autorun(function () {
  let chatroom = Chatrooms.findOne({});
  let currentuser = Meteor.user();
  if(chatroom){
    let status = chatroom.roomStatus;
    if(status === 'vote'){
      let players = chatroom.playerList;
      let currentPlayer = players.filter((player) => {
        return player.username === currentuser.username;
      });

      //only player alive can vote
      if(currentPlayer[0]&&currentPlayer[0].status === 'alive'){
        if(chatroom.gameTime==='night'&&currentPlayer[0].role === 'citizen'){
          Router.go('/waiting');
        }else{
          Router.go('/vote');
        }
      }
    }
  }
});
