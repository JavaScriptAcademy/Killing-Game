import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Scores = new Mongo.Collection('scores');

if (Meteor.isServer) {
   Meteor.publish('scores', function scoresPublication() {
    return Scores.find({});
  });
}
Meteor.methods({
  'scores.addScore'(section, playerName){
   Scores.upsert({
    section:section,
    username:playerName
  },{$inc:{score:1}});
  },
  'scores.removeAll'(){
    Scores.remove({});
  }
});