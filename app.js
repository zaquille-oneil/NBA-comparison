$(function() {
  $("#face-off-button").on("click", function() {
    console.log('hi');
  })
  $('form').on('submit', function(e) {
    e.preventDefault();

    var playerChoice = {};
    var playerData = {};
    //if i were to make dropdown functionality and error correction, here is the place to do it
    playerChoice.one = $('#player-choice-1').val();
    playerChoice.two = $('#player-choice-2').val();
    console.log(playerChoice);
    //ajax get request on the server.js for data from player choice 1 and 2
    $.ajax({
      method: 'GET',
      url: '/players/' + playerChoice.one + '/' + playerChoice.two
    }).success(function(data) {
      playerData = JSON.parse(data); 
      //JSON.parse(text) takes text back into code and JSON.stringify(text) takes any code back into text
      $('#player1_result').html(playerData.one.Player + ' ' + playerData.one.Pos
          + '<br>TOTAL SCORE: ' + Math.round(playerData.one.score)
          + '<br>  points: ' + playerData.one.PTS
          + '<br>  assists: ' + playerData.one.AST
          + '<br>  blocks: ' + playerData.one.BLK
          + '<br>  rebounds: ' + playerData.one.TRB
          + '<br>  steals: ' + playerData.one.STL
          + '<br>  turnovers: ' + playerData.one.TOV
          + '<br>  FG%: ' + playerData.one['FG%'] + '%'
          );
      $('#player2_result').html(playerData.two.Player + ' ' + playerData.two.Pos
          + '<br>TOTAL SCORE: ' + Math.round(playerData.two.score)
          + '<br>  points: ' + playerData.two.PTS
          + '<br>  assists: ' + playerData.two.AST
          + '<br>  blocks: ' + playerData.two.BLK
          + '<br>  rebounds: ' + playerData.two.TRB
          + '<br>  steals: ' + playerData.two.STL
          + '<br>  turnovers: ' + playerData.two.TOV
          + '<br>  FG%: ' + playerData.two['FG%'] + '%'
          );
      if (playerData.two.score > playerData.one.score) {
        $('#winner-result').html(playerData.two.Player + ' wins.');
      }
      else if (playerData.two.score < playerData.one.score) {
        $('#winner-result').html(playerData.one.Player + ' wins.');
      }
      else {
        $('#winner-result').html('Tie game');
      }
      // if (playerData.one.Tm == 'OKC') {
      //   $('#player1_result').css('background-color', 'orange');
      //   //$('#player1_result').css('font', 'blue');
      // }
      // else {$('#player1_result').css('background-color', 'white');}
      // if (playerData.two.Tm == 'GSW') {
      //   $('#player2_result').css('background-color', 'blue');
      //   //$('#player2_result').css('text-color', 'yellow');
      //}
    });

    //styling section
    $('div.container').css("display", "block");

  });
});
// var data;
// function handleFileSelect(evt) {
//   var file = evt.target.files[0];
//   var file = require('./nba_data_5-10.csv');
//   Papa.parse(file, {
//     header: true,
//     dynamicTyping: true,
//     complete: function(results) {
//       data = results;
//     }
//   });
// }
