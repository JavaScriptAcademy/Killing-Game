import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';

import './dialogs-show.html';
import './dialog-item.js';

// Component used in the template

import { displayError } from '../lib/errors.js';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

Template.Dialogs_show.onCreated(function listShowOnCreated() {
  console.log('template Dialogs_show is created');
});

Template.Dialogs_show.helpers({
  dialogArgs(dialog) {
    return {
      dialog,
    };
  },
});

Template.Dialogs_show.events({
  'submit .js-input-symbol'(event) {
    event.preventDefault();

    const $input = $(event.target).find('textarea');
    if (!$input.val()) {
      return;
    }

    // insert.call({
    //   listId: this.list()._id,
    //   text: $input.val(),
    // }, displayError);

    $input.val('');
  },
});
