var numSetupSteps = 0;
var buttonSteps = 0;
var sensorSteps = 0;
var numLoopSteps = 0;
var loopTimes = ["0"];

var currentFunction = {}; 
var finalCode;


//add CSS to selectboxes and update height when it is ready
$( document ).ready(function() {
   restartCode('setup');	
   restartCode('loop');	
   restartCode('button');	
   restartCode('sensor');	
	
   updateDropdownsCSS();
   updateBarHeight(); 
});

//create the next step for each area
$( document ).on( "change", ".setupStep", function() {	
  createDropdown($(this), "setup");
  updateBarHeight(); 
});

$( document ).on( "change", ".loopStep", function() {	
  createDropdown($(this), "loop");
  updateBarHeight(); 
});

$( document ).on( "change", ".buttonStep", function() {	
  createDropdown($(this), "button");
  updateBarHeight(); 
});

$( document ).on( "change", ".sensorStep", function() {	
  createDropdown($(this), "sensor");
  updateBarHeight(); 
});


//resetting the code areas
function restartCode(area){	
	if(area == 'setup'){		
		$('.setupStep').each(function(index){
			//stepPosition = parseInt($(this).attr("id").substr(6));
			$(this).parent().remove();	
		});	
		var restartSetup = '<div class="step1"><select name="onStart" class="setupStep" id="setup-0" ><option value="step">ON START</option><option value="delete">DELETE SETUP</option></select></div><div class="step3"><select name="addStep" class="setupStep" id="setup-2"><option value="step">WHICH LED?</option><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div>';
		$('#setup_code').append(restartSetup);
	}
	
	if(area == 'loop'){		
		$('.loopStep').each(function(index){
			//stepPosition = parseInt($(this).attr("id").substr(6));
			$(this).parent().remove();	
		});	
		$('#margin_loop').remove();
		var restartLoop = '<div class="step1"><select name="addStep" class="loopStep" id="loop--0"><option value="step">ON LOOP</option><option value="delete">DELETE LOOP</option></select></div><div class="step3"><select name="addStep" class="loopStep" id="loop--2"><option value="step">WHICH LED?</option><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><p class="margin" id="margin_loop"></p>';
		$('#loop_code').append(restartLoop);
	}
	
	if(area == 'button'){
		$('.buttonStep').each(function(index){
			//stepPosition = parseInt($(this).attr("id").substr(6));
			$(this).parent().remove();	
		});	
		$('#margin_button').remove();
		var restartButton = '<div class="step1"><select name="addStep" class="buttonStep" id="button0"><option value="step">ON BUTTON</option><option value="delete">DELETE BUTTON </option></select></div><div class="step2"><select name="addButton" class="buttonStep" id="button1"><option value="step">HOW?</option><option value="single">SINGLE CLICK</option><option value="double">DOUBLE CLICK </option><option value="long">LONG CLICK</option></select></div><p class="margin" id="margin_button"></p>';
		$('#button_code').append(restartButton);
	}
	
	
	if(area == 'sensor'){
		$('.sensorStep').each(function(index){
			//stepPosition = parseInt($(this).attr("id").substr(6));
			$(this).parent().remove();	
		});	
		$('#margin_sensor').remove();
		var restartSensor = '<div class="step1"><select name="addStep" class="sensorStep" id="sensor0"><option value="sensor">ON MOTION</option><option value="delete">DELETE MOTION </option></select></div><div class="step2"><select name="addSensor" class="sensorStep" id="sensor1"><option value="step">HOW?</option><option value="light">LIGHT SHAKE</option><option value="hard">HARD SHAKE</option></select></div><p id="margin_sensor" class="margin"></p>';
		$('#sensor_code').append(restartSensor);
	}	
	
	
}




