import './vote.html';
import { Meteor } from  'meteor/meteor';
import { Chatrooms} from '../../api/chatrooms.js';
import { Scores } from '../../api/scores.js';

Template.Vote.onCreated(function createVote(){
  this.autorun(function getData(){
    Meteor.subscribe('chatrooms');
    Meteor.subscribe('scores');
  });
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
  scores(){
    console.log(Scores.find({}).fetch());
    return Scores.find({}).fetch();
  },
  playerScore(playerName){
    let score = Scores.findOne({username:playerName});
    if(score){
      return score.score;
    }else{
      return '';
    }
  }
});

Template.Vote.events({
  'click .click-vote'(event){
    const playerName = $("input[name='player']:checked").val();
    Meteor.call('scores.addScore', playerName);
    console.log(Scores.find({}).fetch());
  }
});