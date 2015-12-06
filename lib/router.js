"use strict";

FlowRouter.route('/', {
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {content: "home"});
  }
});

FlowRouter.route('/send/', {
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {content: "send"});
  }
});

FlowRouter.route('/thanks/', {
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {content: "thanks"});
  }
});
