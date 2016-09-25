//initializing server code/////////////////////
var express = require('express');
var fs = require('fs');
var app = express();
app.listen(8000);
app.use(express.static(__dirname));
//initial get request sends the html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
console.log('listening on port 8000');
///////////////////////////////////////////////
//test//
var scraper = require('basketball-reference');
 
scraper.getLeagueStandings(2016, function(data) {
  console.log(data);
});

// Returns a random number between min (inclusive) and max (exclusive)
function randNum() {
	var x = Math.random();
 	return x;
}
var boxScore = function(player) {
	player.AST = Math.round(player.AST * (randNum() * (1.5-.5)+.5));
	player.BLK = Math.round(player.BLK * (randNum() * (3-.5)+.5));
	player.STL = Math.round(player.STL * (randNum() * 3));
	player.TRB = Math.round(player.TRB * (randNum() * (1.6-.2)+.2));
	player.PTS = Math.round(player.PTS * (randNum() * (1.3-.7)+.7));
	player.TOV = Math.round(player.TOV * (randNum() * (1.5-.2)+.2));
	player['FG%'] = Math.round(1000 * player['FG%'] * (randNum() * (1.2-.8) + .8)) / 10;
};

var scoreFunc = function(player) {
	var total = 0;
	total += player.AST * 1;
	total += player.BLK * 1.25;
	total += player.STL * 1.75;
	total += player.TRB * 1;
	total += player.PTS * 1;
	total -= player.TOV * 1.5;
	if (player['FG%'] > 0.5)
		{total += player.PTS * 0.25;}
	else if (player['FG%'] <= 0.4)
		{total -= player.PTS * 0.3;}
	return total;
};

//Parsing file with fs. 
//Note: in the future I may want to add to this by allowing it to grab data from a database
//      that can host data that it pulls from a website so that all data is live.
var allStats; //will contain all player stats from the 13-14 JSON
fs.readFile('./nba15-16.json', 'utf8', function (err, data) { 
//parsing JSON into allStats
	if (err) throw err;
	allStats = JSON.parse(data);
});

//get request to handle client requests containing 2 names
app.get('/players/:name1/:name2', function(req,res) {
	var playersData = {}; 
	//playersData will contain the 2 objects of all their stats from allStats that are relevant
	var playersName = { //inserts the client-requested names into this object
		one: req.params.name1,
		two: req.params.name2
	};

	for (var i = 0; i < allStats.length; i++) {
		if (allStats[i].Player == playersName.one) {
			//JSON.parse(JSON.stringify(x)) will allow u to copy 
			//NON COMPLEX(wihtout functions) objects without reference
			playersData.one = JSON.parse(JSON.stringify(allStats[i]));
			boxScore(playersData.one);
		}
		if(allStats[i].Player == playersName.two) {
			//var box = boxScore(allStats.[i]);
			playersData.two = JSON.parse(JSON.stringify(allStats[i]));
			boxScore(playersData.two);
		}
	}
	if(playersData.one && playersData.two) {
		console.log('received both player data');
		//send to client 3 values in 1 object:
		//	objectA = {winning player, player1 stats: {}, player2 stats: {}}
		var scoreOne = scoreFunc(playersData.one);
		var scoreTwo = scoreFunc(playersData.two);
		playersData.one.score = scoreOne;
		playersData.two.score = scoreTwo;
		/*scoreOne += Math.round(playersData.one.AST * rand * 1);
		scoreOne += Math.round(playersData.one.BLK * rand * 1.75);
		scoreOne += Math.round(playersData.one.STL * rand * 2);
		scoreOne += Math.round(playersData.one.TRB * rand * 1);
		scoreOne += Math.round(playersData.one.PTS * rand * 1);
		scoreOne -= Math.round(playersData.one.TOV * rand * 1.75);
		if (playersData.one['FG%'] > 0.5)
			{scoreOne += playersData.one.PTS * 0.25;}*/
		res.end(JSON.stringify(playersData));
		//res.end takes only html, res.send can take other content types
	}
	else {console.log('data was not received correctly: ' + playersData.one.PLAYER + playersData.two.PLAYER);}
});

//players = {one: name, two: name}
//var nbaData = require('./nba_data_5-10.csv');

// jquery, express/node, mongodb, js fundamentals, css

//this is HMLHttpRequest, AJAX, LEARN IT!
// var client = new XMLHttpRequest();
// client.open('GET', '/foo.txt');
// client.onreadystatechange = function() {
//   alert(client.responseText);
// }
// client.send();