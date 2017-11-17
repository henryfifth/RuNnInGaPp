var express = require('express');
var app = require("express")();
var server = require('http').Server(app);
var io = require('socket.io');
let bodyParser = require("body-parser");
var fetch = require('node-fetch');
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var passwordHash = require("password-hash");
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var User = require('./models/users.js');
const Route = require('./models/routes.js')
var cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
var http = require('http');
var path = require('path');
var sha256 = require('js-sha256');
require('dotenv').config();

var mongodbUri = 'mongodb://' + process.env.MLAB_USERNAME + ':' + process.env.MLAB_PASSWORD + '@ds259855.mlab.com:59855/everything';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var ioServer = io(server, {
  origins: allowedOrigins
});
mongoose.connect(mongooseUri, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('User database connected.');
});

app.use(helmet())
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'hello loser!' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./react-ui/build'));

passport.use(new LocalStrategy({ username: "email", password: "password" }, (email, password, done) => {
  User.findOne({
    email: email
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
      next(err);
    } else if (foundUser == null) {
      return done('Something went wrong! Please try again', null)
    } else {
      if (passwordHash.verify(password, foundUser.password)) {
        return done(null, foundUser);
      } else {
        return done("password and username don't match", null);
      }
    }
  })
})
)

passport.serializeUser(function (user, done) {
  done(null, user._id);
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      done(null, user);
    }
  })
})

function verifyEmail(email) {
  let emailReplaced = email.replace(/ /g, '');
  let emailSplit = emailReplaced.split(',');
  let arr = [];
  emailSplit.forEach((e, i) => {
    let x = emailSplit.length;
    let atSymbol = emailSplit[i].indexOf("@");
    let dotSymbol = emailSplit[i].lastIndexOf(".");
    if (atSymbol < 1 || dotSymbol < atSymbol + 2 || dotSymbol + 2 >= x.length || atSymbol === -1) {

    } else {
      arr.push(emailSplit[i])
    }
  });
  return arr.toString();
}

function confirmEmail(email, user, id) {
  let url = "https://secure-ridge-79159.herokuapp.com/users/" + user + "/" + id
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'Runnautoemail@gmail.com',
        pass: 'ThisIsASuperSecurePassword'
      }
    });
    let mailOptions = {
      from: '"Runn 👻" <runnautoemail@gmail.com>',
      to: email,
      subject: 'Hello ✔',
      text: 'Hi there!',
      html: '<body>' +
        '<style>#bob{font-size: 50%;}</style>' +
        "<p>Hello, you recently signed up for Runn. All you need to do now is click the link below to confirm you're email account.</p>" +
        "<p><a" + url + ">" + url + "</a></p>" +
        "<p></p>" +
        "<p>Please do not reply to this email.</p>" +
        "<p>Didn't sign up? Just ignore this email. It was a one time thing anyway . . .</p>" +
        '<footer>Also, here is a nyan cat . . . Just beacuse . . .</footer>' +
        '',
      attachments: [{
        filename: 'nyan cat ✔.gif',
        path: './nyan.gif',
        cid: 'nyan@example.com'
      }]
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        return error;
      }
    });
  });
}

function sendThing() {
  return true
}

ioServer.on('connection', (client) => {
  console.log('client connected');

  client.on('disconnect', () => { console.log("client disconnected") });
});

function sanitize(input) {
  tim = input.toString();
  bob = input.split('');
  badChar = ['(', ')', '<', '>', '{', '}', '/', ';', '*', '[', ']', '"', "'"];
  bool = true
  bob.forEach((e, i) => {
    badChar.forEach((e2, i2) => {
      if (e === e2) {
        console.log('someone tried to put in some bad characters');
        console.log(input)
        bool = false
      }
    });
  });
  if (bool) {
    return input
  } else {
    return false
  }
}
app.post("/signup", (req, res, next) => {
  var user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.routes = [{ created: [] }, { ran: [] }, { saved: [] }];
  user.stats = [{ name: 'Mile' }, { name: '1k' }, { name: '3k' }, { name: '5k' }, { name: '10k' }, { name: '15k' }, { name: '20k' }, { name: 'Marathon' }];
  user.info = false;
  user.secretId = sha256(user.firstName + user.email);
  if (sanitize(user.firstName) != false && sanitize(user.lastName) != false && verifyEmail(sanitize(user.email)) != 0) {
    User.findOne({
      email: user.email
    }, (err, foundUser) => {
      if (err) {
        console.log(err)
        res.json({
          found: false,
          message: err,
          success: false
        });
      } else {
        user.save((error, userReturned) => {
          if (error) {
            console.log(error);
            res.json({
              found: true,
              message: 'An account is already associated with that email address.',
              success: false
            });
          } else {
            confirmEmail(userReturned.email, userReturned.firstName, user.secretId)
            res.json({
              found: true,
              message: "Account created.",
              success: true
            });
          }
        });
      }
    });
  } else {
    res.json({
      message: 'Due to security issues, You can only input regular characters',
      success: false
    })
  }
});

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      console.log(err)
      res.json({ found: false, success: false, err: true, message: err });
    } else if (user) {
      req.logIn(user, (err) => {
        if (err) {
          console.log(err);
          next(err);
          res.json({ found: true, success: false, message: err })
        } else {
          res.json({ found: true, success: true, firstName: user.firstName, lastName: user.lastName, message: 'U R l0gg3d 1n', info: user.info, stats: user.stats, routes: user.routes });
        }
      })
    } else {
      res.json({ found: false, success: false, message: "Password and username don't match." })
    }
  })(req, res, next);
  //Not sure what these two lines are for, so I commented them out. Lol
  // var email = req.body.email;
  // var password = req.body.password;
});

app.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({ message: 'You are logged out', success: true })
});

app.post('/getUser', (req, res, next) => {
  if (req.session.passport) {
    User.findById(req.session.passport.user, (err, userFound) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        res.json(userFound)
      }
    });
  } else {
    res.json({ message: 'No user logged in.' })
  }
});

app.post('/verify', (req, res, next) => {
  console.log('got here')
  console.log(req.body.id)
  User.find({ secretId: req.body.id }, (err, userFound) => {
    console.log('got inside')
    if (err) {
      console.log(err);
      res.json({ msg: "User not found", verified: false })
      next(err)
    } else {
      console.log("here")
      console.log(userFound)
      console.log('split')
      userFound.info = true;
      console.log('user verified')
      res.json({ verified: true, msg: "You have been verified!" })
    }
  });
});

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});
