"use strict";

Nbsp.updateColor = function(hue) {
  let cssHue = Math.floor(parseInt(hue) / 65535 * 360);
  $('.main').css({ 'background-color': 'hsl(' + cssHue + ', 75%, 50%)' });
  $('.overlay').css({ 'background-color': 'hsla(' + cssHue + ', 75%, 50%, .15)' });
}

if (Meteor.isClient) {

  Session.setDefault('red', 0);
  Session.setDefault('green', 0);
  Session.setDefault('blue', 0);

  Template.form.onCreated(function() {
    Nbsp.updateColor(0);
  });

  Template.form.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.form.events({
    'change #hue': function (event) {
      Nbsp.updateColor(event.target.value);
    },
    'submit #cardForm': function (event) {
      event.preventDefault();

      let card = {
        from: $('#name').val(),
        content: $('#content').val(),
        hue: parseInt($('#hue').val())
      }

      Meteor.call('createCard', card, function(error, result) {
        if (error) {
          alert(error);
        }
      });
    }
  });
}

function random(min, max)
{
  return Math.floor(Math.random() * max) + min
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    let hueSettings = Meteor.settings.hue || Meteor.settings.public.hue;
    if (!hueSettings) {
      throw new Meteor.Error(500, "Hue credentials not available.");
    }
    Nbsp.hue = new HueBridge(hueSettings.server, hueSettings.username);
  });

  Meteor.methods({
    createCard: function(card) {
      card.position = {
        x: random(0, 100),
        y: random(0, 100),
        z: random(0, 9999),
        rotation: random(-30, 30)
      }
      card.createdAt = new Date();
      check(card, Nbsp.CardSchema);
      Nbsp.Cards.insert(card);
    }
  })
}
