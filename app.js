// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

var PORT = 4000;




app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));





// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(client){
  console.log('Client connected');
  var OBDReader = require('bluetooth-obd');
  var btOBDReader = new OBDReader();
  var dataReceivedMarker = {};

  btOBDReader.on('connected', function () {
      //this.requestValueByName("vss"); //vss = vehicle speed sensor

      this.addPoller("vss");
      this.addPoller("rpm");
      this.addPoller("temp");

      this.startPolling(500); //request second
  });

  btOBDReader.on('dataReceived', function (data) {
      console.log(data);
  // client.on('vehicle', function(data){
    console.log(data);
    if (data.hasOwnProperty('name')) {
      if (data.name == "speed") {
        var speedData = {"speed":data.value}
        client.broadcast.emit("speed", speedData);
      }else if (data.name == "rpm") {
        var rpmData = {"rpm":data.value}
        client.broadcast.emit("rpm", rpmData);
      }else if (data.name == "temp") {
        var tempData = {"temp":data.value}
        client.broadcast.emit("temp", tempData);
      }
    }else {

    }
     dataReceivedMarker = data;
  });
btOBDReader.autoconnect('obd');

  client.on('disconnect', function(){});
});



// btOBDReader.autoconnect('obd');

server.listen(PORT, function(){
  console.log("Application listening at " + PORT);
});
