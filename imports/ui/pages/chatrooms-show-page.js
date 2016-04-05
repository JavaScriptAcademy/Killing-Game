import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { DialogRenderHold } from '../launch-screen.js';
import { Chatrooms } from '../../api/chatroom/chatrooms.js';
import './chatrooms-show-page.html';
import './app-not-found.js';
import '../components/dialogs-show.js';

Template.Chatrooms_show_page.onCreated(function getChatroomId(){
  this.chatroomId = FlowRouter.getParam('_id');
});

Template.Chatrooms_show_page.onRendered(function dialogsShowPageOnRendered() {
  // this.autorun(() => {
  //   if (this.subscriptionsReady()) {
  //     DialogRenderHold.release();
  //   }
  // });
});

Template.Chatrooms_show_page.helpers({
  dialogIdArray(){
    const chatroomId = Template.instance().chatroomId;
    return  Chatrooms.findOne(chatroomId) ? [chatroomId] : [];
  },
  dialogArgs(chatroomId) {
    const instance = Template.instance();
    // By finding the list with only the `_id` field set, we don't create a dependency on the
    // `list.incompleteCount`, and avoid re-rendering the todos when it changes
    const chatroom = Chatrooms.findOne(chatroomId);//, { fields: { _id: true } }
    const dialogs = chatroom.dialogs;
    return {
      dialogsReady: instance.subscriptionsReady(),
      // We pass `list` (which contains the full list, with all fields, as a function
      // because we want to control reactivity. When you check a todo item, the
      // `list.incompleteCount` changes. If we didn't do this the entire list would
      // re-render whenever you checked an item. By isolating the reactiviy on the list
      // to the area that cares about it, we stop it from happening.
      chatroom() {
        return Chatrooms.findOne(chatroomId);
      },
      dialogs,
    };
  },
});