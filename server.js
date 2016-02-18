var express = require('express');
var bodyParser = require('body-parser');
var CONFIG = require('./config.json');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var isAuthenticated = require('./middleware/isAuthenticated');
var morgan = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);


mongoose.connect('mongodb://localhost/pixelpainter');

var paintingSchema = mongoose.Schema({
  author: String,
  painting: [],
  user_id: String
});

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  user_id: String
});

var Painting = mongoose.model('Painting', paintingSchema);

var User = mongoose.model('User', userSchema);

var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({
  store: new RedisStore(
    {
      host: '127.0.0.1',
      port: '6379'
    }
  ),
  secret: CONFIG.SESSION.secret
  })
);

passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },
  function (req, username, password, done) {
    User.findOne({
      username: username,
      password: password
    }).
    // result of the find is a user
    then(function (user) {
      if ( !user ) {
        return done(null, false);
      }
      // the thing inside the done will be assigned to req.user
      // first parameter is error
      return done(null, user);
    });
  }
));

/****** I don't know what this does **********/
passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
/*******************************************/

//creates a default value for res.locals
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  // res.locals.username = req.session.passport.user.username || null;
  next();
});

app.route('/login')
  .get(
    function (req, res) {
      res.render('login');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
);

// Logout is a route rather than a button
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/signup', function (req, res) {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // if (! User.findOne({username: req.body.username})) {
  //   newUser.save();
  //   res.redirect('login');
  // }
  return User.findOne({username: req.body.username})
    .then(function (user) {
      if (user) {
        return res.render('login', {message: "That username is already taken."});
      } else {
        return newUser
          .save()
          .then(function (savedUser) {
            return res.render('login', {message: "You successfully signed up. Feel free to log in."});
          });
      }
    });
});

app.get('/',
  isAuthenticated,
  function (req, res) {
    console.log(req.session);
    res.render('index', {x: 10, y: 10, colors: CONFIG.SWATCHES.SUMMER, username: req.session.passport.user.username});
  }
);

app.post('/save', function (req, res) {
  console.log(req.session);
  var newPainting = new Painting({
    author: req.session.passport.user.username,
    painting: req.body.painting,
    user_id: req.session.passport.user._id
  });
  newPainting.save(function (err, painting) {
    res.render('index', {x: 10, y: 10, colors: CONFIG.SWATCHES.SUMMER});
  });
});

app.get('/painting/:id', function (req, res) {
  Painting.findOne({ '_id': req.params.id})
  .then(function (result) {
    console.log(result);
    res.render('frame', {x: 10, y: 10, painting: result.painting});
  });
});

// Catch-all route-undefined handler
app.use(function (req, res, next) {
  res.status(404);
  return res.send('What are you doing here?');
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  var server = app.listen(CONFIG.PORT, function() {
    console.log('Listening to port', CONFIG.PORT);
  });
});