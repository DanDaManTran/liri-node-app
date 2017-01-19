//different required packaged that is needed for this app
var request = require("request");
var Twitter = require('twitter');
var spotify = require('spotify');
var inquirer = require("inquirer");
var fs = require("fs");

//the 2 main variable that is needed for this app
var action;
var value;

//this function will run if the action is mytweets so it can go into the tweeter api
function tweets() {
	var client = new Twitter(require("./keys.js").twitterKeys);

	//runing the twitter api and if there is an error then it would display if not then it would produce the 20 most recent tweets and logging it into the log.txt
	client.get('statuses/user_timeline', {screen_name: "DanDaManTran", count: 20}, function(error, tweets, response) {

		if(error) {
			console.log('Error occurred: ' + error);
			return;

		} else {
			for(var i = 0; i<tweets.length; i++) {
				console.log(tweets[i].created_at.substring(0, 19) + "\n" + 
							tweets[i].text + "\n");

				fs.appendFile("log.txt", "\n" + tweets[i].created_at.substring(0, 19) + "\n" + 
										 tweets[i].text + "\n" +
										 "-----------------------------------------------");
			}
		}
	});
};

//this function will run if action is movie this so we can use the OMDB api 
function movies(movieName) {

	//if there is no entry from user this function will look up Mr. Nobody
	if(movieName===""){
		movieName = "Mr. Nobody";
	}

	//if the movie have any spaces then it will go through the string to replace the spaces with + sign so it can go through the API smoothly
	for(var i = 0; i < movieName.length; i++) {
		if(movieName.charAt(i) === " ") {
			movieName = movieName.substring(0, i) + "+" + movieName.substring(i + 1);
		}
	}

	//we are inputing the movie name into the URL so it is easier to read when we requestion it.
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&tomatoes=true&plot=short&r=json";

	//this is the request to get the information about the movie 
	request(queryUrl, function(error, response, body) {
		var data = JSON.parse(body);

		//if there isn't any error then it will console log the movie information and logging it into log.txt
		if(error){
			console.log("Error occurred: " + error)

		} else {
			console.log("Title: " + data.Title + "\n" + 
						"Year: " + data.Year + "\n" + 
						"IMDB Rating: " + data.imdbRating + "\n" +
						"Country: " + data.Country + "\n" +
						"Language: " + data.Language + "\n" + 
						"Plot: " + data.Plot + "\n" + 
						"Actors: " + data.Actors + "\n" +
						"Rotten Tomatoes: " + data.tomatoRating + "\n" +
						"Roteen Tomatoes URL: " + data.tomatoURL);

			fs.appendFile("log.txt", "\n" + "Title: " + data.Title + "\n" + 
						"Year: " + data.Year + "\n" + 
						"IMDB Rating: " + data.imdbRating + "\n" +
						"Country: " + data.Country + "\n" +
						"Language: " + data.Language + "\n" + 
						"Plot: " + data.Plot + "\n" + 
						"Actors: " + data.Actors + "\n" +
						"Rotten Tomatoes: " + data.tomatoRating + "\n" +
						"Roteen Tomatoes URL: " + data.tomatoURL + "\n" +
						"-----------------------------------------------");
		}
	});
};

//this function will run if action is spotify this song so we can use the spotify api 
function music(trackName) {

	//it is making I saw the sign as the default song, if there is no user input
 	if(trackName===""){
 		trackName = "I Saw The Sign";
 	}
 	
 	//this will run the spotify api 
	spotify.search({ type: 'track', query: trackName }, function(error, data) {

		//if there isn't error then it would console.log the informations and logging it into log.txt
		if (error) {
			console.log('Error occurred: ' + error);
			return;

		} else {
		var filteredData = data.tracks.items[0];

		console.log("Artist(s): " + filteredData.artists[0].name + "\n" +
					"Song Name: " + filteredData.name + "\n" + 
					"Preview Link: " + filteredData.preview_url + "\n" +
					"Album: " + filteredData.album.name);
		}

		fs.appendFile("log.txt", "\n" + "Artist(s): " + filteredData.artists[0].name + "\n" +
					"Song Name: " + filteredData.name + "\n" + 
					"Preview Link: " + filteredData.preview_url + "\n" +
					"Album: " + filteredData.album.name + "\n" +
					"-----------------------------------------------");
	});
};

function justDoIt() {

	//reading the random.txt file to run what it is needed to do 
	fs.readFile("random.txt", "utf8", function(err, data) {

		//spliting up the text file into different actions
		var insturctions = data.split(",");
		var whatToDO = insturctions[0];
		var whatToInput = insturctions[1].substring(1, insturctions[1].length-1);

		switch (whatToDO) {
			case "movie-this":
				movies(whatToInput);
				break;

			case "spotify-this-song":
				music(whatToInput);
				break;

			case "my-tweets":
				tweets();
				break;
		}
	});
};



//this will prompt user a what do they want to do quesiton 
inquirer.prompt([
	{
		type: "list",
		name: "whatToDo",
		message: "What do you want to do?",
		choices: ["my-tweets", "movie-this", "spotify-this-song", "do-what-it-says"]
	}

]).then(function(user) {
	//we are going to compare what the user want to do and running the function to to what it is suppose to do
	action = user.whatToDo;

	if(action === "do-what-it-says") {
		justDoIt();
	} else if(action === "my-tweets") {
		tweets();
	} else if(action === "spotify-this-song") {
		inquirer.prompt([
			{
				type: "input",
				name: "song",
				message: "What song do you want to know about?"
			}

		]).then(function(user) {
			music(user.song);

		});
	} else if(action === "movie-this") {
		inquirer.prompt([
			{				
				type: "input",
				name: "movie",
				message: "What movie do you want to know about?"
			}

		]).then(function(user) {
			movies(user.movie);

		});
	}
});