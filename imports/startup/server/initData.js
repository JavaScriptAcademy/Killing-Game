import { Meteor } from 'meteor/meteor';
import { Dialogs } from '../../api/dialogs.js';
import { Chatrooms } from '../../api/chatrooms.js';
// if the database is empty on server start, create some sample data.
Meteor.startup(function initData(){
  if(Dialogs.find().count() > 0){
    Meteor.call('dialogs.removeAll');
    const data = [
    {
      roomNum: '1',
      speaker: 'Cyrus',
      content: 'Game Start',
    },
    {
      roomNum: '1',
      speaker: 'Fiona',
      content: 'Nice game',
    },
    {
      roomNum: '1',
      speaker: 'Chris',
      content: 'I think murderer is ***',
    },
    {
      roomNum: '2',
      speaker: 'Cyrus',
      content: 'No one will be killed',
    },
    ];
    data.forEach((dialog) => {
      Dialogs.insert({
        roomNum: dialog.roomNum,
        speaker: dialog.speaker,
        content: dialog.content,
      });
    });
  }

  if(Chatrooms.find().count() > 0){
    Meteor.call('chatrooms.removeAll');
    Meteor.call('chatrooms.insert','Killing Game Room 1');
  };

  Meteor.call('scores.removeAll');
});