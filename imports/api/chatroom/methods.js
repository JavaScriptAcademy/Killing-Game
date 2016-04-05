import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Chatrooms } from './chatrooms.js';

// const LIST_ID_ONLY = new SimpleSchema({
//   listId: { type: String },
// }).validator();

//mdg:validated-method: This is a simple wrapper package for Meteor.methods.

export const insert = new ValidatedMethod({
  name: 'chatrooms.insert',
  validate: new SimpleSchema({}).validator(),
  run(roomName) {
    const room = {
      roomName,
    };
    Chatrooms.insert(room, callback);
  },
});


// Get list of all method names on Lists
const CHATROOMS_METHODS = _.pluck([
  insert,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second

  //If the accounts-base package is added to your project, there are default
  //rules added to limit logins, new user registration and password resets
  //calls to a limit of 5 requests per 10 seconds per connection
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(CHATROOMS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
