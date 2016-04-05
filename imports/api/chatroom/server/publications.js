import { Meteor } from 'meteor/meteor';
import { Chatrooms } from '../chatrooms.js';

Meteor.publish('chatrooms', function chatrooms(){
  console.log('publish', Chatrooms.find().count());

  return Chatrooms.find();
})