require("dotenv").config();

var keys = require("./keys.js");


var axios = require("axios");

var spotify = require("node-spotify-api");

var fs = require("fs");

//this is for the spotify api
var spotify = new spotify(keys.spotify);

var moment = require("moment");


  



//finds musicians using bandsintown api
var findMusicians = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
      function(response) {
        var jsonStuff = response.data;
  
        if (!jsonStuff.length) {
          console.log("We found absolutely nothing for " + artist);
          return;
        }
  
  
       console.log("Upcoming events for " + artist + ":");
  
        for (var i = 0; i < jsonStuff.length; i++) {
          var event = jsonStuff[i];
  
        
          
          // Moment is for the date. I'm also displaying either the region or the country
         console.log(
            event.venue.city +
              "," +
              (event.venue.region || event.venue.country) +
              " at " +
              event.venue.name +
              " " +
              moment(event.datetime).format("MM/DD/YYYY")
              );
            }
          }
        );
      };
      

  


  var getNameOfArtist = function (artist) {
    return artist.name;
};



  
  // This executes a Spotify search
  var getSpotifySong = function(songTitle) {
    if (songTitle === undefined) {
      songTitle = " ";
    }
  
    spotify.search(
      {
        type: "track",
        query: songTitle
      },
      function(error, data) {
        if (error) {
          console.log("There was an error: " + error);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(getNameOfArtist));
          console.log("song name: " + songs[i].name);
          console.log("preview song: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
          console.log("----------------------------");
        }
      }
    );
  };
  
  
// This executes a movie search
var getMovieTitle = function(movieTitle) {
    if (movieTitle === undefined) {
      movieTitle = "Mr Nobody";
    }
  
    var omdbURL =
      "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(omdbURL).then(
      function(response) {
        var jsonStuff = response.data;
  
        console.log("Title: " + jsonStuff.Title);
        console.log("Year: " + jsonStuff.Year);
        console.log("IMDB Rating: " + jsonStuff.imdbRating);
        console.log("Rotten Tomatoes Rating: " + jsonStuff.Ratings[1].Value);
        console.log("Country: " + jsonStuff.Country);
        console.log("Language: " + jsonStuff.Language);
        console.log("Plot: " + jsonStuff.Plot);
        console.log("Actors: " + jsonStuff.Actors);
        
      }
    );
  };
  
// This exexutes a command from the text file.
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataStuff = data.split(",");

        if(dataStuff.length === 2) {
            commandSelector(dataStuff[0], dataStuff[1]);
        }
        else if(dataStuff.length === 1) {
            commandSelector(dataStuff[0]);
        }
    });
};


// This selects the command.
var commandSelector = function(caseInfo, functionInfo) {
    switch (caseInfo) {
        case "concert-this":
            findMusicians(functionInfo);
            break;
        case "spotify-this-song":
                getSpotifySong(functionInfo);
        case "movie-this":
            getMovieTitle(functionInfo);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
            default:
                console.log("I don't know what you're talking about");
    }
};


// Exectues all commands
var executeThisJawn = function(argOne, argTwo) {
    commandSelector(argOne, argTwo);
};

executeThisJawn(process.argv[2], process.argv.slice(3).join(" "));
