import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Chatrooms = new Mongo.Collection('chatrooms');

// export const Scores = new Mongo.Collection('scores', {connection: null});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('chatrooms', function dialogsPublication() {
    return Chatrooms.find({});
  });
  //  Meteor.publish('scores', function scoresPublication() {
  //   return Scores.find({});
  // });
}

Meteor.methods({
  'chatrooms.insert'(roomName){
    Chatrooms.insert({
      roomName,
      'roomHolder': '',
      'gameTime':'day',
      'roomStatus': 'ready',
      'playerList': [],
    });
  },
  'chatrooms.removeAll'(){
    Chatrooms.remove({});
  },
  'chatrooms.setRoomHolder'(player){
    Chatrooms.update({},{ $set: {roomHoldr:player}});
  },
  'chatrooms.setStatus'(status){
     Chatrooms.update({},{$set:{roomStatus:status}});
  },
  'chatrooms.setTime'(time){
   Chatrooms.update({},{$set:{gameTime:time}});
  },
  'chatrooms.clearVoted'(){
    let playerList = Chatrooms.findOne({}).playerList;
    playerList.forEach(function (player) {
      player.voted = 'false';
    });
    Chatrooms.update({},{ $set: { playerList: playerList}});
  },
  'chatrooms.setPlayerStatus'(playername,param,voted){
    let playerList = Chatrooms.findOne({}).playerList;
    playerList.forEach(function (player) {
      if(player.username === playername){
        console.log('set voted of player',player.username);
        player[param] = voted;
      }
    });
    Chatrooms.update({},{$set:{playerList:playerList}});
  },
  'chatrooms.insertPlayer'(username,role){
    const player = {
      username,
      role,
      status:'alive',
      voted:'false',
    };
    Chatrooms.update({},{ $push: { 'playerList' : player }});
  },
  'chatrooms.insertPlayers'(players){
    console.log('players',players);
    players.forEach((player) =>{
      Chatrooms.update({},{ $push: { 'playerList' : player }});
    });
  },
});


