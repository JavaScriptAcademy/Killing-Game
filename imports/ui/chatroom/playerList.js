import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './playerList.html';


Template.PlayerList.helpers({
  participants:[
   { name: 'Cyrus 1' },
   { name: 'Tom 2' },
   { name: 'David 3' }
 ],
});