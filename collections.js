"use strict";

Nbsp.Cards = new Mongo.Collection("cards");

Nbsp.Cards.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; }
});

Nbsp.Cards.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Nbsp.CardPositionSchema = new SimpleSchema({
  x: {
    type: Number,
    min: 0,
    max: 100
  },
  y: {
    type: Number,
    min: 0,
    max: 100
  },
  z: {
    type: Number,
    min: 1,
    max: 9999
  },
  rotation: {
    type: Number,
    min: 0,
    max: 100
  },
});

Nbsp.CardSchema = new SimpleSchema({
  from: {
    type: String,
    label: "Your name",
    max: 64
  },
  content: {
    type: String,
    label: "Your message",
    max: 256
  },
  hue: {
    type: Number,
    label: "Light color",
    min: 0,
    max: 65535
  },
  position: {
    type: Nbsp.CardPositionSchema
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});
