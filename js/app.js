console.log('loaded');
// ---------- PSEUDO CODE-------------

// 1. Wait for player to click start
// 2. Start a round, which follows these steps
// 3. Add a random number (1-4) to the sequence
// 4. Animate the sequence to the user
// 5. Enable user interaction with the board, and register any clicks on the Simon tiles
// 6. While the player has not entered an incorrect response, and the number of clicks is less than the length of the sequence, wait for player input
// 7. Continue adding rounds until the player loses

// -----------RESOURCES----------------

// https://codepen.io/BenLBlood/pen/LGLEoJ
// https://codeplanet.io/building-simon-says-javascript/

$(document).ready(function() {

  var colors = ['green', 'red', 'blue', 'yellow'];
  var computerMoves = [];
  var playerMoves = [];
  var isOn = false;
  var strict = false;
  var timeInterval = 800;
  var pauseInterval = 200;
  var winningMoves = 20;
  var movesDisplay;
  var victoryDisplay;

  $('#greenSound').get(0).volume = 0.8;
  $('#redSound').get(0).volume = 0.8;
  $('#yellowSound').get(0).volume = 0.8;
  $('#blueSound').get(0).volume = 0.8;
  $('#errorSound').get(0).volume = 0.2;
  $('#victorySound').get(0).volume = 0.2;

  $('.switch-box').click(function(){
    if (isOn) { // switch off
      $('.switch').css('float', 'left');
      $('.level').removeClass('level-red');
      $('.color-button').removeClass('clickable');
      $('.color-button').addClass('unclickable');
      $('.level').text('--');
      $('.strict-light').removeClass('strict-light-on');
      $('.start button').removeClass('unclickable');
      clearInterval(movesDisplay);
      clearInterval(victoryDisplay);
      deactivateAll();
      reset();
    }else { // switch on
      $('.switch').css('float', 'right');
      $('.level').text('--');
      $('.level').addClass('level-red');
    }
    isOn = !isOn;
  });

  $('.strict button').click(function() {
    if (isOn) {
      if (strict) {
        $('.strict-light').removeClass('strict-light-on');
      }else {
        $('.strict-light').addClass('strict-light-on');
      }
      strict = !strict;
    }
  });

  $('.start button').click(function() {
    if (isOn) {
      clearInterval(movesDisplay);
      clearInterval(victoryDisplay);
      deactivateAll();
      $('.start button').addClass('unclickable');
      $('.level').text('--');
      computerMoves = [];
      playerMoves = [];
      computerMoves.push(colors[Math.floor(Math.random() * colors.length)]);
      $('.level').fadeOut(0).delay(200).fadeIn(0).delay(200).fadeOut(0).delay(200).fadeIn(0).delay(200).fadeOut(0).delay(200).queue(function() {
        $('.level').text(computerMoves.length);
        $('.level').fadeIn(0);
        setTimeout(function(){
          $('#' + computerMoves[0]).addClass(computerMoves[0] + '-active');
          $('#' + computerMoves[0] + 'Sound').get(0).play();
          setTimeout(function(){
            $('#' + computerMoves[0]).removeClass(computerMoves[0] + '-active');
            $('#' + computerMoves[0] + 'Sound').get(0).pause();
            $('#' + computerMoves[0] + 'Sound').get(0).currentTime = 0;
            $('.color-button').removeClass('unclickable');
            $('.color-button').addClass('clickable');
            $('.start button').removeClass('unclickable');
          }, timeInterval-pauseInterval);
        }, 500);
        $('.level').dequeue();
      });
    }
  });

  $('.color-button').click(function() {
    var colorClicked = $(this).attr('id');
    $('#' + colorClicked).addClass(colorClicked + '-active');
    playerMoves.push(colorClicked);
    $('.color-button').removeClass('clickable');
    $('.color-button').addClass('unclickable');
    if(playerMoves[playerMoves.length-1]===computerMoves[playerMoves.length-1]){ // correct color
      $('#' + colorClicked + 'Sound').get(0).play();
    }else { // wrong color
      $('#errorSound').get(0).play();
    }
    setTimeout(function(){
      $('#' + colorClicked).removeClass(colorClicked + '-active');
      if(playerMoves[playerMoves.length-1]===computerMoves[playerMoves.length-1]){ // correct color
        $('#' + colorClicked + 'Sound').get(0).pause();
        $('#' + colorClicked + 'Sound').get(0).currentTime = 0;
        if (playerMoves.length === computerMoves.length) { // correct round
          if (playerMoves.length === winningMoves) { // victory - game over!
            $('#victorySound').get(0).play();
            $('.level').text(':)');
            var flashTimes=20;
            var index=0;
            victoryDisplay = setInterval(victoryDisplayFunction, 100);
            function victoryDisplayFunction(){
              if(index>=flashTimes){
                activateAll();
                $('#victorySound').get(0).pause();
                $('#victorySound').get(0).currentTime = 0;
                clearInterval(victoryDisplay);
              }else {
                $('#' + colors[index%4]).addClass(colors[index%4] + '-active');
                setTimeout(function(){
                  $('#' + colors[index%4]).removeClass(colors[index%4] + '-active');
                  index++;
                }, 50);
              }
            }
          }else { // go to next level(round)
            playerMoves = [];
            computerMoves.push(colors[Math.floor(Math.random() * colors.length)]);
            $('.level').text(computerMoves.length);
            simonMoves(computerMoves, timeInterval);
          }
        }else { // wait for next player move
          $('.color-button').removeClass('unclickable');
          $('.color-button').addClass('clickable');
        }
      }else { // wrong color
        $('.level').text('!!');
        setTimeout(function(){
          $('#errorSound').get(0).pause();
          $('#errorSound').get(0).currentTime = 0;
          if(strict) {
            $('.start button').trigger('click');
          }else {
            playerMoves = [];
            $('.level').text(computerMoves.length);
            simonMoves(computerMoves, timeInterval);
          }
        }, 1500);
      }
    }, timeInterval-pauseInterval-100);
  });

  function simonMoves (computerMoves, timeInterval){
    var index=0;
    movesDisplay = setInterval(moveDisplay, timeInterval);
    function moveDisplay(){
      if(index>=computerMoves.length){
        $('.color-button').removeClass('unclickable');
        $('.color-button').addClass('clickable');
        clearInterval(movesDisplay);
      }else {
        $('#' + computerMoves[index]).addClass(computerMoves[index] + '-active');
        $('#' + computerMoves[index] + 'Sound').get(0).play();
        setTimeout(function(){
          $('#' + computerMoves[index]).removeClass(computerMoves[index] + '-active');
          $('#' + computerMoves[index] + 'Sound').get(0).pause();
          $('#' + computerMoves[index] + 'Sound').get(0).currentTime = 0;
          index++;
        }, timeInterval-pauseInterval);
      }
    }
  }
  function activateAll(){
    for(var i=0; i<colors.length; i++ ){
      $('#' + colors[i]).addClass(colors[i] + '-active');
    }
  }
  function deactivateAll(){
    for(var i=0; i<colors.length; i++ ){
      $('#' + colors[i]).removeClass(colors[i] + '-active');
    }
  }
  function reset() {
    computerMoves = [];
    playerMoves = [];
    strict = false;
  }

}); // end of (document).ready
