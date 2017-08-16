// global variables to be shred by functions and to be updated throughthour the game
var category;  // category of the problem
var intervalId; // will be used to record time
var gameRound; // to record round of games
var allCategories = [];
var oJeopardy_questions;
var availableCategories = {}; // to list category of questions that have unanswered question.
var spinRound; // to record the round of the wheels being spinned
var currentPlayer; // to record the current player
var numOfPlayers;
var players = [];

// start the game
$(document).ready(function(){
	
	$("#myModal4").modal('show'); 
    
	$('#toEditQuestionFile').click(function(){
		$('#myModal4').modal('hide');
		openQuestionEditor();
	});
		
	$('#loadAquestionFile').click(function(){
		configModal4();
	});
	
	$('#freeTrial').click(function(){
		$('#myModal4').modal('hide');
		oJeopardy_questions = sampleQuestions;
		startGame();	
	});
});

// Use this modal to config a start popup window
function configModal4(){
	$("#myModal4").find(".modal-title").text("Upload a question file");
	
	$("#myModal4").find(".modal-body").html(
	   '<p>Select a File to Load: <br/><input type="file" id="fileToLoadIn"></p>');
	
    $("#myModal4").find(".modal-footer").html('<button id="fileToLoadInBtn">Load Selected File into Game</button>');
	
	$('#fileToLoadInBtn').click(function(){
		$('#myModal4').modal('hide');
		loadFileIntoGame(startGame);
	});	
}

// use this function to start a game
function startGame(){
	 gameRound = 1;
	 displayQuestions();
	enterNumOfPlayers(function(){
		 createPlayers(function(){
			 addPlayerNames(playGame);
		 });
	 });
}

// Use this function to input number of players
function enterNumOfPlayers(callback){
	 numOfPlayers = prompt("Please enter number of players (1 to 4)");
	 
	  if ( isNaN(numOfPlayers) || Number(numOfPlayers) <= 0 || Number(numOfPlayers) > 4){
		  alert("You entered a wrong number");
		  enterNumOfPlayers();
	  }
		  if (callback && typeof(callback) === "function") {
			  callback();
			  } 
}
	 
// use this function to create players
function createPlayers(callback){
	for(var i = 0; i < numOfPlayers; i++){
		players.push(new Player("player" + i, "player" + i));
	}
		 console.log("players length: " + players.length);
	if (callback && typeof(callback) === "function") { 
        callback(); 
    }  
}

// use this modal /popup window to load players' name
function configureModal3(){
	for(var i = players.length-1; i >=0; i--){
		var j = i + 1;
		$('#modal3PlayerInpput').prepend('<div class="form-group"><label class="control-label col-sm-2" for="inputPlayer' + j + 'Name">Player' + j + 
		'</label><div class="col-sm-4"><input type="text" minlength=1 class="form-control" id="inputPlayer' + j + 'Name" placeholder="Put player\'s name here"></div></div>');	
	}		
}

// use this function to add plyers
function addPlayerNames(callback){
	    configureModal3();
		$('#myModal3').modal('show');
				console.log("line 76 executed");
		$('#inputPlayers').click(function(){
			for(var item in players){
				var j = Number(item)+1;
				players[item].name =  $('#inputPlayer' + j + 'Name').val();
                console.log("player name is: " + players[item].name);
			}
			$('#myModal3').modal('hide');
		
		// display players name , score and free turns
		for(var item in players){
             $('#playersBoard').append('<div class ="col-md-2" id=player' + item + 'board><div name = "playername"><h4>' +
			 players[item].name + '</h4></div><div name = "playerscore">$0</div><div name= "playerFreeTurns">0</div></div>');
		}
		
		if (callback && typeof(callback) === "function") { 
				callback();
				}
	});		
}

// Load the jeopardy question to Modal
function loadContent(question, questionCategory){
  $(".modal-title").text("Jeopardy Question - " + questionCategory);
  $("#modalText").text("");
  $('#timer').text(""); 
  var qlist = question["question"].split('\n');
  $.each(qlist, function(index, value){
	  $("#modalText").append('<p>' + value + '</p>');	  
  });
}

// Show the correct answer 
function  showAnswer(question){
   $('#timer').text(""); 
   $("#modalText").text('');
   $(".modal-title").text("Corect Answer is...");  
     var qlist = question["answer"].split('\n');
     $.each(qlist, function(index, value){
	     $("#modalText").append('<p>' + value + '</p>');
     });
   $('#correct-answer').addClass("hide");
    setTimeout(function(){
      $('#addPoints').removeClass("hide");
      $('#noPoints').removeClass("hide");   
      }, 100); 
} 
 
