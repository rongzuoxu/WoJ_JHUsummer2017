// global variables to be shred by functions and to be updated throughthour the game
var category;  // category of the problem
//var num;     // to record doolar amout for the question to be answered
var intervalId; // will be used to record time
var gameRound; // to record round of games
var allCategories = [];
var availableCategories = {}; // to list category of questions that have unanswered question.
var spinRound; // to record the round of the wheels being spinned
var currentPlayer; // to record the current player
var player1, player2, player3, player4; // to record 4 players
var numOfPlayers;
var players = [];

// start the game
$(document).ready(function(){
	  numOfPlayer = prompt("Please enter number of players (up to 4)");
	  addPlayers(numOfPlayer);
	 // player1 = new Player("Tom", "player1");
	  // player2 = new Player("Mary", "player2");
	  // player3 = new Player("Jack", "player3");
	  // player4 = new Player("Alice", "player1");
	 // player1.name = prompt("Please enter the 1st player's name");
	  // player2.name = prompt("Please enter the 2nd player's name");
	   // player3.name = prompt("Please enter the 3rd player's name");
		// player4.name = prompt("Please enter the 4th player's name");
	  addPlayerNames(playGame);
	 // addPlayerNames();
	 //  playGame();
   
});

function addPlayers(numOfPlayers, callback){
	for(var i = 0; i <= numOfPlayers; i++){
		players.push(new Player("player" + i, "player" + i));
		console.log("new player is:" + players[i].name );
	 	console.log("players length: " + players.length);
	}
	
	if (callback && typeof(callback) === "function") { 
        callback(); 
    }  
}

function addPlayerNames(callback){
		$('#myModal3').modal('show');
	/*	$('#inputPlayer1Name').focusout(function(){
			players[1].name = $(this).val();
			
			console.log("new player 1 name input is:" + $(this).val()); 
			console.log("new player1 is: " + player1);
		 });
		 $('#inputPlayer2Name').focusout(function(){
			players[2].name = $(this).val();
			
			console.log("new player 2 name input is:" + $(this).val()); 
		 });
		 $('#inputPlayer3Name').focusout(function(){
			players[3].name = $(this).val();
			
			console.log("new player 3 name input is:" + $(this).val()); 
		 });
		 $('#inputPlayer1Name').focusout(function(){
			players[4].name = $(this).val();
			
			console.log("new player 1 name input is:" + $(this).val()); 
		 });
		*/
		
		$('#inputPlayers').click(function(){
			players[1].name = $('#inputPlayer1Name').val();
			players[2].name = $('#inputPlayer2Name').val();
			players[3].name = $('#inputPlayer3Name').val();
			players[4].name = $('#inputPlayer4Name').val();
					player1 = players[1];
		            player2 = players[2];
		            player3 = players[3];
		            player4 = players[4]; 
			$('#myModal3').modal('hide');
		console.log("player1 is: " + player1.name);
		console.log("line 71 executed");	
		//	playGame();
			if (callback && typeof(callback) === "function") { 
				callback();
				}
		});

		
   
}

// Load the jeopardy question to Modal
function loadContent(question){
  $(".modal-title").text("Jeopardy Question");
  $("#modalText").text("");
  $("#modalText").text(question["question"]);
}


// Show the correct answer 
function  showAnswer(question){
   //clearInterval(intervalId);
   $('#timer').text(""); 
   $(".modal-title").text("Corect Answer is...");  
   $("#modalText").text(question["answer"]);
   $('#correct-answer').addClass("hide");
    setTimeout(function(){
      $('#addPoints').removeClass("hide");
      $('#noPoints').removeClass("hide");   
      }, 100); 
	  console.log('execute line 38');
} 
 
