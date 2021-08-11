const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
var body_parser = require('body-parser');
// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

// routes
app.use(require('./routes/index'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(body_parser.urlencoded({extended:true}));

// listening the Server
const server= app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});

var io=require('socket.io')(server);

var messages = [
  {
    id: 1,
    text: "Hola soy un mensaje",
    author: "Carito",
  },
];

io.on('connection', function (socket) {
  console.log("Alguien se ha conectado con Sockets",socket.id);
  socket.on("new-message", function (data) {
    messages.push(data);
    io.emit("messages", messages);
  });
})
