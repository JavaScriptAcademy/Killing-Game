import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './dialogItem.html';


Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});