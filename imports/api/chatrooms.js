import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Chatrooms = new Mongo.Collection('chatrooms');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('chatrooms', function dialogsPublication() {
    return Chatrooms.find({});
  });
}

Meteor.methods({
  'chatrooms.insert'(roomName){
    Chatrooms.insert({
      roomName,
      'roomStatus': 'Ready',
      'playerList': [],
    });
  },
  'chatrooms.checkPlayer'(player){
     console.log('playerlist',Chatrooms.findOne({}).playerList);
     console.log('player',player);
     if(Chatrooms.findOne({}).playerList.indexOf(player) > -1){
      return true;
     }else{
      return false;
     }
  }
  // 'chatrooms.addPlayer'(player){
  //   console.log('playerlist',Chatrooms.findOne({}).playerList);
  //   console.log('player',player);
  //   if(Chatrooms.findOne({}).playerList.indexOf(player) < 0){
  //     Chatrooms.update({},{ $push: { 'playerList' : player }});
  //   }else{

  //   }
  // },
  // 'chatrooms.removePlayer'(player){
  //   console.log('remove player',player);
  //   Chatrooms.update({},{ $pull: { 'playerList' : player }});
  // }
});