// add points to the players
function winPoints(question){
     var newScore;
	 var questionValue;
	
	 if (gameRound == 1){
		questionValue =  Number(question["value"].replace("$", ""));
	    newScore = currentPlayer.roundOneScore + questionValue;
        currentPlayer.roundOneScore = newScore;  
        
	 } else if (gameRound == 2){
		questionValue =  Number(question["value"].replace("$", ""))*2;
	    newScore = Number(currentPlayer.roundTwoScore) + questionValue;
        currentPlayer.roundTwoScore = newScore;		
	 }
    
     $("#modalText").html(currentPlayer.name  + ", you win $" + questionValue + "!<br>" + "Your total wealth is $" + newScore + " !!");		
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
	 var points = 0;
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
			  if (gameRound == 1){
				  points = Number(question["value"].replace("$", "")); 
			  } else{
				  points = Number(question["value"].replace("$", "")) * 2; 
			  }
			  newScore = currentScore - points; 
			  $("#modalText").html( currentPlayer.name + ", you lose $" + points + "!<br>" + "Your total wealth is $" + newScore + " !!");
		 } 
	 }else {
              if (gameRound == 1){
				  points = Number(question["value"].replace("$", "")); 
			  } else{
				  points = Number(question["value"].replace("$", "")) * 2; 
			  }
			  newScore = currentScore - points; 
			  $("#modalText").html( currentPlayer.name + ", you lose $" + points + "!<br>" + "Your total wealth is $" + newScore + " !!");
	 }
	 
	 if (gameRound == 1){
		  currentPlayer.roundOneScore = newScore;
	 } else {
		  currentPlayer.roundTwoScore = newScore; 
	 }
	     
     $('#addPoints').addClass("hide");
     $('#noPoints').addClass("hide");
     $('#closeBtn').removeClass("hide"); 
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
var seconds = 15;
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
	  playRound();
	});
	
	$('#nextPlayer').click(function(){
	 nextPlayer();
	});
}

function playRound(){
       console.log( "Current player is: " + currentPlayer.name);
	  spinWheel();
}

function Player(name, id) {
	this.name = name;
	this.id = id;
	this.roundOneScore = 0;
	this.roundTwoScore = 0;
	this.totalScore = 0;
	this.freeTurn = 0;
}

function initRoundOne(){
		          
         // set game status  
         spinRound = 1;
         gameRound = 1;
         
          // set available question categories 
		 allCategories = Object.keys(oJeopardy_questions["oJeopardy_round1"]);  
		 
		 for(var item in allCategories){
		//	 console.log("item is: " + allCategories[item]);
			 availableCategories[allCategories[item]] = 0;
		 }

          // set current player
           currentPlayer = players[0];  

		// initiate question dashboard
		for(var i in allCategories){
			for(var j = 1; j <= 5; j++){
				var displayid =  "#" + allCategories[i].toLowerCase() + "_" + j;
				$(displayid).text(oJeopardy_questions["oJeopardy_round1"][allCategories[i]][j-1]['value']);
			}
		}
		   
		   $('#currentPlayer').text(currentPlayer.name);
		   
		  console.log("The current player is " + currentPlayer.name); 
}

function initRoundTwo(){
          // hide all modals
		  $('.modal').modal('hide');
         // set game status  
         spinRound = 1;
         gameRound = 2;
         
		 displayQuestions();
		 // remove class
		 $('#questionBoard').find('p').removeClass('hide');
		 
        // refresh money for each siaplay
        $.each(players, function(key, value){
			players[key].freeTurn = 0;
		});
		allCategories = Object.keys(oJeopardy_questions["oJeopardy_round2"]);
		
        for(var i in allCategories){
			for(var j = 1; j <= 5; j++){
				var displayid =  "#" + allCategories[i].toLowerCase() + "_" + j;
				$(displayid).removeClass('hide');
				$(displayid).text(oJeopardy_questions["oJeopardy_round2"][allCategories[i]][j-1]['value']);
			}
		}
		availableCategories = {};
        // set available question categories 
         for(var item in allCategories){
			 availableCategories[allCategories[item]] = 0;
		 }         
		 
          // set current player
           currentPlayer = players[0]; 
           confirm('Round two is ready for play!');		  
           
		   // update scoreboard
		    $('#playersBoard').html('<div class ="col-md-2 col-md-offset-1"><div><h6> &nbsp; </h6></div><div>Scores</div><div>Free Turns</div></div>');
			
		   for(var item in players){
             $('#playersBoard').append('<div class ="col-md-2" id=player' + item + 'board><div name = "playername"><h4>' +
			 players[item].name + '</h4></div><div name = "playerscore">$0</div><div name= "playerFreeTurns">0</div></div>');
		}		   
}

