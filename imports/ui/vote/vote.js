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
      if(playerFind[0])
        return playerFind[0].role;
    }
    return '';
  };
  this.isEveryoneVoted = (filter) => {
    let chatroom = Chatrooms.findOne({});
    if(chatroom){
      let players = chatroom.playerList.filter(chooseAlivePlayer);
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
    function chooseAlivePlayer(player){
      return player.status === 'alive';
    }
  };

  this.murdererFilter = (player) =>{
    return player.role === 'murderer';
  };

  this.policeFilter = (player) =>{
    return player.role === 'police';
  };

  //all the functions below will be used if game is over.
  this.isGameOver = () => {
    debugger;
    let winFlag = false;
    const chatroom = Chatrooms.findOne({});
    if(chatroom&&chatroom.roomStatus === 'dialog'){
      if(this.isMurdererWin()){
        Meteor.call('dialogs.insert', '','System' , "Game is over, all police/citizens are killed. The winners are murderers");
        winFlag = true;
      }
      if(this.isCitizenWin()){
        Meteor.call('dialogs.insert', '','System' , "Game is over, all murderers are marked. The winners are police/citizens");
        winFlag = true;
      }
      //the game came is over
    }
    return winFlag;
  };
  this.allRoleDead = (playerList, role) => {
    let players = playerList.filter((player) => {
      return player.role === role;
    });
    if(players.every((player) => { return player.status !== 'alive'})){
      return true;
    };
    return false;
  };
  this.isMurdererWin = () => {
    let chatroom = Chatrooms.findOne({});
    if(chatroom){
      let playerList = chatroom.playerList;
      debugger;
      if(this.allRoleDead(playerList,'citizen')
        ||this.allRoleDead(playerList,'police')){
        return true;
      }
    };
    return false;
  };
  this.isCitizenWin = () => {
    let chatroom = Chatrooms.findOne({});
    if(chatroom){
      let playerList = chatroom.playerList;
      if(this.allRoleDead(playerList,'murderer')){
        return true;
      }
    };
    return false;
  };
  this.gameOver = () => {
    let chatroom = Chatrooms.findOne({});
    if(chatroom){
      let playerList = chatroom.playerList;
      broadcastPlayers(getAllRole(playerList, 'murderer'),'murderers');
      broadcastPlayers(getAllRole(playerList, 'police'),'police');
      broadcastPlayers(getAllRole(playerList, 'citizen'),'citizens');
    }
    Meteor.call('chatrooms.setStatus', 'over');

    function getAllRole(players, role){
      return players.filter( (player) => {
        return player.role === role;
      })
    };
    function broadcastPlayers(players, role){
      let msg = '';
      players.forEach(function (player) {
       msg += player.username+',';
     });
      Meteor.call('dialogs.insert', '', 'System', 'The '+role+' are--- '+msg);
    };
  }
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
  message(){
    const instance = Template.instance();
    if(instance.getCurrentUserRole() === 'police'){
      let result = Session.get('checkout');
      if(result&& result!==''){
        Meteor.setTimeout(() => {
          instance.setDefaultStatus();
          Meteor.call('chatrooms.setTime','day');
          Session.set('checkout','');
        }, 8000);
        return result;
      }
    }
    return '';
  },
  playerScore(playerName){
   let score = '';
   if(Chatrooms.findOne({})&&Meteor.user()){
     const gameTime = Chatrooms.findOne({}).gameTime;
     const instance = Template.instance();
     let currentUserRole = instance.getCurrentUserRole();
     if(gameTime === 'day'){
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
    if(score){
      return score.score;
    }
  }
  return '';
}
});

Template.Vote.events({
  'click .click-vote'(event){
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
    if(gameTime === 'day'){//daytime vote result
      Meteor.call('scores.addScore', gameTime, playerName);
    }else{
      Meteor.call('scores.addScore', currentUserRole, playerName);
    }
    Meteor.call('chatrooms.setPlayerStatus',currentUser.username,'voted','true');

    //check whether all players have voted
    //day time, everyone has the right to vote
    if(gameTime === 'day'&&instance.isEveryoneVoted()){
      let suspect = Scores.find({section:'day'},{ sort: { score: -1 } }).fetch()[0];
      //if it is daytime, set status to suspect
      //gameTime has been set to the opposite one
      Meteor.call('chatrooms.setPlayerStatus',suspect.username,'status','suspect');
      Meteor.call('dialogs.insert','','System',suspect.username+' is marked as a suspect.');
      instance.setDefaultStatus();
      Meteor.call('chatrooms.setTime','night');
    }
      //end of vote in the night
    if(gameTime === 'night'){
      if(instance.isEveryoneVoted(instance.murdererFilter)
        &&instance.isEveryoneVoted(instance.policeFilter)){

        let suspect = Scores.find({section:currentUserRole},{ sort: { score: -1 } }).fetch();
        console.log('get highest score of police checkout', suspect[0].username);

        let players = Chatrooms.findOne({}).playerList;
        let suspectPlayer = players.filter((player) => {
          return player.username === suspect[0].username;
        });
        // Meteor.call('dialogs.insert','','Checkout',suspect[0].username+' is checked. He is a '+suspectPlayer[0].role);
        if(instance.getCurrentUserRole() === 'police'){
          console.log(suspectPlayer[0].username+' is checked. He(She) is a '+suspectPlayer[0].role);
        }
        let victim = Scores.find({section:'murderer'},{ sort: { score: -1 } }).fetch();
        Meteor.call('chatrooms.setPlayerStatus', victim[0].username, 'status', 'victim');
        Meteor.call('dialogs.insert','','System','Night ends. '+victim[0].username+' is killed by murderers.');
        Session.set('checkout',suspectPlayer[0].username+' is checked. He(She) is a '+suspectPlayer[0].role);
      }
    }

    //check whether game is over
    if(instance.isGameOver()){
      instance.gameOver();
    }
  }
});

//route to dialog page when vote ends
Tracker.autorun(function () {
  let chatroom = Chatrooms.findOne({});
  if(chatroom){
    let status = chatroom.roomStatus;
    if(status === 'dialog' || status === 'over'){
      Router.go('/');
      Session.set("startTimer", true);
    }
  }
});