import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(text){
    Tasks.insert({
      text,
      createdAt: new Date(),
    });
  },
  'tasks.remove'(taskid){
    Tasks.remove(taskid);
  },
  'tasks.setChecked'(taskid,checked){
    Tasks.update(taskid, { $set: { checked: checked } });
  },
});

