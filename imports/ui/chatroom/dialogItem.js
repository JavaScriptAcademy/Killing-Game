import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './dialogItem.html';

Template.DialogItem.helpers({
  isSystemDialog(name){
    return name === 'System';
  }
});



