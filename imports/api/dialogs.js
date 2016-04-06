import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Dialogs = new Mongo.Collection('dialogs');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('dialogs', function dialogsPublication() {
    return Dialogs.find({});
  });
}

Meteor.methods({
  'dialogs.insert'(roomNum, speaker, content){
    Dialogs.insert({
      roomNum,
      speaker,
      content,
      createdAt: new Date(),
    });
  },
   'dialogs.removeAll'(){
    Dialogs.remove({});
  },
});


