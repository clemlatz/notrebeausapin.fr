"use strict";

Nbsp.Messages = new Mongo.Collection("rooms");

Nbsp.MessageSchema = new SimpleSchema({
  from: {
    type: String,
    label: "Your name",
    max: 64
  },
  content: {
    type: String,
    label: "Your message"
    max: 256
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});
