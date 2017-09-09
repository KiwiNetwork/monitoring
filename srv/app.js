var express = require('express')
var socketIO = require('socket.io')

var app = express()
var port = 5000


app.set('views', __dirname + '/templates');
app.set('view engine', "ejs");

app.use('/static', express.static(__dirname + '/static/'));

app.get('/', function (req, res) {
    res.render('index')
})

var server = require('http').Server(app);

var sio = socketIO(server)

sio.on('connection', function (socket) {
    socket.on('sync', function (data) {
        console.log('recived : ', data)
        socket.broadcast.emit('refresh', data)
    })
})

server.listen(port)

console.log('The magic happens on port ' + port);