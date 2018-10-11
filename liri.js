//require dotnev npm to link Spotify keys file..
require("dotenv").config();

//require keys.js file..
var keys = require("./keys.js");

//require request npm..
var request = require("request");

//require spotify npm..
var Spotify = require('node-spotify-api');
//save spotify key to a variable..
var spotify = new Spotify(keys.spotify);

//require moment npm..
var moment = require('moment');
moment().format();

var fs = require("fs")
var nodeArgs = process.argv;
var userInput = "";
var prettyUserInput = "";

//get user input for song/artist/movie name
//loop starting at process.argv[3]
for (var i = 3; i < nodeArgs.length; i++) {
    //if userInput is more than 1 word
    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + "%20" + nodeArgs[i];
    }
    //if userInput is only 1 word
    else {
        userInput += nodeArgs[i];
    }
}

//remove %20 when pushing to log.txt
for (var i = 3; i < nodeArgs.length; i++) {
    prettyUserInput = userInput.replace(/%20/g, " ");
}

var userCommand = process.argv[2];
//switch statement for commands
function runliri() {


    switch (userCommand) {
        case "concert-this":
            //append userInput to log.txt
            fs.appendFileSync("log.txt", prettyUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            //run request to bandsintown with the specified artist
            var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
            request(queryURL, function (error, response, body) {
                //if no error and response is a success
                if (!error && response.statusCode === 200) {
                    //parse the json response
                    var data = JSON.parse(body);
                    //loop through array
                    for (var i = 0; i < data.length; i++) {
                        //get venue name
                        console.log("Venue: " + data[i].venue.name);
                        //append data to log.txt
                        fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                        //get venue location
                        //if statement for concerts without a region
                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                            //append data to log.txt
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                            //append data to log.txt
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        }
                        //get date of show
                        var date = data[i].datetime;
                        date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)
                        //append data to log.txt
                        fs.appendFileSync("log.txt", "Date: " + date + "\n----------------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                        console.log("----------------")
                    }
                }
            });
            break;
        case "spotify-this-song":
            console.log("this hit")
            //if statement for no song provided
            if (!userInput) {
                userInput = "The%20Sign";
                prettyUserInput = userInput.replace(/%20/g, " ");
            }
            //append userInput to log.txt
            fs.appendFileSync("log.txt", prettyUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            spotify.search({
                type: "track",
                query: userInput
            }, function (err, data) {
                if (err) {
                    console.log("Error occured: " + err)
                }
                //assign data being used to a variable
                var info = data.tracks.items
                // console.log(info);
                //loop through all the "items" array
                for (var i = 0; i < info.length; i++) {
                    //Store "album" object to variable
                    var albumObject = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url
                    //Store "artists" array to variable
                    var artistsInfo = albumObject.artists
                    //loop through "artists" array
                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + albumObject.name)
                        console.log("----------------")
                        //append data to log.txt
                        fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + albumObject.name + "\n----------------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                    }
                }
            })
            break;
        case "movie-this":
            //if statement for no movie provided
            if (!userInput) {
                userInput = "Mr%20Nobody";
                prettyUserInput = userInput.replace(/%20/g, " ");
            }
            //append userInput to log.txt
            fs.appendFileSync("log.txt", prettyUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            //run request to OMDB
            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=" + process.env.OMDBKEY
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("IMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)
                    //append data to log.txt
                    fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRotten Tomatoes Rating: " +
                        info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n----------------\n",
                        function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                }
            });
            break;
    }
}

if (userCommand == "do-what-it-says") {
    var fs = require("fs");
    //read random.txt file
    console.log("hi");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        console.log(data);
        //split data into array
        var textArr = data.split(",");
        userCommand = textArr[0].trim();
        userInput = textArr[1];
        prettyUserInput = userInput.replace(/%20/g, " ");
        runliri();
    })
}

runliri();
                        


