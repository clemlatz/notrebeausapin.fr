# Notre beau sapin

This repository contains the source of the website
[notrebeausapin.fr](http://www.notrebeausapin.fr). It allows anyone to change
the colour of our Christmas tree lights from the web.

## How it works

We use a Philips Hue Lightstrip Plus as an electric garland in our Christmas
tree. It's a ribbon of LED lights that can be controlled through the Philips Hue
bridge over HTTP with a REST API.  
When a message is sent via the current Meteor app, it triggers a HTTP call to a
specific port on our home's IP address, which our router routes to the Hue
bridge.

## Installation

1. Install [Meteor](https://www.meteor.com/) `curl https://install.meteor.com/ | sh`
2. Clone this repo `git clone https://github.com/iwazaru/notrebeausapin.fr.git`
3. Change directory `cd notrebeausapin.fr`
4. Create the settings file from example `cp settings.json.dist settings.json`
5. Update the settings file with your Hue bridge credentials and light id
4. Run the app with the settings file `run meteor --settings settings.json`
5. Go to http://localhost:3000/