// add points to the players
function winPoints(question){
    // console.log( "Total wealth is: " + $('#player1').text().replace("$", ""));
     var newScore;
    // console.log('execute line 45');
	 if (gameRound === 1){
		console.log( "Current score: " + currentPlayer.roundOneScore);
		console.log( "Earned points: " + Number(question["value"].replace("$", "")));
	    newScore = currentPlayer.roundOneScore + Number(question["value"].replace("$", ""));
        currentPlayer.roundOneScore = newScore;
        console.log( currentPlayer.name + " new total score: " + currentPlayer.roundOneScore);
       	   
	 } else if (gameRound === 2){
	    newScore = Number(currentPlayer.roundTwoScore) + Number(question["value"].replace("$", ""));
     //   console.log( currentPlayer.name + " : " + newScore);
        currentPlayer.roundTwoScore = newScore;		
	 }
    
     $("#modalText").html(currentPlayer.name  + ", you win " + question["value"] + "!<br>" + "Your total wealth is $" + newScore + " !!");
     $('#addPoints').addClass("hide");
     $('#noPoints').addClass("hide");
     $('#closeBtn').removeClass("hide"); 
	 return false;
}

// deduct points to the players
function losePoints(question){
    // console.log( "Total wealth is: " + $('#player1').text().replace("$", ""));
     var newScore;
     var currentScore;
     console.log('execute line 72');
	 if (gameRound == 1){
		 currentScore = Number(currentPlayer.roundOneScore);
	 } else {
		currentScore = Number(currentPlayer.roundTwoScore); 
	 }
	 
	 if (currentPlayer.freeTurn > 0){
		 if(confirm( currentPlayer.name + ", will you use free return to avoid points deduction?")){
			currentPlayer.freeTurn--;
            newScore = currentScore;
            $("#modalText").html( currentPlayer.name + ", you don't lose points!<br>" + "Your total wealth is $" + newScore + " !!");			
		 } else{
			 newScore = currentScore - Number(question["value"].replace("$", "")); 
			  $("#modalText").html( currentPlayer.name + ", you lose " + question["value"] + "!<br>" + "Your total wealth is $" + newScore + " !!");
		 } 
	 }else {
     newScore = currentScore - Number(question["value"].replace("$", ""));
	  $("#modalText").html( currentPlayer.name + ", you lose " + question["value"] + "!<br>" + "Your total wealth is $" + newScore + " !!");
	 }
	 
	 if (gameRound == 1){
		  currentPlayer.roundOneScore = newScore;
	 } else {
		  currentPlayer.roundTwoScore = newScore; 
	 }
	 
    
    // $('#player1').text("$" + newScore); 
     $('#addPoints').addClass("hide");
     $('#noPoints').addClass("hide");
     $('#closeBtn').removeClass("hide"); 
	 console.log('execute line 104');
}

//restore the modal to initial condition
function clearModal(){
	$('#modalText').text("");
    $('#timer').removeClass("hide"); 
    $('#correct-answer').removeClass("hide");
    $('#addPoints').addClass("hide");
    $('#noPoints').addClass("hide");
    $('#closeBtn').addClass("hide");
}

// Activate the 30-second back counting timer   
function setTimer(question){
var seconds = 5;
 intervalId = setInterval(function() {
    $('#timer').text(seconds + "s left...");  
     seconds = seconds - 1;
  if (seconds < 0) {
    clearInterval(intervalId);
    showAnswer(question); 
  }
}, 1000);
}   

function playGame(){
	initRoundOne();
	refreshGameboard();
	console.log( "Current player is: " + currentPlayer.name);
		alert('Click the "Spin Wheel" button to start a round');
		
	$('#spinWheel').off().unbind().on( 'click', function(){
	 // $('#spinWheel').addClass("hide");
	  playRound();
	});
	
	$('#nextPlayer').click(function(){
	 nextPlayer();
	});

}

function playRound(){
       console.log( "Current player is: " + currentPlayer.name);
	  spinWheel();
	 // checkStatus();
}

function Player(name, id) {
	this.name = name;
	this.id = id;
	this.roundOneScore = 0;
	this.roundTwoScore = 0;
	this.freeTurn = 0;
}