function createDropdown(e, area){    

	//assign area to classes 
	var stepClass;
	if(area == 'setup') stepClass = 'setupStep';
	else if(area == 'loop') stepClass = 'loopStep';
	else if(area == 'button') stepClass = 'buttonStep';
	else if(area == 'sensor') stepClass = 'sensorStep';

		
	//manage IDs
    var id = e.attr("id"); 
    var previousPos = parseInt(id.substr(6));
    var nextPosition = parseInt(previousPos)+1;
	
	if(area =="setup" ){
		nextPosition = area+"-"+nextPosition;
	}
	else if(area =="loop" ){
		nextPosition = area+"--"+nextPosition;
	}
	else{
		nextPosition = area+nextPosition;
	}
	
	//object selected
    var value = e.attr("value");
    var level = e.parent().attr("class"); 
    var removeItself = false;
    var nextStep="";

	
	//step value means selects that don't trigger any action!
    if(value != "step"){		

		//delete the steps after you only your area.
		$('.'+stepClass).each(function(index){
			var stepPos = parseInt($(this).attr("id").substr(6));
			//console.log($(this));

			if(stepPos > previousPos) $(this).parent().remove();			
		});	
		
		if(value == "delete"){
			if(area == 'setup'){
				restartCode('setup');
			}
			else if(area == 'loop'){
				restartCode('loop');
			}
			else if(area == 'button'){
				restartCode('button');
			}
			else if(area == 'sensor'){
				restartCode('sensor');
			}			
		}
		
		if(level=="step1"){
            if(value=="always"){
                nextStep = replaceStr(ledMenu_, nextPosition);
            }
            else if(value=="button"){
                nextStep = replaceStr(buttonMenu, nextPosition);
           }
            else if(value=="sensor"){
                nextStep = replaceStr(sensorMenu, nextPosition);
           } 
        }			
			
		
	
		//CONDITION
		if(level=="step2"){
            nextStep = replaceStr(ledMenu_, area, nextPosition);
        }
        
		else if(level=="step3"){
			if(value == "finish"){
                removeItself = true;  
				if(area =="button") nextStep = replaceStr(buttonMenu, area, nextPosition);			
				else if(area =="sensor") nextStep = replaceStr(sensorMenu, area, nextPosition);			
			}
			else{
            nextStep = replaceStr(modeMenu, area, nextPosition);
			}
        }
        		
		
		
		//MODE
        else if(level=="step4"){
            if(value=="off"){
                nextStep = replaceStr(waitMenu,area, nextPosition);
			}
			else{
                nextStep = replaceStr(colorPicker,area, nextPosition);
			}
		}
	
		//COLOR 
        else if(level=="step5"){
            nextStep = replaceStr(waitMenu, area, nextPosition);			

        }               
       		
        //TIME or BLINKING TIMES 
        else if(level=="step6"){
            nextStep = replaceStr(ledMenu, area, nextPosition);          
        }
 
        $("#"+id).parent().after(nextStep);
		updateDropdownsCSS();
		if(removeItself) e.parent().remove();
    }
}


function replaceStr(drop, area, pos){
    var func = drop.replace("%NUMBER%", pos);
	//console.log(area);
	func = func.replace("%CLASS%", area+'Step');
    return func;
}

function updateDropdownsCSS(){
   $(".setupStep").selectbox();
   $(".loopStep").selectbox();
   $(".buttonStep").selectbox();
   $(".sensorStep").selectbox();	
}

function updateBarHeight(){
    var setupHeight = $('#setup_code').css("height");
    $('#setupLabel').css("margin-top", setupHeight);
    var loopHeight = $('#loop_code').css("height");
    $('#loopLabel').css("margin-top", loopHeight);  
    var buttonHeight = $('#button_code').css("height");
    $('#buttonLabel').css("margin-top", buttonHeight); 
    var sensorHeight = $('#sensor_code').css("height");
    $('#sensorLabel').css("margin-top", sensorHeight); }



//this menu doesn't have FINISH STEP
var ledMenu_ = '<div class="step3"><select name="addLed" class="%CLASS%" id="%NUMBER%"><option value="step">WHICH LED?</option><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></div>'; 

