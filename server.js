var express = require('express');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var app = express();

var server = app.listen(3000, () => {
 console.log('server is running on port', server.address().port);
});

io.listen(server);

app.use(express.static(__dirname));

var dbUrl = "mongodb://admin:admin12@ds143474.mlab.com:43474/messages-test";

mongoose.connect(dbUrl, (error) => {
  console.log("connected to mongodb", error);
});

var Message = mongoose.model('Message',{ name : String, message : String});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/messages', (req, res) => {
  Message.find({},(err, messages) => {
    res.send(messages);
  })
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
});

io.on('connection', () =>{
 console.log('a user is connected');
})
