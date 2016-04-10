import './vote.html';
import { Meteor } from  'meteor/meteor';
import { Chatrooms } from '../../api/chatrooms.js';
import { Scores } from '../../api/scores.js';

Template.Vote.onCreated(function createVote() {
  this.autorun(() => {
    Meteor.subscribe('chatrooms');
    Meteor.subscribe('scores');
  });

  this.setDefaultStatus = () => {
    Meteor.call('scores.removeAll');
    Meteor.call('chatrooms.setStatus','dialog');
    Meteor.call('chatrooms.clearVoted');
  };

  this.getCurrentUserRole = () => {
    let chatroom = Chatrooms.findOne({});
    let currentUser = Meteor.user();
    if(chatroom){
      let playerFind = chatroom.playerList.filter(function(player){
        return player.username === currentUser.username;
      });
      return playerFind[0].role;
    }else{
      return '';
    }
  };
  this.isEveryoneVoted = (filter) => {
    let chatroom = Chatrooms.findOne({});
    if(chatroom){
      let players = chatroom.playerList;
      if(filter){
       players =  players.filter(filter);
      }
      let allvoted = players.every(isPlayerVoted);
      return allvoted;
    }else{
      return '';
    }

    function isPlayerVoted(player){
      return player.voted === 'true';
    };
  };

  this.murdererFilter = (player) =>{
    return player.role === 'murderer';
  };

  this.policeFilter = (player) =>{
    return player.role === 'police';
  };

});

Template.Vote.helpers({
  players(){
    let chatroom = Chatrooms.findOne({});
    if(chatroom){
      let players = chatroom.playerList.filter((player)=>{
        return player.status === 'alive';
      });
      return players;
    }else{
      return '';
    }
  },
  // scores(){
  //   return Scores.find({}).fetch();
  // },
  playerScore(playerName){
   let score = '';
   if(Chatrooms.findOne({})&&Meteor.user()){
     const gameTime = Chatrooms.findOne({}).gameTime;
     const instance = Template.instance();
     let currentUserRole = instance.getCurrentUserRole();
     if(gameTime === 'night'){
       score = Scores.findOne({
        username:playerName
      });
     }else{
       if(currentUserRole === 'murderer'||currentUserRole === 'police'){
        score = Scores.findOne({
          section:currentUserRole,
          username:playerName,
        });
      }
    };
    return score.score;
  }
  return '';
}
});

Template.Vote.events({
  'click .click-vote'(event){
    debugger;
    const instance = Template.instance();
    const playerName = $("input[name='player']:checked").val();
    const gameTime = Chatrooms.findOne({}).gameTime;
    let currentUser = Meteor.user();
    let currentUserRole = instance.getCurrentUserRole();
    /*
    * record score
    * if gameTime = day, set section= day
    * if gameTime = night, set section = police/murder
    */
    if(gameTime === 'night'){//daytime vote result
      Meteor.call('scores.addScore', gameTime, playerName);
    }else{
      Meteor.call('scores.addScore', currentUserRole, playerName);
    }
    Meteor.call('chatrooms.setPlayerStatus',currentUser.username,'voted','true');

    //check whether all players have voted
    //day time, everyone has the right to vote
    //gameTime has been set to the opposite one()
    if(gameTime === 'night'&&instance.isEveryoneVoted()){
      let maxScore = Scores.find({section:'night'},{ sort: { score: -1 } }).fetch()[0];
      //if it is daytime, set status to suspect
      //gameTime has been set to the opposite one
      Meteor.call('chatrooms.setPlayerStatus',maxScore.username,'status','suspect');
      instance.setDefaultStatus();
    }
    //gameTime has been set to the opposite one
    if(gameTime === 'day'){
      if(currentUserRole === 'murderer'&&instance.isEveryoneVoted(instance.murdererFilter)){
        let victim = Scores.find({section:currentUserRole},{ sort: { score: -1 } }).fetch();
        Meteor.call('chatrooms.setPlayerStatus', victim[0].username, 'status', 'victim');
      }
      if(currentUserRole === 'police'&&instance.isEveryoneVoted(instance.policeFilter)){
         let maxScore = Scores.find({section:currentUserRole},{ sort: { score: -1 } }).fetch()[0];
        console.log('get highest score of police checkout', maxScore.username);
        //TODO： show dialog to police
      }
      //end of vote in the night
      if(instance.isEveryoneVoted(instance.murdererFilter)
        &&instance.isEveryoneVoted(instance.policeFilter)){
        instance.setDefaultStatus();
      }
    }
  }
});

//route to dialog page when vote ends
Tracker.autorun(function () {
  let chatroom = Chatrooms.findOne({});
  if(chatroom){
    let status = chatroom.roomStatus;
    if(status === 'dialog'){
      Router.go('/');
    }
  }
});