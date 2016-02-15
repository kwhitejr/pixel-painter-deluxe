var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
  res.render('index', {x: 10, y: 10});
});

var server = app.listen(3000, function() {
  console.log('Listening to port', server.address().port);
});