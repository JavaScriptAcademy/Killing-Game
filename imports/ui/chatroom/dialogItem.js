import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './dialogItem.html';
Template.DialogItem.onCreated(function create() {
  this.getCurrentUserRole = () => {
    let chatroom = Chatrooms.findOne({});
    let currentUser = Meteor.user();
    if(chatroom){
      let playerFind = chatroom.playerList.filter(function(player){
        return player.username === currentUser.username;
      });
      if(playerFind[0])
        return playerFind[0].role;
    }
    return '';
  };
});
Template.DialogItem.helpers({
  isSystemDialog(name){
    return name === 'System';
  },
  //if current player is not police, Checkout msg is not shown to him
  // isShown(speaker){
  //   if(speaker !== 'Checkout'){
  //     return true;
  //   }else{
  //     const instance = Template.instance();
  //     if(instance.getCurrentUserRole() === 'police'){
  //       return true;
  //     }
  //     return false;
  //   }
  // }
});



