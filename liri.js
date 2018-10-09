//import modules and packages
const request = require("request");
const Spotify = require("node-spotify-api");
const moment = require("moment");

//turn on dotenv to load up environment variables from .env file
require("dotenv").config();

const spotifyKeys = require("./keys.js")

//turn new spotify app
const spotify = new Spotify(spotifyKeys.spotify);