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
},

Meteor.methods({
  'chatrooms.insert'(roomName){
    Chatrooms.insert({
      roomName,
      'roomHolder': '',
      'gameTime':'day',
      'roomStatus': 'Ready',
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
  'chatrooms.insertPlayer'(username,role){
    const player = {
      username,
      role,
      status:'alive',
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