function initRoundOne(){
          // set players 
       //  player1 = new Player("Tom", "player1");
       //  player2 = new Player("Mary", "player2");
       //  player3 = new Player("Jack", "player3");
       //  player4 = new Player("Alice", "player4");		 
         
		 // displayers name
        $('#player1name').text(player1.name);
        $('#player2name').text(player2.name);
        $('#player3name').text(player3.name);
        $('#player4name').text(player4.name);
		
         // set game status  
         spinRound = 1;
         gameRound = 1;
         
          // set available question categories 
		 allCategories = Object.keys(oJeopardy_round1);  
		 
		 for(var item in allCategories){
		//	 console.log("item is: " + allCategories[item]);
			 availableCategories[allCategories[item]] = 0;
		 }

          // set current player
           currentPlayer = player1;  

		// initiate question dashboard
		
		for(var i in allCategories){
			for(var j = 1; j <= 5; j++){
				var displayid =  "#" + allCategories[i].toLowerCase() + "_" + j;
				$(displayid).text(oJeopardy_round1[allCategories[i]][j-1]['value']);
			}
		}
		   
		   $('#currentPlayer').text(currentPlayer.name);
		   
		  console.log("The current player is " + currentPlayer.name); 
}

function initRoundTwo(){

         // set game status  
         spinRound = 1;
         gameRound = 2;
         
		 // remove class
		 $('#questionBoard').find('p').removeClass('hide');
		 
        // refresh money for each siaplay

        for(var i in allCategories){
			for(var j = 1; j <= 5; j++){
				var displayid =  "#" + allCategories[i].toLowerCase() + "_" + j;
				$(displayid).removeClass('hide');
				$(displayid).text(oJeopardy_round2[allCategories[i]][j-1]['value']);
			}
		}
		 
          // set available question categories 
         for(var item in allCategories){
			 availableCategories[allCategories[item]] = 0;
		 }         
		 console.log("The content of the availableCategories is " + availableCategories);
          // set current player
           currentPlayer = player1;  
}

function announceWinner(){
        var p1tscore = player1.roundOneScore + player1.roundTwoScore;//calculate player1 total score
		var p2tscore = player2.roundOneScore + player2.roundTwoScore;//calculate player2 total score
		var p3tscore = player3.roundOneScore + player3.roundTwoScore;//calculate player3 total score
		var p4tscore = player4.roundOneScore + player4.roundTwoScore;//calculate player4 total score
		
		var highest = Math.max(p1tscore, p2tscore, p3tscore, p4tscore);
		var winner = [];
		
		if(highest === p1tscore) {
			winner.push(player1.name);
		}  
		if(highest === p2tscore) {
			winner.push(player2.name);
		} 
		if(highest === p1tscore) {
			winner.push(player3.name);
		} 
		if(highest === p1tscore) {
			winner.push(player4.name);
		}
		 if (winner.length === 1){
			 alert(winner + " is the winner!" );
		 } else {
			 alert(winner + " are the winners!" ); 
		 }
		 alert(winner + " is (are) the winner!" );
		 
	    if(confirm("Play this game again?")){
			 playGame();
		 }else{
			 window.close();
			}
}

// use this function to select the question from a quaestion catogery that is still unanswered.
function fetchQuestion(questionCategory){
  var source;
  if (gameRound === 1){
	  source = oJeopardy_round1;
  } else {
	  source = oJeopardy_round2;
  }
    var displayid;
    var pos = availableCategories[questionCategory] + 1;
    displayid =  "#" + questionCategory.toLowerCase() + "_" + pos;
    console.log("execute line 276");
    console.log("the displayid is " + displayid);
    $(displayid).addClass('hide');
    var question;
  
  question = source[questionCategory][availableCategories[questionCategory]];

if(availableCategories[questionCategory] < source[questionCategory].length -1){
	availableCategories[questionCategory]++;
	// code could be added to disable the display of question besing selected.
	console.log("available question is: " + availableCategories[questionCategory] );
} else {
	delete availableCategories[questionCategory];
}
   console.log(question["question"]);
  return question;
}


