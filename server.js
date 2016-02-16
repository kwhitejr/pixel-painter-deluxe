var express = require('express');
var bodyParser = require('body-parser');
var CONFIG = require('./config.json');

var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
  res.render('index', {x: 10, y: 10, colors: CONFIG.SWATCHES.SUMMER});
});

var server = app.listen(CONFIG.PORT, function() {
  console.log('Listening to port', CONFIG.PORT);
});