//this menu has FINISH STEP
var ledMenu = '<div class="step3"><select name="addLed" class="%CLASS%" id="%NUMBER%"><option value="step">ANOTHER LED?</option><option value="finish">NO, THANKS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option><option value="5">ALL LEDS</option></select></div>'; 

var modeMenu = '<div class="step4"><select name="addMode" class="%CLASS%" id="%NUMBER%"><option value="step">WHAT?</option><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></div>'; 

var waitMenu = '<div class="step6"><select name="addWait" class="%CLASS%" id="%NUMBER%"><option value="step">HOW LONG?</option><option value="500">0.5 SECONDS</option><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option></select></div>'; 

var timesMenu = '<div class="step6"><select name="addTime" class="%CLASS%" id="%NUMBER%"><option value="step">HOW MANY TIMES?</option><option value="1">1x</option><option value="3">3x</option><option value="5">5x</option><option value="10">10x</option></div>'

var colorPicker = '<div class="step5"><select name="addColor" class="%CLASS%" id="%NUMBER%"><option value="step">WHICH COLOR?</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option><option value="255, 255, 255">White</option></select></div>'; 


var buttonMenu = '<div class="step2"><select name="addButton" class="%CLASS%" id="%NUMBER%"><option value="step">HOW?</option><option value="single">SINGLE CLICK</option><option value="double">DOUBLE CLICK </option><option value="long">LONG CLICK</option></select></div>'; 

var sensorMenu = '<div class="step2"><select name="addSensor" class="%CLASS%" id="%NUMBER%"><option value="step">HOW?</option><option value="light">LIGHT SHAKE</option><option value="hard">HARD SHAKE</option></select></div>'; 

//var colorPicker2 = '<input class="step6" id="colorPalette"></input>';

var finishStep = '<div class="step7"><select name="finishStep" class="step" id="%NUMBER%"><option value="step">DONE?</option><option value="yes">FINISH STEP</option><option value="wait">ADD WAIT</option><option value="no">ADD LED</option></select></div>';

var finishSetup = '<div class="step7"><select name="finishStep" class="step" id="%NUMBER%"><option value="step">DONE?</option><option value="finishSetup">FINISH SETUP</option><option value="no">ADD LED</option></select></div>'; 

var stepMenu = '<div class="step1"><select name="addStep" class="step" id="%NUMBER%"><option value="step">ADD STEP</option><option value="always">ALWAYS</option><option value="button">ON BUTTON</option><option value="sensor">ON SENSOR</option><option value="wait">WAIT</option></div>'; 