// use this function to display ans fetch questions
function displayFetchAnswerQuestion(){
	
	var btnHtml = "";
	$('#availableQCategories').html(btnHtml); // to clear the content in the Modal2.
	
    for(var key in availableCategories){
		btnHtml += '<button id=' + 'question_' + key + ' type="button" class="btn btn-default qCategoryBtn">' + key + '</button>';
	}
	
	$('#availableQCategories').html(btnHtml); // load in new content;
	$('#myModal2').modal('show');
	
    selectQuestion();	
	
	//if ($('.qCategoryBtn').clicked == true){
	//	var questionCategory;
	//	questionCategory = $(this).attr('id').split("_")[1];
	 //   $('#myModal2').modal('hide');
	//	return fetchQuestion(questionCategory);		
		
	//}else {
	 //  displayFetchQuestion();
	//}
	
}

//Use the following function to select a question

function selectQuestion(){
	$('.qCategoryBtn').click(function(){
	   var questionCategory;
	    questionCategory = $(this).attr('id').split("_")[1];
		console.log('execute line 328');
		console.log("question category is: " + questionCategory);
	    $('#myModal2').modal('hide');
	   answerQuestion(fetchQuestion(questionCategory));	
	});	
}
// use this function to invoke the function answer process.

    // ---------------- This function to be modified 
function answerQuestion(question){
     
      loadContent(question); 
       $('#myModal').modal('show');
	   
     /* setTimeout(function(){
        $('#myModal').modal('show');
    
        setTimer(question);
      }, 200);     */

   $('#correct-answer').click(function(){
       //clearInterval(intervalId);
      showAnswer(question); 
   });
   
   $('#addPoints').unbind().click(function(){
      winPoints(question);       
   });
   
   $('#noPoints').unbind().click(function(){
      losePoints(question);  
   });
   
    $('#closeBtn').unbind().click(function(){
       clearModal(); 
	   updateGameboard();
	   $('#myModal').modal('hide');
      
	});
}

function spinWheel(){
   // generate a random number between 0 and 11 (both ends inclusive).
   checkStatus();
   var luckyNum = Math.floor((Math.random() * 12));
   console.log("current player is: " + currentPlayer.name);
   console.log("execute line 293");
   // future the spin of the wheel will be added here.   
	    switch(luckyNum){
		    case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
		            console.log("The question category number is: " + allCategories[luckyNum]);
					if (availableCategories.hasOwnProperty(allCategories[luckyNum])){
					  console.log("The lucky number is between 0 and 5: " + luckyNum);
					  console.log("The availability of question category: " + Object.keys(availableCategories));
					  var question = fetchQuestion(allCategories[luckyNum]);
					  answerQuestion(question);
                      spinRound++ ;					  
					 // checkStatus();
				  } else {
					  if(availableCategories.length == 0 || spinRound == 50){
						// checkStatus(); 
						console.log("line 306 executed");
					  }else {
						  spinRound++;
                          updateGameboard();						  
						  spinWheel();
					  } 
				  }
			    break;
			case 6: // lose turn
		          alert(currentPlayer.name + " , you lose this turn!");
				  console.log("you lose this turn");
				  if(currentPlayer.freeTurn > 0){ // here need a window to confirm it
					  if (confirm("would like to use a free turn?")){
						   if(availableCategories.length == 0 || spinRound == 50){
						// checkStatus(); 
					  }else {
						  spinRound++;
                          currentPlayer.freeTurn--;
                          updateGameboard();
                          alert("Spin again!");						  
						  $('#spinWheel').off().unbind().click(function(){
						       spinWheel();
						  });
					  }
					  } 
				  } else {
					   spinRound++;
					   updateGameboard();
				  }
				  
			    break; 
		    case 7: // free turn
			   alert(currentPlayer.name + " , you got a free turn!");
		        currentPlayer.freeTurn++;
				spinRound++;
				 updateGameboard();
				// checkStatus();
			    break;
			case 8: //bankrupt 
			   alert(currentPlayer.name + " , you bankrupt!")
		        if(gameRound === 1){
					if(currentPlayer.roundOneScore){
					currentPlayer.roundOneScore = 0;
					alert("your scorce is " + currentPlayer.roundOneScore);
					} else {
						alert("Your debt stays!");
					}
					
				} else if (gameRound == 2){
					if(currentPlayer.roundOneScore){
					currentPlayer.roundTwoScore = 0;
					alert("your scorce is " + currentPlayer.roundOneScore);
					} else {
						alert("Your debt stays!");
					}
				}
				spinRound++;
				updateGameboard();
			    break;
            case 9:  //player's choice
		           // create a model and list the question caterogies in availableCategories
				// if a question is selected, run the answerQuestion(question) function
				alert("player's choice!");
				console.log(availableCategories);
				
				if(!$.isEmptyObject(availableCategories)){
					displayFetchAnswerQuestion();
					 
				} else {
					alert('All questions are answered!');
				}
				
				spinRound++;
				updateGameboard();
			//	checkStatus();
				// $('#spinWheel').removeClass("disabled");
			    break;
			case 10: // Opponents Choice
		        // create a model and list the question caterogies in availableCategories
                // if a question is selected, run the answerQuestion(question) function
				alert("Opponent's choice!");
				console.log("Opponent's's choice!");
				
				if(!$.isEmptyObject(availableCategories)){
					var question = displayFetchAnswerQuestion();
					  
				} else {
					alert('All questions are answered!');
				}
				
				spinRound++;
				updateGameboard();
				checkStatus();
			//	$('#spinWheel').removeClass("disabled");
			    break; 
            case 11: // Spin again
			    alert("You can spin a second time... good luck!");
				console.log("spin again!");
				//$('#spinWheel').removeClass("disabled");
		        if(availableCategories.length == 0 || spinRound == 50){
						 //checkStatus(); 
					  } else {
						  spinRound++;
                          $('#currentSpin').text(spinRound);
                          updateGameboard();						  
						 $('#spinWheel').off().unbind().click(function(){
							spinWheel(); 
						 }); 
			    }
			//	checkStatus();
				break;	            
        }
}

