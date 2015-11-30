"use strict";

Nbsp.updateColor = function(hue) {
  let cssHue = Math.floor(parseInt(hue) / 65535 * 360);
  $('.main').css({ 'background-color': 'hsl(' + cssHue + ', 75%, 50%)' });
  $('.overlay').css({ 'background-color': 'hsla(' + cssHue + ', 75%, 50%, .15)' });
}

if (Meteor.isClient) {

  Meteor.subscribe("cards");

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

  Template.cards.helpers({
    cards: function() {
      return Nbsp.Cards.find().fetch();
    }
  });

  Template.card.onRendered(function() {
    var data = this.data;
    $(this.firstNode).animate({
      left: data.position.x + '%',
      top: data.position.y + '%',
    }, {
      progress: function(animation, progress) {
        this.style.transform = `rotate(${ progress * data.position.rotation }deg)`
      }
    });
  });

  Template.card.helpers({
    'hue': function() {
      return ((parseInt(this.hue) / 65535) * 360)
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
        rotation: random(0, 60) - 30
      }
      card.createdAt = new Date();
      check(card, Nbsp.CardSchema);
      Nbsp.Cards.insert(card);
    }
  });

  Meteor.publish("cards", function() {
    return Nbsp.Cards.find();
  });
}
