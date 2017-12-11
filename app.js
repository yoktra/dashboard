// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

var PORT = 4000;

// var OBDReader = require('bluetooth-obd');
// var btOBDReader = new OBDReader();
// var dataReceivedMarker = {};


app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));





// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(client){
  console.log('Client connected');

  // btOBDReader.on('connected', function () {
  //     //this.requestValueByName("vss"); //vss = vehicle speed sensor
  //
  //     this.addPoller("vss");
  //     this.addPoller("rpm");
  //     this.addPoller("temp");
  //
  //     this.startPolling(500); //request second
  // });
  //
  // btOBDReader.on('dataReceived', function (data) {
  //     console.log(data);
  client.on('vehicle', function(data){
    console.log(data);
    var newData = data
    //JSON.parse(data);
    console.log(newData);
    if (('name' in newData)==true){
      if (('vss' in newData)==true) {
        client.emit('speed', newData.value);
      }
          // console.log(data);

      }

  });

  //     dataReceivedMarker = data;
  // });



  client.on('disconnect', function(){});
});



// btOBDReader.autoconnect('obd');

server.listen(PORT, function(){
  console.log("Application listening at " + PORT);
});