function pushCode(){
	//clean previous 
	ArduinoBakery.setup_code = [];	
	ArduinoBakery.loop_code = [];	
	ArduinoBakery.singleclick_code = [];
    ArduinoBakery.longclick_code = [];
    ArduinoBakery.doubleclick_code = [];
	loopTimes = ["0"];		
	numLoopSteps = 0;
	timeStamps = {};
	var fullFunction = true;
	

	
	$('.setupStep').each(function(index){		
	    currentFunction = {};
		if($(this).val() != 'step' && $(this).parent().attr('class') == "step3" ){
			currentFunction = {};
			currentFunction.type = ArduinoBakery.SETUP;			
			currentFunction.led = $(this).val();			
			currentFunction.mode = $(this).parent().next().children('.setupStep').val(); 

			if(currentFunction.mode == "off"){
				currentFunction.time = $(this).parent().next().next().children('.setupStep').val();
				currentFunction.color = "0,0,0";		
			}
			else{
				currentFunction.color = $(this).parent().next().next().children('.setupStep').val();
				if(currentFunction.color) currentFunction.color.split(",");	
				console.log($(this).parent().next().next().next().children('.setupStep').val());		
				currentFunction.time = $(this).parent().next().next().next().children('.setupStep').val();
			}
			
			//check if it is complete
			for(var test in currentFunction){
				if(typeof test === 'undefined') fullFunction = false;
				if(currentFunction[test] == "step")fullFunction = false;
			}	
			if(fullFunction){
				ArduinoBakery.click(currentFunction.type, currentFunction.led, currentFunction.mode, currentFunction.color, currentFunction.time);
				if(currentFunction.mode=="on" || currentFunction.mode=="off"){
					//add delay???
					ArduinoBakery.wait(currentFunction.time, currentFunction.type);
				}
			}
		}
	});
						 
						 
	$('.loopStep').each(function(index){
		currentFunction = {};

		//new always()  
		if($(this).val() != 'step' && $(this).parent().attr('class') == "step3" ){
			currentFunction = {};
			currentFunction.type = ArduinoBakery.LOOP;			
			currentFunction.led = $(this).val();			
			currentFunction.mode = $(this).parent().next().children('.loopStep').val(); 
			
			if(currentFunction.mode == "off"){
				currentFunction.time = $(this).parent().next().next().children('.loopStep').val();
				currentFunction.color = "0,0,0";		
			}
			else{
				currentFunction.color = $(this).parent().next().next().children('.loopStep').val();
				if(currentFunction.color) currentFunction.color.split(",");			
				currentFunction.time = $(this).parent().next().next().next().children('.loopStep').val();
			}
			loopTimes.push( parseInt(loopTimes[loopTimes.length - 1])+parseInt(currentFunction.time));
			//console.log(loopTimes);
			//check if it is complete
			for(var test in currentFunction){
				if(typeof test === 'undefined') fullFunction = false;
				if(currentFunction[test] == "step")fullFunction = false;	
			}			
			if(fullFunction){
				numLoopSteps++;
				ArduinoBakery.always(currentFunction.type, currentFunction.led , currentFunction.mode, currentFunction.color, currentFunction.time, numLoopSteps); 
			}
		}
	});	
	
	$('.buttonStep').each(function(index){
		currentFunction = {};

		if($(this).val() != 'step' && $(this).parent().attr('class') == "step3" ){
			currentFunction = {};
			var type = $(this).parent().parent().children('.step2').children('.buttonStep').val();
			if(type == "single") currentFunction.type = ArduinoBakery.SINGLE_CLICK;		
			else if(type == "double") currentFunction.type = ArduinoBakery.DOUBLE_CLICK;
			else if(type == "long") currentFunction.type = ArduinoBakery.LONG_CLICK;		
			console.log(type);
			
			
			currentFunction.led = $(this).val();			
			currentFunction.mode = $(this).parent().next().children('.buttonStep').val(); 
			
			if(currentFunction.mode == "off"){
				currentFunction.time = $(this).parent().next().next().children('.buttonStep').val();
				currentFunction.color = "0,0,0";		
			}
			else{
				currentFunction.color = $(this).parent().next().next().children('.buttonStep').val();
				if(currentFunction.color) currentFunction.color.split(",");			
				currentFunction.time = $(this).parent().next().next().next().children('.buttonStep').val();
			}
			
			//check if it is complete
			for(var test in currentFunction){
				if(typeof test === 'undefined') fullFunction = false;
				if(currentFunction[test] == "step")fullFunction = false;	
			}			
			if(fullFunction){
				ArduinoBakery.click(currentFunction.type, currentFunction.led , currentFunction.mode, currentFunction.color, currentFunction.time); 
				if(currentFunction.mode=="on" || currentFunction.mode=="off"){
					//add delay???
					ArduinoBakery.wait(currentFunction.time, currentFunction.type);
				}
			}
		}
	});	
	
	$('.sensorStep').each(function(index){
		currentFunction = {};

		if($(this).val() != 'step' && $(this).parent().attr('class') == "step3" ){
			currentFunction = {};
			var type = $(this).parent().prev().children('.sensorStep').val();
			if(type == "light") currentFunction.type = ArduinoBakery.LIGHT;		
			else if(type == "hard") currentFunction.type = ArduinoBakery.HARD;
			console.log(type);

			currentFunction.led = $(this).val();			
			currentFunction.mode = $(this).parent().next().children('.sensorStep').val(); 
			
			if(currentFunction.mode == "off"){
				currentFunction.time = $(this).parent().next().next().children('.sensorStep').val();
				currentFunction.color = "0,0,0";		
			}
			else{
				currentFunction.color = $(this).parent().next().next().children('.sensorStep').val();
				if(currentFunction.color) currentFunction.color.split(",");			
				currentFunction.time = $(this).parent().next().next().next().children('.sensorStep').val();
			}
			
			//check if it is complete
			for(var test in currentFunction){
				if(typeof test === 'undefined') fullFunction = false;
				if(currentFunction[test] == "step")fullFunction = false;	
			}			
			if(fullFunction){
				ArduinoBakery.click(currentFunction.type, currentFunction.led , currentFunction.mode, currentFunction.color, currentFunction.time); 
				if(currentFunction.mode=="on" || currentFunction.mode=="off"){
					//add delay???
					ArduinoBakery.wait(currentFunction.time, currentFunction.type);
				}
			}
		}
	});	
	
	
}