//use this function to update the game status;
function checkStatus(){
           updateGameboard();
		   // check is round 1 is over
          if (gameRound === 1 && (availableCategories.length === 0 || spinRound >= 50)){
			  initRoundTwo();
			  refreshGameboard();
		  } else if (gameRound === 2 && (availableCategories.length === 0 || spinRound >= 50)){    // check if game is over
			 //if game is over, printout the winner
             announceWinner(); 
        } 
}  

function nextPlayer() {
			  // update status to continue the game
			 // spinRound++; // update spin round
			  
			  // update current player
			  if(currentPlayer.id === "player1"){
				  currentPlayer = player2;
			  } else if(currentPlayer.id === "player2"){
				  currentPlayer = player3;
			  } else if(currentPlayer.id === "player3"){
				  currentPlayer = player4;
			  } else if(currentPlayer.id === "player4"){
				  currentPlayer = player1;
			  }
              
			  $('#currentPlayer').text(currentPlayer.name);
			  //update availableCategories;
			  
			  // update contents			 
}


// Update display in the game board

function  updateGameboard(){
   
   if(gameRound === 1){
	//   console.log("executed line 409!!!");
    if(currentPlayer.id === "player1"){
		$('#p1score').text(currentPlayer.roundOneScore);
		$('#p1freeReturn').text(currentPlayer.freeTurn);
		player1.roundOneScore = currentPlayer.roundOneScore;
		player1.freeTurn = currentPlayer.freeTurn;
	} else if(currentPlayer.id === "player2"){
		$('#p2score').text(currentPlayer.roundOneScore);
		$('#p2freeReturn').text(currentPlayer.freeTurn);
		player2.roundOneScore = currentPlayer.roundOneScore;
		player2.freeTurn = currentPlayer.freeTurn;
	} else if(currentPlayer.id === "player3"){
		$('#p3score').text(currentPlayer.roundOneScore);
		$('#p3freeReturn').text(currentPlayer.freeTurn);
		player3.roundOneScore = currentPlayer.roundOneScore;
		player3.freeTurn = currentPlayer.freeTurn;
	} else if(currentPlayer.id === "player4"){
		$('#p4score').text(currentPlayer.roundOneScore);
		$('#p4freeReturn').text(currentPlayer.freeTurn);
		player4.roundOneScore = currentPlayer.roundOneScore;
		player4.freeTurn = currentPlayer.freeTurn;
	}    
   } else if(gameRound === 2){
    if(currentPlayer === player1){
		$('#p1score').text(currentPlayer.roundTwoScore);
		$('#p1freeReturn').text(currentPlayer.freeTurn);
		player1.roundTwoScore = currentPlayer.roundTwoScore;
		player1.freeTurn = currentPlayer.freeTurn;
	} else if(currentPlayer === player2){
		$('#p2score').text(currentPlayer.roundTwoScore);
		$('#p2freeReturn').text(currentPlayer.freeTurn);
		player2.roundTwoScore = currentPlayer.roundTwoScore;
		player2.freeTurn = currentPlayer.freeTurn;
	} else if(currentPlayer === player3){
		$('#p3score').text(currentPlayer.roundTwoScore);
		$('#p3freeReturn').text(currentPlayer.freeTurn);
		player3.roundTwoScore = currentPlayer.roundTwoScore;
		player3.freeTurn = currentPlayer.freeTurn;
	} else if(currentPlayer === player4){
		$('#p4score').text(currentPlayer.roundTwoScore);
		$('#p4freeReturn').text(currentPlayer.freeTurn);
		player4.roundTwoScore = currentPlayer.roundTwoScore;
		player4.freeTurn = currentPlayer.freeTurn;
	}    
   }
   
   //$('#spinWheel').removeClass("disabled");
   $('#currentRound').text(gameRound);
   $('#currentSpin').text(spinRound);
  
  
}

