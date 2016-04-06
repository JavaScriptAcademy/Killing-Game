import './importantEvent.html';
import { Chatrooms } from '../../api/chatrooms.js';
import { Dialogs } from '../../api/dialogs.js';

Template.ImportantEvent.helpers({
  gameStart(){
    return Chatrooms.findOne({}).roomStatus === 'Start';
  },
  daytime(){
    console.log('time',Chatrooms.findOne({}).gameTime);
    return Chatrooms.findOne({}).gameTime === 'day';
  }
});

Template.ImportantEvent.events({
  'click #startButton'(event){
    Meteor.call('chatrooms.setStatus','Start');
    Meteor.call('dialogs.insert','','System','Game start!');
    //set role to player

  },
  'click #switchButton'(event){
    let time = Chatrooms.findOne({}).gameTime;
    console.log('time',time);
    let flag = 'day';
    debugger;
    if(time === 'night'){
      flag = 'day';
    }else{
      flag = 'night';
    }
    Meteor.call('chatrooms.setTime',flag);
    Meteor.call('dialogs.insert','','System','End of '+time+' !');
  }
});