$(function(){
    $("#code").click(function(){
	pushCode();	

	var now = new Date().getTime();
	var file = '/botcode/botcode'+now+'.ino';
	console.log(file);
	finalCode = { 'code' : ArduinoBakery.bake(), 'fileName': file};

	$.ajax({
		url: '/file/',
		type: "POST",
		data: JSON.stringify(finalCode),
		contentType: 'application/json',
		complete: function(){
			window.location.assign(file);
			console.log('complete');
			},
		error: function(err){
			console.log(err);	   
			}
		});	
	 });
});


$(function(){
    $("#play").click(function(){
		
		
	});
});


$(function(){
    $("#new").click(function(){
	   restartCode('setup');	
	   restartCode('loop');	
	   restartCode('button');	
	   restartCode('sensor');
	   updateDropdownsCSS();
       updateBarHeight(); 
	});
});


$(function(){
    $("#save").click(function(){
	   alert("Saving code in the website is not implemented yet. Please download the file in the GET CODE button! :)");
	});
});

$(function(){
	$("#rainbow").click(function(){
		var restartSetup = '<div class="step1"><select name="onStart" class="setupStep" id="setup-0"><option value="step">ON START</option><option value="delete">DELETE SETUP</option></select></div><div class="step3"><select name="addLed" class="setupStep" id="setup-1"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="setupStep" id="setup-2"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="setupStep" id="setup-3"><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="setupStep" id="setup-4"><option value="500">0.5 SECONDS</option><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option></select></div>';
		var restartLoop = '<div class="step1"><select name="onLoop" class="loopStep" id="loop--0"><option value="step">ON LOOP</option><option value="delete">DELETE SETUP</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--1"><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option><option value="5">ALL LEDS</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--2"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--3"><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option><option value="255, 255, 255">White</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--4"><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--5"><option value="1">LED 2</option><option value="0">LED 1</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option><option value="5">ALL LEDS</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--6"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--7"><option value="255,255,0">Yellow</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option><option value="255, 255, 255">White</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--8"><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--9"><option value="2">LED 3</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="3">LED 4</option><option value="4">LED 5</option><option value="5">ALL LEDS</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--10"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--11"><option value="0,255,0">Green</option><option value="255,0,0">Red</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option><option value="255, 255, 255">White</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--12"><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--13"><option value="3">LED 4</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="4">LED 5</option><option value="5">ALL LEDS</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--14"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--15"><option value="0, 255, 255">Light Blue</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="255, 255, 255">White</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--16"><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--17"><option value="4">LED 5</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="5">ALL LEDS</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--18"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--19"><option value="120,0,255">Purple</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="0,0,255">Dark Blue</option><option value="0, 255, 255">Light Blue</option><option value="255, 255, 255">White</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--20"><option value="5000">5 SECONDS</option><option value="1000">1 SECOND</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--21"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--22"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--23"><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--24"><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div>';


		var restartButton = '<div class="step1"><select name="addStep" class="buttonStep" id="button0"><option value="step">ON BUTTON</option><option value="delete">DELETE BUTTON </option></select></div><div class="step2"><select name="addButton" class="buttonStep" id="button1"><option value="step">HOW?</option><option value="single">SINGLE CLICK</option><option value="double">DOUBLE CLICK </option><option value="long">LONG CLICK</option></select></div><p class="margin" id="margin_button"></p>';
		var restartSensor = '<div class="step1"><select name="addStep" class="sensorStep" id="sensor0"><option value="sensor">ON MOTION</option><option value="delete">DELETE MOTION </option></select></div><div class="step2"><select name="addSensor" class="sensorStep" id="sensor1"><option value="step">HOW?</option><option value="light">LIGHT SHAKE</option><option value="hard">HARD SHAKE</option></select></div><p id="margin_sensor" class="margin"></p>';

		changeCode(restartSetup, restartLoop, restartButton, restartSensor );
	});
});	

