var request = require("request");

var action = process.argv[2];

if(action==="movie-this"){
	movies();
} else if(action==="spotify-this-song"){
	music();
}

function movies() {
	var movieName = process.argv[3];

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

function music() {
	var spotify = require('spotify');
 
	spotify.search({ type: 'track', query: 'beauty the beast' }, 
	function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
 		
    	console.log(data.tracks.items[0].album.name);
	});
};


//		* Artist(s)
// 		* The song's name
// 		* A preview link of the song from Spotify
// 		* The album that the song is from