// display questions on the gameboard
function displayQuestions(){
	 var questions;
	 if (gameRound === 1){
		 questions = oJeopardy_questions["oJeopardy_round1"];
	 }else if(gameRound === 2){
		  questions = oJeopardy_questions["oJeopardy_round2"];
	 }
	 
	 var categories = ["category1_questions", "category2_questions", "category3_questions","category4_questions", "category5_questions", "category6_questions"]; 
	 var pos = 0;
	 $.each(questions, function(key, value){
	     $("#"+ categories[pos]).children("p").text(key);  
        	 
      var questionCount = 0;
	   var questions = ["question1", "question2", "question3", "question4", "question5"];	     
		$.each(value, function(key1, value1){
		      $("#"+ categories[pos]).find('p[name=' + questions[questionCount] +']').text(value1["value"]);  	 
			questionCount++;
		 });
	 
	    pos++; 
	 }); 
}

// Use this function to detect and announce the winner
function announceWinner(){

        var highestScore = Number.MIN_SAFE_INTEGER;

        $.each(players, function(key, value){
			players[key].totalScore = players[key].roundOneScore + players[key].roundTwoScore;
			if (players[key].totalScore > highestScore){
				highestScore = players[key].totalScore; 
			}
		});
		
		var winner = [];

		 $.each(players, function(key, value){
			 if (players[key].totalScore == highestScore){
				winner.push(players[key].name) 
			 }
		 });
		
		// display winner(s)!
		 if (winner.length === 1){
			 alert("Game over!\n" + winner + " is the winner!" );
		 } else {
			 alert("Game over!\n" + winner + " are the winners!" ); 
		 }
 
	    if(confirm("Play this game again?")){
			 window.location.reload();
		 }else{
			 window.close();
			}
}

// use this function to select the question from a quaestion catogery that is still unanswered.
function fetchQuestion(questionCategory){
  var source;
  if (gameRound === 1){
	  source = oJeopardy_questions["oJeopardy_round1"];
  } else {
	  source = oJeopardy_questions["oJeopardy_round2"];
  }
    var displayid;
	var catNum = allCategories.indexOf(questionCategory) + 1;
    var pos = Number(availableCategories[questionCategory]);
	var j = pos + 1;
    displayid =  "#category" + catNum + "_questions" ;
	var targetEl = 'p[name=question' + j + ']';
    $(displayid).find(targetEl).text(" ");
    var question;
    question = source[questionCategory][availableCategories[questionCategory]]

if(availableCategories[questionCategory] < source[questionCategory].length -1){
	availableCategories[questionCategory]++;
} else {
	delete availableCategories[questionCategory];
}
  return question;
}


// use this function to display and fetch questions
function displayFetchAnswerQuestion(){
	var btnHtml = "";
	$('#availableQCategories').html(btnHtml); // to clear the content in the Modal2.
	
    for(var key in availableCategories){
		btnHtml += '<button id=' + 'question_' + key + ' type="button" class="btn btn-default qCategoryBtn">' + key + '</button>';
	}
	
	$('#availableQCategories').html(btnHtml); // load in new content;
	$('#myModal2').modal('show');
	
    selectQuestion();	
	
}

//Use the following function to select a question

function selectQuestion(){
	$('.qCategoryBtn').click(function(){
	   var questionCategory;
	    questionCategory = $(this).attr('id').split("_")[1];
	    $('#myModal2').modal('hide');
	   answerQuestion(fetchQuestion(questionCategory), questionCategory);	
	});	
}
// use this function to invoke the function answer process.

