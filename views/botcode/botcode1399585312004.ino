//we start including libraries
#include <Wire.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_LSM303_U.h>
 
//then we must define certain numbers
#define LED_PIN 9
#define TOTAL_LEDS 5
#define BUTTON 7
Adafruit_NeoPixel strip = Adafruit_NeoPixel(TOTAL_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);
Adafruit_LSM303_Accel_Unified accel = Adafruit_LSM303_Accel_Unified(54321);
 
//and variables and thresholds for the clicks
int shortClick = 600;
int longClick = 1000;
int buttonState = 0;
int longPressed = false;
 
//variables for timers
unsigned long buttonStartTime;
long timePassed;
long loopTimer;
int loopCycle;
int loopSteps = 0;
int timeStamps[] = {0};
 
//variables for fading
long speed;
int alpha;
int periode = 2000;
 
//variables for sensor motion
float  valueY, preY, deltaY;
int shakeBit = 3;
int shakeMuch = 6;
int lightShake = 0;
int hardShake = 0;
//this is the code that runs once on start.
void setup() {
//it starts the components
	strip.begin();
	strip.show();
	pinMode(BUTTON, OUTPUT);
	loopTimer = 0;
	loopCycle = timeStamps[loopSteps];
 
	blinkEvent(255,0,0,0,1000,10);

	blinkEvent(0,255,0,1,1000,10);

	blinkEvent(0,0,255,2,1000,10);

	blinkEvent(140,0,255,3,1000,10);

	blinkEvent(255,255,0,4,1000,10);
}
//main function that runs in a loop
void loop(){
	checkButtonState();
	//checkMotionSensor();
	timePassed = millis() - loopTimer;
	if(timePassed > loopCycle){
		loopTimer = millis();
	}
}

//output code for long clicks 
void longclick(){
  
}
//output code for single clicks 
void singleclick(){
 
	blinkEvent(255,0,0,5,1000,10); 
}
//output code for double clicks 
void doubleclick(){
  
}

//output code for light shake 
void shakelight(){
  
}
//output code for hard shake 
void shakehard(){
  
}
void off(int led){
  tintPixels(255, 255, 255, 0, led);
}
 
void on(int r, int g, int b, int led){
  tintPixels(r, g, b, 100, led);  
}
 
void blinkEvent(int r, int g, int b, int led, int times, float mode){
   unsigned long now = millis();
	unsigned long blinkCounter = 0;
	while(blinkCounter < times){
   speed = millis();
   speed *= mode;
	blinkCounter = millis() - now;
	fadePixels(speed, r, g, b, led);
	}
	blinkCounter = 0;
on(0, 0, 0, led);
}
 
void blinkLoop(int r, int g, int b, int led, float mode){
   speed = millis();
  speed *= mode;
   fadePixels(speed, r, g, b, led);
}
void fadePixels(long speed, int r, int g, int b, int led){
  int previousAlpha = alpha;
  alpha = 128+127*cos(2*PI/periode*speed);
  tintPixels(r, g, b, alpha, led);
}

//function to change led colors
void tintPixels(int r, int g, int b, int a, int led){
   strip.setBrightness(a);
   if(led == TOTAL_LEDS){
       for(uint16_t i=0; i<strip.numPixels(); i++) {
           uint32_t c = strip.Color(r, g, b);
           strip.setPixelColor(i,c);
       }
   }else{
       strip.setPixelColor(led, strip.Color(r, g, b));
   }
   strip.show();
}
 
//function for the button
void checkButtonState(){
  //read the button pin and get the time
  int checkButton = digitalRead(BUTTON);
  unsigned long now = millis();
  
//beginning of button cycle
  if (buttonState == 0) {
  //check if it is pressed	
    if (checkButton == HIGH) {
      buttonState = 1;
      buttonStartTime = now;
    }
  }
 //if button was pressed, check if it is short or long
 else if (buttonState == 1) {
    if (checkButton == LOW) {
      buttonState = 2;
    } else if ((checkButton == HIGH) && (now > buttonStartTime + longClick)) {
      longPressed = true;
      buttonState = 6;
    } 
  }
 //if it was short, wait for double click for a bit
 else if (buttonState == 2) {
  //if double click does not come, then it is a single click
    if (now > buttonStartTime + shortClick) {
      buttonState = 0;
      singleclick();
    }
	else if (checkButton == HIGH) {
      buttonState = 3; 
    }
  }
  //otherwise, it is a double click
	else if (buttonState == 3) {
    if (checkButton == LOW) {
      buttonState = 0;
      doubleclick();
    } 
  }
 //it was a long press
 else if (buttonState == 6) {
   if (checkButton == LOW) {
      longPressed = false;
      buttonState = 0;
      longclick(); 
    }
	else{
       longPressed = true; 
    }
  }
}
void checkMotionSensor(){
 sensors_event_t event;
 accel.getEvent(&event);
 valueY = event.acceleration.y + 10;
 deltaY = valueY - preY;
 preY = valueY;
 if(deltaY > shakeMuch || deltaY < (shakeMuch*(-1))) hardShake++;
 else if(deltaY > shakeBit || deltaY < (shakeBit*(-1))) lightShake++;
 if(lightShake > 25) {
	shakelight();
	lightShake = 0;
 }
 if(hardShake > 10){
	shakehard();
	hardShake = 0;
	}
 if(millis()%2000 == 0){
	hardShake = 0;
	lightShake = 0;
	}
}