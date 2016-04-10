import './waiting.html';
import { Chatrooms } from '../../api/chatrooms.js';

Tracker.autorun(function () {
  let chatroom = Chatrooms.findOne({});
  if(chatroom){
    let status = chatroom.roomStatus;
    if(status === 'dialog'){
      Router.go('/');
    }
  }
});