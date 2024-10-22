/*
  LILYGO ESP32 Read Values from Button, Potentiometer, and Joystick
  - Button connected to pin 2
  - Potentiometer connected to pin 13
  - Joystick X, Y, and SW connected to pins 39, 32, and 33
  Prints out the values to Serial.
*/

int buttonPin = 2;
int potPin = 13;
int joystickPins[] = {39, 32, 33}; 

void setup() {
  Serial.begin(9600);

  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(joystickPins[2], INPUT_PULLUP);
}

void loop() {
  int buttonState = digitalRead(buttonPin);

  int potValue = analogRead(potPin);

  int xVal = analogRead(joystickPins[0]);
  int yVal = analogRead(joystickPins[1]);
  int zVal = digitalRead(joystickPins[2]);

  // Print values to Serial
  Serial.print("Button: ");
  Serial.print(buttonState);
  Serial.print(", Potentiometer: ");
  Serial.print(potValue);
  Serial.print(", Joystick: ");
  Serial.print(xVal);
  Serial.print(",");
  Serial.print(yVal);
  Serial.print(",");
  Serial.println(zVal);

  delay(100);
}