function answerQuestion(question, questionCategory){
     
      loadContent(question, questionCategory); 
       $('#myModal').modal('show');
	   
      setTimeout(function(){    
        setTimer(question);
      }, 100);     

   $('#correct-answer').click(function(){
       clearInterval(intervalId);
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

function playRound(choice){
   // generate a random number between 0 and 11 (both ends inclusive).
   checkStatus();
   var luckyNum;
   // future the spin of the wheel will be added here.   
	    switch(choice){
		    case 'Category 1':
			case 'Category 2':
			case 'Category 3':
			case 'Category 4':
			case 'Category 5':
			case 'Category 6':
			        luckyNum = Number(choice.split(" ")[1]) - 1;
		            console.log("The question category number is: " + allCategories[luckyNum]);
					if (availableCategories.hasOwnProperty(allCategories[luckyNum])){
					  console.log("The availability of question category: " + Object.keys(availableCategories));
					  var question = fetchQuestion(allCategories[luckyNum]);
					  answerQuestion(question, allCategories[luckyNum]);
                      spinRound++ ;	
				  
					 // checkStatus();
				  } else {
					  if(availableCategories.length == 0 || spinRound >= 50){
						// checkStatus(); 
						console.log("line 306 executed");
					  }else {
						  spinRound++;
                          						  
						  alert("Questions in this category have all been answered! Spin wheel again!");
					  } 
				  }
				updateGameboard();
			    break;
			case 'Lose Turn': // lose turn
		          alert(currentPlayer.name + " , you lose this turn!");
				  console.log("you lose this turn");
				  if(currentPlayer.freeTurn > 0){ // here need a window to confirm it
					  if (confirm("would like to use a free turn?")){
						   if(availableCategories.length == 0 || spinRound >= 50){
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
		    case 'Free Turn': // free turn
			   alert(currentPlayer.name + " , you got a free turn!");
		        currentPlayer.freeTurn++;
				spinRound++;
				 updateGameboard();
				// checkStatus();
			    break;
			case 'Bankrupt': //bankrupt 
			   alert(currentPlayer.name + " , you are bankrupt!")
		        if(gameRound === 1){
					if(currentPlayer.roundOneScore >= 0){
					currentPlayer.roundOneScore = 0;
					alert("your scorce is " + currentPlayer.roundOneScore);
					} else {
						alert("Your debt stays!");
					}
					
				} else if (gameRound == 2){
					if(currentPlayer.roundTwoScore >= 0){
					currentPlayer.roundTwoScore = 0;
					alert("your scorce is " + currentPlayer.roundTwoScore);
					} else {
						alert("Your debt stays!");
					}
				}
				spinRound++;
				updateGameboard();
			    break;
            case 'P Choice':  //player's choice
		           // create a model and list the question caterogies in availableCategories
				// if a question is selected, run the answerQuestion(question) function
				alert("player's choice!");

				if(!$.isEmptyObject(availableCategories)){
					displayFetchAnswerQuestion();
					 
				} else {
					alert('All questions are answered!');
				}
				
				spinRound++;
				updateGameboard();

			    break;
			case 'O Choice': // Opponents Choice
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
            case 'Spin Again': // Spin again
			    if (confirm("You can spin a second time... good luck!")){
					resetWheel();
				};

		        if(availableCategories.length == 0 || spinRound >= 50){
					  } else {
						  spinRound++;
                          $('#currentSpin').text(spinRound);
                          updateGameboard();						  
						 $('#spinWheel').off().unbind().click(function(){
							spinWheel(); 
						 }); 
			    }

				break;	            
        }
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
					  var question = fetchQuestion(allCategories[luckyNum]);
					  answerQuestion(question, allCategories[luckyNum]);
                      spinRound++ ;					  
				  } else if (!availableCategories.hasOwnProperty(allCategories[luckyNum]) && !jQuery.isEmptyObject(availableCategories)){
					   alert("Switch to player's choice!");
					   displayFetchAnswerQuestion();
				  } 
				  else if(jQuery.isEmptyObject(availableCategories) || spinRound > 50){
					  } else {
						  spinRound++;
                          updateGameboard();						  
						  spinWheel();
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
				
				if(!jQuery.isEmptyObject(availableCategories)){
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
			    if(confirm("You can spin a second time... good luck!")){
					resetWheel();
				};

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
          if (gameRound === 1 && (jQuery.isEmptyObject(availableCategories) || spinRound > 5)){
			  initRoundTwo();
			  refreshGameboard();
		  } else if (gameRound === 2 && (jQuery.isEmptyObject(availableCategories) || spinRound > 5)){    // check if game is over
			 //if game is over, printout the winner
             announceWinner(); 
        } 
}  

// Use this function to update the current player 
function nextPlayer() {
	          checkStatus();
			  var idNum = Number(currentPlayer.id.slice(-1));
			  
			  if (idNum < players.length-1){
				  idNum++;
				  currentPlayer = players[idNum];
			  }else {currentPlayer = players[0];}
                $('#currentPlayer').text("");
			   $('#currentPlayer').show(500, 'linear', function(){
			        $('#currentPlayer').text(currentPlayer.name);	
			    });	
			
              resetWheel();			  
}


// Update display in the game board

function  updateGameboard(){
   var idNum = Number(currentPlayer.id.slice(-1));
   
   if(gameRound === 1){
	   //update the display in UI
	   $('#' + currentPlayer.id + 'board').find('div[name="playerscore"]').text('$' + currentPlayer.roundOneScore);
	   $('#' + currentPlayer.id + 'board').find('div[name="playerFreeTurns"]').text(currentPlayer.freeTurn);
	   
	   // update the player's object
	   players[idNum].roundOneScore = currentPlayer.roundOneScore;
	   players[idNum].freeTurn = currentPlayer.freeTurn;
	      
   } else if(gameRound === 2){
    	   //update the display in UI
	   $('#' + currentPlayer.id + 'board').find('div[name="playerscore"]').text('$' + currentPlayer.roundTwoScore);
	   $('#' + currentPlayer.id + 'board').find('div[name="playerFreeTurns"]').text(currentPlayer.freeTurn);
	   
	   // update the player's object
	   players[idNum].roundOneScore = currentPlayer.roundTwoScore;
	   players[idNum].freeTurn = currentPlayer.freeTurn;
	}    
   
   //$('#spinWheel').removeClass("disabled");
   $('#currentRound').text(gameRound);
   $('#currentSpin').text(spinRound);
    
  // resetWheel();
  
}
			 
			 
function refreshGameboard(){
	 $('#currentRound').text(gameRound);
     $('#currentSpin').text(spinRound);
	 $('#currentPlayer').text(currentPlayer.name);
	 
	 $('div[name=playerscore]').text("$0");
	 $('div[name="playerFreeTurns]').text(0);	 
}

function loadFileIntoGame(callback)
{
    var fileToLoad = document.getElementById("fileToLoadIn").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //document.getElementById("inputTextToSave").value = textFromFileLoaded;
        oJeopardy_questions = JSON.parse(textFromFileLoaded);
		console.log("The loaded file has the content: " + oJeopardy_questions);
		
		if (callback && typeof(callback) === "function") {
			  callback();
			  } 
    };
    fileReader.readAsText(fileToLoad, "UTF-8"); 
}






var sampleQuestions = { "oJeopardy_round1" : {
      "HISTORY":[{"question" : "For the last 8 years of his life, Galileo was under house arrest for espousing this man's theory", "value": "$200", "answer": "Copernicus", "used": "false"},{"question": "'Built in 312 B.C. to link Rome & the South of Italy, it's still in use today'", "value": "$400", "answer": "the Appian Way", "used": "false"}, {"question": "'In 1000 Rajaraja I of the Cholas battled to take this Indian Ocean island now known for its tea'", "value": "$600", "answer": "Ceylon (or Sri Lanka)", "used": "false"},{"question": "'Karl led the first of these Marxist organizational efforts; the second one began in 1889'", "value": "$800", "answer": "the International", "used": "false"}, {"question": "'This Asian political    party was founded in 1885 with \"Indian National\" as part of its name'", "value": "$1000", "answer": "the Congress Party", "used": "false"}], 

      "ATHLETES":[{"question": "'No. 2: 1912 Olympian; football star at Carlisle Indian School; 6 MLB seasons with the Reds, Giants & Braves'", "value": "$200", "answer": "Jim Thorpe", "used": "false"}, {"question": "'No. 8: 30 steals for the Birmingham Barons; 2,306 steals for the Bulls'", "value": "$400", "answer": "Michael Jordan", "used": "false"}, {"question": "'No. 1: Lettered in hoops, football & lacrosse at Syracuse & if you think he couldn't act, ask his 11 \"unclean\" buddies'", "value": "$600", "answer": "Jim Brown", "used": "false"}, {"question": "'No. 10: FB/LB for Columbia U. in the 1920s; MVP for the Yankees in '27 & '36; \"Gibraltar in Cleats\"'", "value": "$800", "answer": "(Lou) Gehrig", "used": "false"}, {"question": "'No. 5: Only center to lead the NBA in assists; track scholarship to Kansas U.; marathoner; volleyballer'", "value": "$1000", "answer": "(Wilt) Chamberlain", "used": "false"}], 
	  
      "EVERYBODY":[{"question": "'The city of Yuma in this state has a record average of 4,055 hours of sunshine each year'", "value": "$200", "answer": "Arizona", "used": "false"},{"question": "'In the winter of 1971-72, a record 1,122 inches of snow fell at Rainier Paradise Ranger Station in this state'", "value": "$400", "answer": "Washington", "used": "false"},{"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$600", "answer": "the UV index", "used": "false"}, {"question": "'Africa's lowest temperature was 11 degrees below zero in 1935 at Ifrane, just south of Fez in this country'", "value": "$800", "answer": "Morocco", "used": "false"}, {"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$1000", "answer": "the UV index", "used": "false"}], 
	  
      "COMPANY":[{"question": "'In 1963, live on \"The Art Linkletter Show\", this company served its billionth burger'", "value": "$200", "answer": "McDonald\\'s", "used": "false"},{"question": "'This housewares store was named for the packaging its merchandise came in & was first displayed on'", "value": "$400", "answer": "Crate & Barrel", "used": "false"}, {"question": "'This company's Accutron watch, introduced in 1960, had a guarantee of accuracy to within one minute a  month'", "value": "$600", "answer": "Bulova", "used": "false"}, {"question": "'Edward Teller & this man partnered in 1898 to sell high fashions to women'", "value": "$800", "answer": "(Paul) Bonwit", "used": "false"},{"question": "'The Kirschner brothers, Don & Bill, named this ski company for themselves & the second-highest mountain'", "value": "$1000", "answer": "K2", "used": "false"}],
	  
      "TRIBUTES":[{"question": "'Signer of the Dec. of Indep., framer of the Constitution of Mass., second President of the United States'", "value": "$200", "answer": "John Adams", "used": "false"},{"question": "'\"And away we go\"'", "value": "$400", "answer": "Jackie Gleason", "used": "false"}, {"question": "'Outlaw: \"Murdered by a traitor and a coward whose name is not worthy to appear here\"'", "value": "$600", "answer": "Jesse James", "used": "false"}, {"question": "'1939 Oscar winner: \"...you are a credit to your craft, your race and to your family\"'", "value": "$800", "answer": "Hattie McDaniel (for her role in Gone with the Wind)", "used": "false"}, {"question": "'Revolutionary War hero: \"His spirit is in Vermont now\"'", "value": "$1000", "answer": "Ethan Allen", "used": "false"}], 
	  
      "WORDS":[{"question": "'In the title of an Aesop fable, this insect shared billing with a grasshopper'", "value": "$200", "answer": "the ant", "used": "false"},{"question": "'Cows regurgitate this from the first stomach to the mouth & chew it again'", "value": "$400", "answer": "the cud", "used": "false"}, {"question": "'A small demon, or a mischievous child (who might be a little demon!)'", "value": "$600", "answer": "imp", "used": "false"}, {"question": "'In geologic time one of these, shorter than an eon, is divided into periods & subdivided into epochs'", "value": "$800", "answer": "era", "used": "false"}, {"question": "'A single layer of paper, or to perform one's craft diligently'", "value": "$1000", "answer": "ply", "used": "false"}]
       } , "oJeopardy_round2" : {"HISTORY":[{"question" : "For the last 8 years of his life, Galileo was under house arrest for espousing this man's theory", "value": "$200", "answer": "Copernicus", "used": "false"},{"question": "'Built in 312 B.C. to link Rome & the South of Italy, it's still in use today'", "value": "$400", "answer": "the Appian Way", "used": "false"}, {"question": "'In 1000 Rajaraja I of the Cholas battled to take this Indian Ocean island now known for its tea'", "value": "$600", "answer": "Ceylon (or Sri Lanka)", "used": "false"},{"question": "'Karl led the first of these Marxist organizational efforts; the second one began in 1889'", "value": "$800", "answer": "the International", "used": "false"}, {"question": "'This Asian political    party was founded in 1885 with \"Indian National\" as part of its name'", "value": "$1000", "answer": "the Congress Party", "used": "false"}], 

      "ATHLETES":[{"question": "'No. 2: 1912 Olympian; football star at Carlisle Indian School; 6 MLB seasons with the Reds, Giants & Braves'", "value": "$200", "answer": "Jim Thorpe", "used": "false"}, {"question": "'No. 8: 30 steals for the Birmingham Barons; 2,306 steals for the Bulls'", "value": "$400", "answer": "Michael Jordan", "used": "false"}, {"question": "'No. 1: Lettered in hoops, football & lacrosse at Syracuse & if you think he couldn't act, ask his 11 \"unclean\" buddies'", "value": "$600", "answer": "Jim Brown", "used": "false"}, {"question": "'No. 10: FB/LB for Columbia U. in the 1920s; MVP for the Yankees in '27 & '36; \"Gibraltar in Cleats\"'", "value": "$800", "answer": "(Lou) Gehrig", "used": "false"}, {"question": "'No. 5: Only center to lead the NBA in assists; track scholarship to Kansas U.; marathoner; volleyballer'", "value": "$1000", "answer": "(Wilt) Chamberlain", "used": "false"}], 
	  
      "EVERYBODY":[{"question": "'The city of Yuma in this state has a record average of 4,055 hours of sunshine each year'", "value": "$200", "answer": "Arizona", "used": "false"},{"question": "'In the winter of 1971-72, a record 1,122 inches of snow fell at Rainier Paradise Ranger Station in this state'", "value": "$400", "answer": "Washington", "used": "false"},{"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$600", "answer": "the UV index", "used": "false"}, {"question": "'Africa's lowest temperature was 11 degrees below zero in 1935 at Ifrane, just south of Fez in this country'", "value": "$800", "answer": "Morocco", "used": "false"}, {"question": "'On June 28, 1994 the nat'l weather service began issuing this index that rates the intensity of the sun's radiation'", "value": "$1000", "answer": "the UV index", "used": "false"}], 
	  
      "COMPANY":[{"question": "'In 1963, live on \"The Art Linkletter Show\", this company served its billionth burger'", "value": "$200", "answer": "McDonald\\'s", "used": "false"},{"question": "'This housewares store was named for the packaging its merchandise came in & was first displayed on'", "value": "$400", "answer": "Crate & Barrel", "used": "false"}, {"question": "'This company's Accutron watch, introduced in 1960, had a guarantee of accuracy to within one minute a  month'", "value": "$600", "answer": "Bulova", "used": "false"}, {"question": "'Edward Teller & this man partnered in 1898 to sell high fashions to women'", "value": "$800", "answer": "(Paul) Bonwit", "used": "false"},{"question": "'The Kirschner brothers, Don & Bill, named this ski company for themselves & the second-highest mountain'", "value": "$1000", "answer": "K2", "used": "false"}],
	  
      "TRIBUTES":[{"question": "'Signer of the Dec. of Indep., framer of the Constitution of Mass., second President of the United States'", "value": "$200", "answer": "John Adams", "used": "false"},{"question": "'\"And away we go\"'", "value": "$400", "answer": "Jackie Gleason", "used": "false"}, {"question": "'Outlaw: \"Murdered by a traitor and a coward whose name is not worthy to appear here\"'", "value": "$600", "answer": "Jesse James", "used": "false"}, {"question": "'1939 Oscar winner: \"...you are a credit to your craft, your race and to your family\"'", "value": "$800", "answer": "Hattie McDaniel (for her role in Gone with the Wind)", "used": "false"}, {"question": "'Revolutionary War hero: \"His spirit is in Vermont now\"'", "value": "$1000", "answer": "Ethan Allen", "used": "false"}], 
	  
      "WORDS":[{"question": "'In the title of an Aesop fable, this insect shared billing with a grasshopper'", "value": "$200", "answer": "the ant", "used": "false"},{"question": "'Cows regurgitate this from the first stomach to the mouth & chew it again'", "value": "$400", "answer": "the cud", "used": "false"}, {"question": "'A small demon, or a mischievous child (who might be a little demon!)'", "value": "$600", "answer": "imp", "used": "false"}, {"question": "'In geologic time one of these, shorter than an eon, is divided into periods & subdivided into epochs'", "value": "$800", "answer": "era", "used": "false"}, {"question": "'A single layer of paper, or to perform one's craft diligently'", "value": "$1000", "answer": "ply", "used": "false"}]
       }};

	   
	   