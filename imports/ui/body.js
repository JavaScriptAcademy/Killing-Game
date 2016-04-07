import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Dialogs } from '../api/dialogs.js';
import { Chatrooms } from '../api/chatrooms.js';

import './body.html';
import './task.js';
import './chatroom/dialogItem.js';
import './chatroom/importantEvent.js';
import './chatroom/playerList.js';
import './vote/vote.js';
import '../startup/client/accounts-config.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.autorun(() => {
    Meteor.subscribe('chatrooms');
    Meteor.subscribe('dialogs');
    Meteor.subscribe('onlineusers');
  });
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')){
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Tasks.find({},{ sort: { createdAt: -1 } });
  },
  dialogs(){
    return Dialogs.find({},{ sort: { createdAt: 1 } });
  },
  dialogItemArgs(dialog){
    return {
      dialog,
    }
  },
  chatroom(){
    return Chatrooms.findOne({},{ sort: { createdAt: -1 } });
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    // Insert a task into the collection
    Meteor.call('dialogs.insert','1',Meteor.user().username,text);
    // Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';

  },
});