import { Dialogs } from '../../api/dialogs.js';

import './dialogShow.html';
import './dialogItem.js';

Template.DialogShow.onCreated(function bodyOnCreated() {
  this.autorun(() => {
    Meteor.subscribe('dialogs');
  });
});

Template.DialogShow.helpers({
  dialogs(){
    return Dialogs.find({},{ sort: { createdAt: 1 } });
  },
  dialogItemArgs(dialog){
    return {
      dialog,
    }
  },
});

Template.DialogShow.events({
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