"use strict";

FlowRouter.route('/', {
    action: function(params, queryParams) {
        // console.log("Yeah! We are on the post:", params.postId);
        BlazeLayout.render("layout", {content: "form"});
    }
});
