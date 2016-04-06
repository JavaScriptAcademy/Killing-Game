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
  'chatrooms.setRolesToPlayer'(){

  },
});