$(function(){
	$("#buttonExample").click(function(){
		var restartSetup = '<div class="step1"><select name="onStart" class="setupStep" id="setup-0"><option value="step">ON START</option><option value="delete">DELETE SETUP</option></select></div><div class="step3"><select name="addLed" class="setupStep" id="setup-1"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="setupStep" id="setup-2"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="setupStep" id="setup-3"><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="setupStep" id="setup-4"><option value="500">0.5 SECONDS</option><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option></select></div>';
		var restartLoop = '<div class="step1"><select name="addStep" class="loopStep" id="loop--0"><option value="step">ON LOOP</option><option value="delete">DELETE LOOP</option></select></div><div class="step3"><select name="addStep" class="loopStep" id="loop--2"><option value="step">WHICH LED?</option><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><p class="margin" id="margin_loop"></p>';

		var restartButton = '<div class="step1"><select name="addStep" class="buttonStep" id="button0"><option value="step">ON BUTTON</option><option value="delete">DELETE BUTTON </option></select></div><div class="step2"><select name="addButton" class="buttonStep" id="button1"><option value="single">SINGLE CLICK</option><option value="double">DOUBLE CLICK </option><option value="long">LONG CLICK</option></select></div><div class="step3"><select name="addLed" class="buttonStep" id="button2"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="buttonStep" id="button3"><option value="blinkFast">BLINK FAST</option><option value="on">ON</option><option value="off">OFF</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="buttonStep" id="button4"><option value="0,0,255">Dark Blue</option><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="buttonStep" id="button5"><option value="1000">1 SECOND</option><option value="500">0.5 SECONDS</option><option value="3000">3 SECONDS</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div><div class="step3"><select name="addLed" class="loopStep" id="loop--21"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="loopStep" id="loop--22"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="loopStep" id="loop--23"><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="loopStep" id="loop--24"><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option><option value="500">0.5 SECONDS</option></select></div>';

		var restartSensor = '<div class="step1"><select name="addStep" class="sensorStep" id="sensor0"><option value="sensor">ON MOTION</option><option value="delete">DELETE MOTION </option></select></div><div class="step2"><select name="addSensor" class="sensorStep" id="sensor1"><option value="step">HOW?</option><option value="light">LIGHT SHAKE</option><option value="hard">HARD SHAKE</option></select></div><p id="margin_sensor" class="margin"></p>';

		changeCode(restartSetup, restartLoop, restartButton, restartSensor );
		console.log("clicked");
	});
});



