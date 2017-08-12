$(document).ready(function(){
    $("input[name=value]").focusout(function(){
        var valueID = $(this).val();
        if(valueID === ""){
			alert('Please enter a value between $200-$1000!');
		}else if(valueID.charAt(0) !== '$'){
			alert('please initiate the value with "$" sign');
		} else if(valueID.length > 0 && (!$.isNumeric(valueID.slice(1, valueID.length)) || Number(valueID.slice(1, valueID.length)) < 200 || Number(valueID.slice(1, valueID.length)) > 1000)) {
			alert('please enter a value between 200 and 1000! \n Please don\'t use "," in the value!');
		}
    });
	return;
});

function toggleQuestionBoard(oTarget){
     var nextDiv = $(oTarget).next();
    var sText = oTarget.innerHTML;
    var sShow = String.fromCharCode(8743);
    var sHide = String.fromCharCode(8744);
    
    if (oTarget.innerHTML.search(sShow) > 0){
      $(nextDiv).hide();
      oTarget.innerHTML = sText.replace(sShow, sHide);
    } else {
      $(nextDiv).show();
      oTarget.innerHTML = sText.replace(sHide, sShow);
    } 
 }
 
 function toggleQuestionCategory(oTarget){
     var nextDiv = $(oTarget).parent().parent().next().next();
    var sText = oTarget.innerHTML;
    var sShow = String.fromCharCode(8743);
    var sHide = String.fromCharCode(8744);
    
    if (oTarget.innerHTML.search(sShow) > 0){
      $(nextDiv).hide();
      oTarget.innerHTML = sText.replace(sShow, sHide);
    } else {
      $(nextDiv).show();
      oTarget.innerHTML = sText.replace(sHide, sShow);
    } 
 }


function loadRoundQuestions(holder, place){
	$.each(["category1", "category2", "category3", "category4", "category5", "category6"], function(index, value){
		var category = $(place).find('div[name=' + value + ']').find('input[class="form-control"]');
		var categoryquestions =  $(place).find('div[name=' + value + '_questions]');
        var categoryName = category.val();
        var categoryContents = [];
        
        $.each(["questionOne", "questionTwo", "questionThree", "questionFour", "questionFive"], function(index, value){
            var question = $(categoryquestions).find('div[name=' + value + ']');
                categoryContents.push({
	        	"question": $(question).find('textarea[name=question]').val(),
		        "answer": $(question).find('textarea[name=answer]').val(),
		        "value": $(question).find('select[class=selectpicker]').val()
	        });
        });
		holder[categoryName] = categoryContents;
	});
}

function collectQuestionContents(){
   var content = {}; 
   var oJeopardy_round1 = {};
   var oJeopardy_round2 = {};
   
   loadRoundQuestions(oJeopardy_round1, "#questionRoundOne");
   loadRoundQuestions(oJeopardy_round2, "#questionRoundTwo");
   
   content["oJeopardy_round1"] = oJeopardy_round1;
   content["oJeopardy_round2"] = oJeopardy_round2;
   
   console.log("Object type is: " + content["oJeopardy_round1"]);
   return JSON.stringify(content);
}
 
function saveTextAsFile()
{
    var textToSave = collectQuestionContents();
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
 
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
 
function  injectContent(textFromFileLoaded)
{
      var pageContent = JSON.parse(textFromFileLoaded);
       $('#questionRoundOne').find("input").val("");
	   $('#questionRoundTwo').find("input").val("");
	   $('#questionRoundOne').find("textarea").val("");
	   $('#questionRoundTwo').find("textarea").val("");

	  var rounds = ['#questionRoundOne', '#questionRoundTwo'];
	   $.each(["oJeopardy_round1" ,"oJeopardy_round2" ], function(index, value){ 
	   var pos = 0;
	   var categories = ["category1", "category2", "category3","category4", "category5", "category6"]; 
	   $.each(pageContent[value], function(key1, value1){

       console.log("The new value is: " + value1);

	   var category = $(rounds[index]).find('div[name=' + categories[pos] + ']').find('input[class="form-control"]').val(key1);
	   var categoryquestions = $(rounds[index]).find('div[name=' + categories[pos] + '_questions]');
	   
	   var questionCount = 0;
	   
	   var questions = ["questionOne", "questionTwo", "questionThree", "questionFour", "questionFive"];
	   $.each(value1, function(key2, value2){
		   var question = $(categoryquestions).find('div[name=' + questions[questionCount] +']');
		   $.each(value2, function(key3, value3){
			   $(question).find('textarea[name=' + key3 + ']').val(value3);
			   $(question).find('select[name=' + key3 + ']').val(value3);
		   });
		   questionCount++;
	   });
	    pos++;
	   });
       });
}
 
function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //document.getElementById("inputTextToSave").value = textFromFileLoaded;
        injectContent(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");   
}
 
function openQuestionEditor(){
  	window.open("jeopardy_content_savefile code.html");
}
