var CodeStack = [];
var ArduinoBakery = {
    header: [
	"//we start including libraries", 	
    "#include <Wire.h>",
	"#include \<Adafruit_NeoPixel.h\>",
	"#include \<Adafruit_Sensor.h\>",
	"#include \<Adafruit_LSM303_U.h\>",
	" ",	
	"//then we must define certain numbers",	
    "#define LED_PIN 9",
    "#define TOTAL_LEDS 5",
    "#define BUTTON 7",
	"Adafruit_NeoPixel strip = Adafruit_NeoPixel(TOTAL_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);",
	"Adafruit_LSM303_Accel_Unified accel = Adafruit_LSM303_Accel_Unified(54321);",
	" ",	
	"//and variables and thresholds for the clicks",	
    "int shortClick = 600;",
    "int longClick = 1000;",
    "int buttonState = 0;",
    "int longPressed = false;",
	" ",			
	"//variables for timers",	
    "unsigned long buttonStartTime;",
	"long timePassed;",
	"long loopTimer;",
	"int loopCycle;",	
	"int loopSteps = %LOOPSTEPS%;",	
	"int timeStamps[] = {%TIMESTAMPS%};",
	" ",
	"//variables for fading",	
 	"long speed;",
	"int alpha;",
	"int periode = 2000;",
    " ",
	"//variables for sensor motion",
	"float  valueY, preY, deltaY;",
	"int shakeBit = 3;",
	"int shakeMuch = 6;",
	"int lightShake = 0;",
	"int hardShake = 0;"	
	],
	
	
    setup: [
	"//this is the code that runs once on start.",	
    "void setup() {",
	  "//it starts the components",
      "\tstrip.begin();",
      "\tstrip.show();",
      "\tpinMode(BUTTON, OUTPUT);",
      "\tloopTimer = 0;",
      "\tloopCycle = timeStamps[loopSteps];",
      " "
    ],
	
    functions: [
    "void off(int led){",
    "  tintPixels(255, 255, 255, 0, led);",
    "}",
	" ",
    "void on(int r, int g, int b, int led){",
    "  tintPixels(r, g, b, 100, led);  ",
    "}",
	" ",
		
    "void blinkEvent(int r, int g, int b, int led, int times, float mode){",
	"   unsigned long now = millis();",
	"	unsigned long blinkCounter = 0;",
	"	while(blinkCounter < times){",	
    "   speed = millis();",
	"   speed *= mode;",	
    "	blinkCounter = millis() - now;",
    "	fadePixels(speed, r, g, b, led);",
	"	}",
	"	blinkCounter = 0;",	
		"on(0, 0, 0, led);",
    "}",	
	" ",
		
	"void blinkLoop(int r, int g, int b, int led, float mode){",
	"   speed = millis();",
	"  speed *= mode;",
	"   fadePixels(speed, r, g, b, led);",
	"}",
		
    "void fadePixels(long speed, int r, int g, int b, int led){",
	"  int previousAlpha = alpha;",
	"  alpha = 128+127*cos(2*PI/periode*speed);",
    "  tintPixels(r, g, b, alpha, led);",	
    "}",
    "",
		
	"//function to change led colors",	
    "void tintPixels(int r, int g, int b, int a, int led){",
    "   strip.setBrightness(a);",
    "   if(led == TOTAL_LEDS){",
    "       for(uint16_t i=0; i<strip.numPixels(); i++) {",
    "           uint32_t c = strip.Color(r, g, b);",
    "           strip.setPixelColor(i,c);",
    "       }",
    "   }else{",
    "       strip.setPixelColor(led, strip.Color(r, g, b));",
    "   }",
    "   strip.show();",
    "}",
	" ",
	"//function for the button",	
    "void checkButtonState(){",
	"  //read the button pin and get the time",	
    "  int checkButton = digitalRead(BUTTON);",
    "  unsigned long now = millis();",
    "  ",
	"//beginning of button cycle",	
    "  if (buttonState == 0) {",
	"  //check if it is pressed	", 
    "    if (checkButton == HIGH) {",
    "      buttonState = 1;",
    "      buttonStartTime = now;",
    "    }",
    "  }",
	" //if button was pressed, check if it is short or long",	
	" else if (buttonState == 1) {",
    "    if (checkButton == LOW) {",
    "      buttonState = 2;",
    "    } else if ((checkButton == HIGH) && (now > buttonStartTime + longClick)) {",
    "      longPressed = true;",
    "      buttonState = 6;",
    "    } ",	
    "  }",
	" //if it was short, wait for double click for a bit", 
	" else if (buttonState == 2) {",
	"  //if double click does not come, then it is a single click",
    "    if (now > buttonStartTime + shortClick) {",
    "      buttonState = 0;",
    "      singleclick();",
    "    }",
	"	else if (checkButton == HIGH) {",
    "      buttonState = 3; ",
    "    }",
    "  }",
	"  //otherwise, it is a double click",	
	"	else if (buttonState == 3) {",
    "    if (checkButton == LOW) {",
    "      buttonState = 0;",
    "      doubleclick();",
    "    } ",
    "  }",
	" //it was a long press",	
	" else if (buttonState == 6) {",
    "   if (checkButton == LOW) {",
    "      longPressed = false;",
    "      buttonState = 0;",
    "      longclick(); ",
    "    }",
	"	else{",
    "       longPressed = true; ",
    "    }",
    "  }",
    "}",
	"void checkMotionSensor(){",
	" sensors_event_t event;", 
    " accel.getEvent(&event);",	
	" valueY = event.acceleration.y + 10;",
  	" deltaY = valueY - preY;",
  	" preY = valueY;",
	" if(deltaY > shakeMuch || deltaY < (shakeMuch*(-1))) hardShake++;",
  	" else if(deltaY > shakeBit || deltaY < (shakeBit*(-1))) lightShake++;",
  	" if(lightShake > 25) {",
	"	shakelight();",
	"	lightShake = 0;",
	" }",
  	" if(hardShake > 10){",
	"	shakehard();",	
	"	hardShake = 0;",
	"	}",	
  	" if(millis()%2000 == 0){",
	"	hardShake = 0;",
	"	lightShake = 0;",
	"	}",
	"}"	
    ],

    loop: "//main function that runs in a loop\nvoid loop(){\n\tcheckButtonState();\n\t//checkMotionSensor();\n\ttimePassed = millis() - loopTimer;\n\tif(timePassed > loopCycle){\n\t\tloopTimer = millis();\n\t}", 
	
	
	longclick: "\n//output code for long clicks \nvoid longclick(){\n %CODE% \n}",
    singleclick: "\n//output code for single clicks \nvoid singleclick(){\n %CODE% \n}",
    doubleclick: "\n//output code for double clicks \nvoid doubleclick(){\n %CODE% \n}",	
    shakelight: "\n//output code for light shake \nvoid shakelight(){\n %CODE% \n}",
    shakehard:  "\n//output code for hard shake \nvoid shakehard(){\n %CODE% \n}",
    
	//code to be added to the functions above
	setup_code:[],
    loop_code:[],
	singleclick_code:[],
    longclick_code:[],
    doubleclick_code:[],
    shakelight_code:[],
    shakelight_code:[],
    shakehard_code:[],
   
	
	//variable references for the script
    SETUP:"setup_code",
	SINGLE_CLICK:"singleclick_code",
    LONG_CLICK:"longclick_code",
    DOUBLE_CLICK:"doubleclick_code",
    LIGHT:"shakelight_code",
	HARD:"shakehard_code",
    
    wait:function(time, where){
        var delay = "\n\tdelay(" + time + ");";
        this[where].push(delay);
    },
    
    _ledBehavior:function(led, mode, color, times, area){
        var code = "";	
        switch(mode){
            case "on":
				//console.log(color);
                code = "\n\ton(" + color + "," + led + ");";
                break;
            case "off":
                code = "\n\toff(" + led + ");";
                break;
            case "blinkFast":
				if(area == 'loop') code = "\n\tblinkLoop("+color+ "," + led + ","+10+");";
				else if(area == 'event') code = "\n\tblinkEvent("+color+ "," + led + "," + times +","+10+");";
                break;
            case "blinkSlow":
				if(area == 'loop') code = "\n\tblinkLoop("+color+ "," + led + ","  +0.5+");";
				else if(area == 'event') code = "\n\tblinkEvent("+color+ "," + led + ","+ times+","+0.5+");";								break;

        }

        return code;
    },
    
    
    always:function(type, led, mode, color, times, stepNr){
        var stepCode = this._ledBehavior(led, mode, color, times, "loop");
		var code = "\n\telse if(timePassed < timeStamps["+stepNr+"]){\n"+stepCode+"\n\t}";
        this.loop_code.push( code );        
    },

    
    click:function(type, led, mode, color, times){
        var code = this._ledBehavior(led, mode, color, times, "event");
		this[type].push(code);
		//console.log(type);
    },
    
    
    move:function(direction, led, mode, color, times){
        var code = this._ledBehavior(led, mode, color, times);
        this[type].push(code);
    },
	
	
	//get header code
	getHeaderCode:function(){
	   //CHANGE THIS TO SAME STRUCTURE AS LOOP
    	var code = this.header.join("\n");
		code = code.replace("%LOOPSTEPS%", numLoopSteps);
		code = code.replace("%TIMESTAMPS%", loopTimes);
		return code;
	},
	
	//get setup code
	getSetupCode:function(){
		var code = this.setup.join("\n");
		var newCode = this.setup_code.join("\n")+"\n}";	
		//console.log(newCode);
		code = code + newCode;
        return code;	
	},
    
    //get loop code
    getBodyCode:function(){		
		var code = this.loop;
		var newCode = this.loop_code.join("\n")+"\n}";
		//console.log(newCode);
		code = code + newCode;
        return code;
    },
    
    //join all button functions
    getClickCode:function(){
        //CHANGE THIS TO SAME STRUCTURE AS LOOP
        var code = this.longclick.replace("%CODE%", this.longclick_code.join("\n"));
        code += this.singleclick.replace("%CODE%", this.singleclick_code.join("\n"));
        code += this.doubleclick.replace("%CODE%", this.doubleclick_code.join("\n"));
    	//console.log(code);
		return code;
    },
        
    //join sensor functions
    getSensorCode:function(){
   	    //CHANGE THIS TO SAME STRUCTURE AS LOOP
    	var code = this.shakelight.replace("%CODE%", this.shakelight_code.join("\n"));
        code += this.shakehard.replace("%CODE%", this.shakehard_code.join("\n"));       
		//console.log(code);
		return code;

	},
    
	
    //join all code together and return it
    bake:function(){
        CodeStack = [];
        CodeStack.push(this.getHeaderCode());   
        CodeStack.push(this.getSetupCode());   
        CodeStack.push(this.getBodyCode());
        CodeStack.push(this.getClickCode());
        CodeStack.push(this.getSensorCode());
        CodeStack.push(this.functions.join("\n"));
        return CodeStack.join("\n");			
    }
};
