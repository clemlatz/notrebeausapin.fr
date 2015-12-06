"use strict";

Nbsp.updateColor = function(hue) {
  let cssHue = Math.floor(parseInt(hue) / 65535 * 360);
  $('.main').css({ 'background-color': 'hsl(' + cssHue + ', 75%, 50%)' });
  $('.overlay').css({ 'background-color': 'hsla(' + cssHue + ', 75%, 50%, .15)' });
}

Nbsp.resetColor = function() {
  $('.main').css('background-color', '#fff');
  $('.overlay').css('background', 'none');
}

if (Meteor.isClient) {

  Nbsp.hideCards = function() {
    $('.card').fadeOut();
  }

  Nbsp.showCards = function() {
    $('.card').fadeIn();
  }

  Meteor.subscribe("cards");

  Template.home.onCreated(function() {
    Nbsp.resetColor();
  });

  Template.thanks.onCreated(function() {
    Nbsp.resetColor();
  });

  Template.send.onCreated(function() {
    Nbsp.updateColor(0);
  });

  Template.send.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.send.events({
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
        } else {
          FlowRouter.go("/thanks/");
        }
      });
    }
  });

  Template.send.onRendered(function() {
    let slider = noUiSlider.create(document.getElementById('colorPicker'), {
  		start: random(0, 65355),
  		range: {
  			'min': 0,
  			'max': 65535
  		},
  	});
    slider.on('start', function() {
      Nbsp.hideCards();
    });
    slider.on('end', function() {
      Nbsp.showCards();
    });
    slider.on('update', function(value) {
      Nbsp.updateColor(value);
      $('#hue').val(value);
    });
  })

  Template.cards.helpers({
    cards: function() {
      return Nbsp.Cards.find().fetch();
    }
  });

  Template.card.onRendered(function() {
    let data = this.data;

    $(this.firstNode).animate({
      left: data.position.x + '%',
      top: data.position.y + '%',
    }, {
      progress: function(animation, progress) {
        this.style.transform = `translate(-50%,-50%) rotate(${ progress * data.position.rotation }deg)`
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
    Nbsp.hueSettings = Meteor.settings.hue || Meteor.settings.public.hue;
    if (!Nbsp.hueSettings) {
      throw new Meteor.Error(500, "Hue credentials not available.");
    }
    Nbsp.hue = new HueBridge(Nbsp.hueSettings.server, Nbsp.hueSettings.username);
  });


  Meteor.methods({
    createCard: function(card) {

      // Add random card position
      card.position = {
        x: random(0, 100),
        y: random(0, 100),
        z: random(0, 9999),
        rotation: random(0, 60) - 30
      }

      // Validate and persist card
      card.createdAt = new Date();
      check(card, Nbsp.CardSchema);
      Nbsp.Cards.insert(card);

      Nbsp.hue.getLight(Nbsp.hueSettings.light_id, Meteor.bindEnvironment(function(light) {
        light.setOn();
        light.stopColorloop();
        light.setHue(card.hue);
        light.blink(5);
      }));
    }
  });

  Meteor.publish("cards", function() {
    return Nbsp.Cards.find();
  });
}