function refreshGameboard(){
	 $('#currentRound').text(gameRound);
     $('#currentSpin').text(spinRound);
	 $('#currentPlayer').text(currentPlayer.name);
     $('#p1score').text(0);
	 $('#p1freeReturn').text(0);
     $('#p2score').text(0);
	 $('#p2freeReturn').text(0);
     $('#p3score').text(0);
	 $('#p3freeReturn').text(0);
     $('#p4score').text(0);
	 $('#p4freeReturn').text(0);	 
}



var oJeopardy_round1 = {
      "HISTORY":[{"question" : "For the last 8 years of his life, Galileo was under house arrest for espousing this man's theory", "value": "$200", "answer": "Copernicus", "used": "false"},{"question": "'Built in 312 B.C. to link Rome & the South of Italy, it's still in use today'", "value": "$400", "answer": "the Appian Way", "used": "false"}, {"question": "'In 1000 Rajaraja I of the Cholas battled to take this Indian Ocean island now known for its tea'", "value": "$600", "answer": "Ceylon (or Sri Lanka)", "used": "false"},{"question": "'Karl led the first of these Marxist organizational efforts; the second one began in 1889'", "value": "$800", "answer": "the International", "used": "false"}, {"question": "'This Asian political    party was founded in 1885 with \"Indian National\" as part of its name'", "value": "$1000", "answer": "the Congress Party", "used": "false"}], 

      "ATHLETES":[{"question": "'No. 2: 1912 Olympian; football star at Carlisle Indian School; 6 MLB seasons with the Reds, Giants & Braves'", "value": "$200", "answer": "Jim Thorpe", "used": "false"}, {"question": "'No. 8: 30 steals for the Birmingham Barons; 2,306 steals for the Bulls'", "value": "$400", "answer": "Michael Jordan", "used": "false"}, {"question": "'No. 1: Lettered in hoops, football & lacrosse at Syracuse & if you think he couldn't act, ask his 11 \"unclean\" buddies'", "value": "$600", "answer": "Jim Brown", "used": "false"}, {"question": "'No. 10: FB/LB for Columbia U. in the 1920s; MVP for the Yankees in '27 & '36; \"Gibraltar in Cleats\"'", "value": "$800", "answer": "(Lou) Gehrig", "used": "false"}, {"question": "'No. 5: Only center to lead the NBA in assists; track scholarship to Kansas U.; marathoner; volleyballer'", "value": "$1000", "answer": "(Wilt) Chamberlain", "used": "false"}], 
	  
      "EVERYBODY":[{"question": "'The city of Yuma in this state has a record average of 4,055 hours of sunshine each year'", "value": "$200", "answer": "Arizona", "used": "false"},{"question": "'In the winter of 1971-72, a record 1,122 inches of snow fell at Rainier Paradise Ranger Station in this state'", "value": "$400", "answer": "Washington", "used": "false"},{"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$600", "answer": "the UV index", "used": "false"}, {"question": "'Africa's lowest temperature was 11 degrees below zero in 1935 at Ifrane, just south of Fez in this country'", "value": "$800", "answer": "Morocco", "used": "false"}, {"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$1000", "answer": "the UV index", "used": "false"}], 
	  
      "COMPANY":[{"question": "'In 1963, live on \"The Art Linkletter Show\", this company served its billionth burger'", "value": "$200", "answer": "McDonald\\'s", "used": "false"},{"question": "'This housewares store was named for the packaging its merchandise came in & was first displayed on'", "value": "$400", "answer": "Crate & Barrel", "used": "false"}, {"question": "'This company's Accutron watch, introduced in 1960, had a guarantee of accuracy to within one minute a  month'", "value": "$600", "answer": "Bulova", "used": "false"}, {"question": "'Edward Teller & this man partnered in 1898 to sell high fashions to women'", "value": "$800", "answer": "(Paul) Bonwit", "used": "false"},{"question": "'The Kirschner brothers, Don & Bill, named this ski company for themselves & the second-highest mountain'", "value": "$1000", "answer": "K2", "used": "false"}],
	  
      "TRIBUTES":[{"question": "'Signer of the Dec. of Indep., framer of the Constitution of Mass., second President of the United States'", "value": "$200", "answer": "John Adams", "used": "false"},{"question": "'\"And away we go\"'", "value": "$400", "answer": "Jackie Gleason", "used": "false"}, {"question": "'Outlaw: \"Murdered by a traitor and a coward whose name is not worthy to appear here\"'", "value": "$600", "answer": "Jesse James", "used": "false"}, {"question": "'1939 Oscar winner: \"...you are a credit to your craft, your race and to your family\"'", "value": "$800", "answer": "Hattie McDaniel (for her role in Gone with the Wind)", "used": "false"}, {"question": "'Revolutionary War hero: \"His spirit is in Vermont now\"'", "value": "$1000", "answer": "Ethan Allen", "used": "false"}], 
	  
      "WORDS":[{"question": "'In the title of an Aesop fable, this insect shared billing with a grasshopper'", "value": "$200", "answer": "the ant", "used": "false"},{"question": "'Cows regurgitate this from the first stomach to the mouth & chew it again'", "value": "$400", "answer": "the cud", "used": "false"}, {"question": "'A small demon, or a mischievous child (who might be a little demon!)'", "value": "$600", "answer": "imp", "used": "false"}, {"question": "'In geologic time one of these, shorter than an eon, is divided into periods & subdivided into epochs'", "value": "$800", "answer": "era", "used": "false"}, {"question": "'A single layer of paper, or to perform one's craft diligently'", "value": "$1000", "answer": "ply", "used": "false"}]
       };

