import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';

class ChatroomCollections extends Mongo.Collection {
  insert(obj,callback){
    const chatroom = obj;
    chatroom.createdAt = chatroom.createdAt || new Date();
    return super.insert(chatroom, callback);
  }
}

export const Chatrooms = new ChatroomCollections('Chatrooms');

// Deny all client-side updates since we will be using methods to manage this collection
Chatrooms.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Chatrooms.schema = new SimpleSchema({
  roomName: {
    type: String,
    label: 'Room Name'
  },
  roomStatus: {
    type: String,
    label: 'Room Status',
    defaultValue: 'ready'
  },
  playerList: {
    type: [String],
    label: 'Player List',
    optional: true
  },
  dialogs: {
    type: [String],
    label: 'Dialog List',
    optional: true
  },
});

Chatrooms.attachSchema(Chatrooms.schema);

Chatrooms.publicFields = {
  roomName: 1,
  roomStatus: 1,
  playerList: 1,
  dialogs:1,
};
Factory.define('chatroom', Chatrooms, {});

Chatrooms.helpers({
//put help method here
  chatrooms() {
    return chatroom.find({ roomId: this._id }, { sort: { createdAt: -1 } });
  },
});