$(function(){
	$("#lightLoop").click(function(){
		
		var restartSetup = '<div class="step1"><select name="onStart" class="setupStep" id="setup-0"><option value="step">ON START</option><option value="delete">DELETE SETUP</option></select></div><div class="step3"><select name="addLed" class="setupStep" id="setup-1"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="setupStep" id="setup-2"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="setupStep" id="setup-3"><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="setupStep" id="setup-4"><option value="500">0.5 SECONDS</option><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option></select></div><div class="step3"><select name="addLed" class="setupStep" id="setup-1"><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="2">LED 3</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="setupStep" id="setup-2"><option value="off">OFF</option><option value="on">ON</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step6"><select name="addWait" class="setupStep" id="setup-4"><option value="500">0.5 SECONDS</option><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option></select></div>';
		
		
	var restartLoop = '<div class="step1"><select name="addStep" class="loopStep" id="loop--0"><option value="step">ON LOOP</option><option value="delete">DELETE LOOP</option></select></div><div class="step3"><select name="addStep" class="loopStep" id="loop--2"><option value="2">LED 3</option><option value="5">ALL LEDS</option><option value="0">LED 1</option><option value="1">LED 2</option><option value="3">LED 4</option><option value="4">LED 5</option></select></div><div class="step4"><select name="addMode" class="setupStep" id="setup-2"><option value="on">ON</option><option value="off">OFF</option><option value="blinkFast">BLINK FAST</option><option value="blinkSlow">BLINK SLOW</option></select></div><div class="step5"><select name="addColor" class="setupStep" id="setup-3"><option value="255, 255, 255">White</option><option value="255,0,0">Red</option><option value="0,255,0">Green</option><option value="0,0,255">Dark Blue</option><option value="255,255,0">Yellow</option><option value="255,0,255">Pink</option><option value="140,0,255">Purple</option><option value="0, 255, 255">Light Blue</option></select></div><div class="step6"><select name="addWait" class="setupStep" id="setup-4"><option value="500">0.5 SECONDS</option><option value="1000">1 SECOND</option><option value="5000">5 SECONDS</option><option value="10000">10 SECONDS</option><option value="30000">30 SECONDS</option><option value="60000">60 SECONDS</option></select></div></select></div><p class="margin" id="margin_loop"></p>';
		
		
	var restartButton = '<div class="step1"><select name="addStep" class="buttonStep" id="button0"><option value="step">ON BUTTON</option><option value="delete">DELETE BUTTON </option></select></div><div class="step2"><select name="addButton" class="buttonStep" id="button1"><option value="step">HOW?</option><option value="single">SINGLE CLICK</option><option value="double">DOUBLE CLICK </option><option value="long">LONG CLICK</option></select></div><p class="margin" id="margin_button"></p>';
	
	var restartSensor = '<div class="step1"><select name="addStep" class="sensorStep" id="sensor0"><option value="sensor">ON MOTION</option><option value="delete">DELETE MOTION </option></select></div><div class="step2"><select name="addSensor" class="sensorStep" id="sensor1"><option value="step">HOW?</option><option value="light">LIGHT SHAKE</option><option value="hard">HARD SHAKE</option></select></div><p id="margin_sensor" class="margin"></p>';	
		
			changeCode(restartSetup, restartLoop, restartButton, restartSensor );
		console.log("clicked");
		
	});
});


function changeCode(setup_code, loop_code, button_code, sensor_code){
	$('.setupStep').each(function(index){
		$(this).parent().remove();	
	});	
	$('#setup_code').append(setup_code);
		

	$('.loopStep').each(function(index){
		$(this).parent().remove();	
	});	
	$('#margin_loop').remove();
	$('#loop_code').append(loop_code);
	

	$('.buttonStep').each(function(index){
		$(this).parent().remove();	
	});	
	$('#margin_button').remove();
	$('#button_code').append(button_code);
	

	$('.sensorStep').each(function(index){
		$(this).parent().remove();	
	});	
	$('#margin_sensor').remove();
	$('#sensor_code').append(sensor_code);

	updateDropdownsCSS();
    updateBarHeight(); 
};
