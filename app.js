var request = require("request");
var Twitter = require('twitter');

var action = process.argv[2];
var value = process.argv[3];

switch (action){
	case "movie-this":
		movies(value);
		break;

	case "spotify-this-song":
		music(value);
		break;

	case "do-what-it-says":
		justDoIt();
		break;

	case "my-tweets":
		tweets();
		break;
}


function movies(movieName) {
	if(movieName===undefined){
		movieName = "Mr. Nobody";
	}

	for (var i = 0; i < movieName.length; i++) {
	    if (movieName.charAt(i) === " ") {
	        movieName = movieName.substring(0, i) + "+" + movieName.substring(i + 1);
	    }
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

	request(queryUrl, function(error, response, body) {
	var data = JSON.parse(body);

		if (!error && response.statusCode === 200) {
			console.log("Title: " + data.Title + "\n" + 
						"Year: " + data.Year + "\n" + 
						"IMDB Rating: " + data.imdbRating + "\n" +
						"Country: " + data.Country + "\n" +
						"Language: " + data.Language + "\n" + 
						"Plot: " + data.Plot + "\n" + 
						"Actors: " + data.Actors + "\n" +
						"Rotten Tomatoes: " + "Something" + "\n" +
						"Roteen Tomatoes URL: " + "something");
		}
	});
};

function music(trackName) {
	var spotify = require('spotify');

 	if(trackName===undefined){
 		trackName = "I Saw The Sign";
 	}

	spotify.search({ type: 'track', query: trackName }, function(err, data) {
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
 		
 		var filteredData = data.tracks.items[0];
 		console.log(data.tracks.href);
    	console.log("Artist(s): " + filteredData.artists[0].name + "\n" +
    				"Song Name: " + filteredData.name + "\n" + 
    				"Preview Link: " + filteredData.preview_url + "\n" +
    				"Album: " + filteredData.album.name);
	});
};

function justDoIt() {
	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(err, data) {
		var insturctions = data.split(",");
		var whatToDO = insturctions[0];
		var whatToInput = insturctions[1].substring(1, insturctions[1].length-1);

		switch (whatToDO){
			case "movie-this":
				movies(whatToInput);
				break;

			case "spotify-this-song":
				music(whatToInput);
				break;
		}
	});
};

function tweets() {
	var client = new Twitter(require("./keys.js").twitterKeys);
	// console.log(client);

client.get('favorites/list', function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});

}