var oJeopardy_round2 = {
     "HISTORY":[{"question" : "For the last 8 years of his life, Galileo was under house arrest for espousing this man's theory", "value": "$200", "answer": "Copernicus", "used": "false"},{"question": "'Built in 312 B.C. to link Rome & the South of Italy, it's still in use today'", "value": "$400", "answer": "the Appian Way", "used": "false"}, {"question": "'In 1000 Rajaraja I of the Cholas battled to take this Indian Ocean island now known for its tea'", "value": "$600", "answer": "Ceylon (or Sri Lanka)", "used": "false"},{"question": "'Karl led the first of these Marxist organizational efforts; the second one began in 1889'", "value": "$800", "answer": "the International", "used": "false"}, {"question": "'This Asian political    party was founded in 1885 with \"Indian National\" as part of its name'", "value": "$1000", "answer": "the Congress Party", "used": "false"}], 

      "ATHLETES":[{"question": "'No. 2: 1912 Olympian; football star at Carlisle Indian School; 6 MLB seasons with the Reds, Giants & Braves'", "value": "$200", "answer": "Jim Thorpe", "used": "false"}, {"question": "'No. 8: 30 steals for the Birmingham Barons; 2,306 steals for the Bulls'", "value": "$400", "answer": "Michael Jordan", "used": "false"}, {"question": "'No. 1: Lettered in hoops, football & lacrosse at Syracuse & if you think he couldn't act, ask his 11 \"unclean\" buddies'", "value": "$600", "answer": "Jim Brown", "used": "false"}, {"question": "'No. 10: FB/LB for Columbia U. in the 1920s; MVP for the Yankees in '27 & '36; \"Gibraltar in Cleats\"'", "value": "$800", "answer": "(Lou) Gehrig", "used": "false"}, {"question": "'No. 5: Only center to lead the NBA in assists; track scholarship to Kansas U.; marathoner; volleyballer'", "value": "$1000", "answer": "(Wilt) Chamberlain", "used": "false"}], 
	  
      "EVERYBODY":[{"question": "'The city of Yuma in this state has a record average of 4,055 hours of sunshine each year'", "value": "$200", "answer": "Arizona", "used": "false"},{"question": "'In the winter of 1971-72, a record 1,122 inches of snow fell at Rainier Paradise Ranger Station in this state'", "value": "$400", "answer": "Washington", "used": "false"},{"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$600", "answer": "the UV index", "used": "false"}, {"question": "'Africa's lowest temperature was 11 degrees below zero in 1935 at Ifrane, just south of Fez in this country'", "value": "$800", "answer": "Morocco", "used": "false"}, {"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$1000", "answer": "the UV index", "used": "false"}], 
	  
      "COMPANY":[{"question": "'In 1963, live on \"The Art Linkletter Show\", this company served its billionth burger'", "value": "$200", "answer": "McDonald\\'s", "used": "false"},{"question": "'This housewares store was named for the packaging its merchandise came in & was first displayed on'", "value": "$400", "answer": "Crate & Barrel", "used": "false"}, {"question": "'This company's Accutron watch, introduced in 1960, had a guarantee of accuracy to within one minute a  month'", "value": "$600", "answer": "Bulova", "used": "false"}, {"question": "'Edward Teller & this man partnered in 1898 to sell high fashions to women'", "value": "$800", "answer": "(Paul) Bonwit", "used": "false"},{"question": "'The Kirschner brothers, Don & Bill, named this ski company for themselves & the second-highest mountain'", "value": "$1000", "answer": "K2", "used": "false"}],
	  
      "TRIBUTES":[{"question": "'Signer of the Dec. of Indep., framer of the Constitution of Mass., second President of the United States'", "value": "$200", "answer": "John Adams", "used": "false"},{"question": "'\"And away we go\"'", "value": "$400", "answer": "Jackie Gleason", "used": "false"}, {"question": "'Outlaw: \"Murdered by a traitor and a coward whose name is not worthy to appear here\"'", "value": "$600", "answer": "Jesse James", "used": "false"}, {"question": "'1939 Oscar winner: \"...you are a credit to your craft, your race and to your family\"'", "value": "$800", "answer": "Hattie McDaniel (for her role in Gone with the Wind)", "used": "false"}, {"question": "'Revolutionary War hero: \"His spirit is in Vermont now\"'", "value": "$1000", "answer": "Ethan Allen", "used": "false"}], 
	  
      "WORDS":[{"question": "'In the title of an Aesop fable, this insect shared billing with a grasshopper'", "value": "$200", "answer": "the ant", "used": "false"},{"question": "'Cows regurgitate this from the first stomach to the mouth & chew it again'", "value": "$400", "answer": "the cud", "used": "false"}, {"question": "'A small demon, or a mischievous child (who might be a little demon!)'", "value": "$600", "answer": "imp", "used": "false"}, {"question": "'In geologic time one of these, shorter than an eon, is divided into periods & subdivided into epochs'", "value": "$800", "answer": "era", "used": "false"}, {"question": "'A single layer of paper, or to perform one's craft diligently'", "value": "$1000", "answer": "ply", "used": "false"}]
       };



