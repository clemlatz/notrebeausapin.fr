"use strict";

Nbsp.updateColor = function(hue) {
  let cssHue = Math.floor(parseInt(hue) / 65535 * 360);
  $('.main').css({
    'background-color': 'hsl(' + cssHue + ', 75%, 50%)'
  });
}

if (Meteor.isClient) {

  Session.setDefault('red', 0);
  Session.setDefault('green', 0);
  Session.setDefault('blue', 0);

  Template.form.onCreated(function() {
    Nbsp.updateColor();
  });

  Template.form.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.form.events({
    'change #hue': function (event) {
      Nbsp.updateColor(event.target.value);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    let hueSettings = Meteor.settings.hue || Meteor.settings.public.hue;
    if (!hueSettings) {
      throw new Meteor.Error(500, "Hue credentials not available.");
    }
    Nbsp.hue = new HueBridge(hueSettings.server, hueSettings.username);
  });
}
