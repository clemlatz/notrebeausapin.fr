HueBridge = function(server, username) {
  this.server = server;
  this.username = username;
}

HueBridge.prototype = {

  _apiCall: function(method, path, data, callback) {
    HTTP.call(method, "http://" + this.server + "/api/" + this.username + path, { data: data },
      function(error, result) {
        if (error) {
          console.log(error);
        } else if (result.data && result.data[0] && result.data[0].error) {
          let error = result.data[0].error;
          throw new Meteor.Error(error.type, error.description);
        } else if (typeof callback === "function") {
          callback(result.data);
        }
      }
    );
  },

  getLights: function(callback) {
    var bridge = this;
    this._apiCall("GET", "/lights/", {}, function(results) {
      let lights = [];
      for (id in results) {
        lights.push(new HueLight(bridge, id, results[id]))
      }
      callback(lights);
    });
  },

  getLight: function(id, callback) {
    var bridge = this;
    this._apiCall("GET", `/lights/${id}`, {}, function(result) {
      let light = new HueLight(bridge, id, result);
      callback(light);
    });
  }
}

HueLight = function(bridge, id, params) {
  this.bridge = bridge;
  this.id = id;
  this.params = params;
}

HueLight.prototype = {

  updateState: function(key, val) {
    let state = {};
    state[key] = val;
    this.bridge._apiCall("PUT", `/lights/${this.id}/state`, state);
  },

  setOn: function() {
    this.updateState("on", true);
  },

  setOff: function() {
    this.updateState("on", false);
  },

  setBrightness: function(value) {
    if (value < 0 || value > 255 || value !== parseInt(value, 10)) {
      throw new Meteor.Error(500, value + " is not a valid brightness value. Should be an integer between 0 and 255.");
    }
    this.updateState("bri", value);
  },
}
