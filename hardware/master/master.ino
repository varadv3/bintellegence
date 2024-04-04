/*
  ESP-NOW Demo - Receive
  esp-now-demo-rcv.ino
  Reads data from Initiator
  
  DroneBot Workshop 2022
  https://dronebotworkshop.com
*/

// Include Libraries
#include <esp_now.h>
#include <WiFi.h>
#include <Wire.h>
#include "ESPAsyncWebServer.h"

// Define a data structure
typedef struct struct_message {
  float depth;
} struct_message;

// Create a structured object
struct_message myData;


// Callback function executed when data is received
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&myData, incomingData, sizeof(myData));
  Serial.print("Data received: ");
  Serial.println(len);
  Serial.print("Depth: ");
  Serial.println(myData.depth);
  Serial.println();
}

const char *ssid = "masteresp";
const char *password = "12345678";

AsyncWebServer server(80);

void setup() {
  // Set up Serial Monitor
  Serial.begin(115200);
  
  // Set ESP32 as a Wi-Fi Station
  WiFi.mode(WIFI_AP_STA);

  
  // create device as WiFi Station
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("WiFi Status: ");
    Serial.println(WiFi.status());
    Serial.print("WL_C ");
    Serial.println(WL_CONNECTED);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected..");

  // Initilize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  
  // Register callback function
  esp_now_register_recv_cb(OnDataRecv);
  
  server.on("/home", HTTP_GET, [](AsyncWebServerRequest *request){
    String data = "";
    data += myData.depth;
    request->send(200, "text/plain", "Hello World");
  });
}
 
void loop() {
  
}
