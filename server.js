var express = require('express');
var bodyParser = require('body-parser');
var CONFIG = require('./config.json');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pixelpainter');

var paintingSchema = mongoose.Schema({
  author: String,
  painting: []
});

var Painting = mongoose.model('Painting', paintingSchema);

var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.render('index', {x: 10, y: 10, colors: CONFIG.SWATCHES.SUMMER});
});

app.post('/save', function (req, res) {
  console.log(req.body);
  var newPainting = new Painting({
    author: "Kevin",
    painting: req.body.painting
  });
  newPainting.save(function (err, painting) {
    res.render('index', {x: 10, y: 10, colors: CONFIG.SWATCHES.SUMMER});
  });
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  var server = app.listen(CONFIG.PORT, function() {
    console.log('Listening to port', CONFIG.PORT);
  });
});