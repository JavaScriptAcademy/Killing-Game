import './importantEvent.html';
import { Chatrooms } from '../../api/chatrooms.js';
import { Dialogs } from '../../api/dialogs.js';
import { Meteor } from  'meteor/meteor';

Template.ImportantEvent.onCreated(function eventCreated(){
  this.autorun(() => {
    Meteor.subscribe('onlineusers');
  });
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
  },
  'click #switchButton'(event){
    let time = Chatrooms.findOne({}).gameTime;
    console.log('time',time);
    let flag = 'day';
    if(time === 'night'){
      flag = 'day';
    }else{
      flag = 'night';
    }
    Meteor.call('chatrooms.setTime',flag);
    Meteor.call('dialogs.insert','','System','End of '+time+' !');
    Meteor.call('chatrooms.setStatus','vote');
  }
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
      if(currentPlayer[0].status === 'alive'){
        if(chatroom.gameTime==='day'&&currentPlayer[0].role === 'citizen'){
          Router.go('/waiting');
        }else{
          Router.go('/vote');
        }
      }
    }
  }
});
