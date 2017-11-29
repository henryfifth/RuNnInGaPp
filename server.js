const express = require('express');
const app = require("express")();
const server = require('http').Server(app);
const io = require('socket.io');
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passwordHash = require("password-hash");
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const User = require('./models/users.js');
const Route = require('./models/routes.js')
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const sha256 = require('js-sha256');
require('dotenv').config();

const mongodbUri = 'mongodb://' + process.env.MLAB_USERNAME + ':' + process.env.MLAB_PASSWORD + '@ds259855.mlab.com:59855/everything';
const mongooseUri = uriUtil.formatMongoose(mongodbUri);
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
const allowedOrigins = "http://localhost:* http://127.0.0.1:*";
const ioServer = io(server, {
  origins: allowedOrigins
});
mongoose.connect(mongooseUri, options);
const db = mongoose.connection;
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
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './react-ui/build', 'index.html'))
});

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
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      done(null, user);
    }
  });
});

function verifyEmail(email) {
  console.log(email)
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
        /*
        _________   ___ ___    _____    _______    ___________________     _____  ___________
        \_   ___ \ /   |   \  /  _  \   \      \  /  _____/\_   _____/    /     \ \_   _____/
        /    \  \//    ~    \/  /_\  \  /   |   \/   \  ___ |    __)_    /  \ /  \ |    __)_ 
        \     \___\    Y    /    |    \/    |    \    \_\  \|        \  /    Y    \|        \
         \______  /\___|_  /\____|__  /\____|__  /\______  /_______  /  \____|__  /_______  /
                \/       \/         \/         \/        \/        \/           \/        \/
        before you put this app into production
        */
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
        "<p>Didn't sign up? Just ignore this email.</p>" +
        "<p></p>" +
        "<p>Please do not reply to this email.</p>" +
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
  badChar = ['(', ')', '<', '>', '{', '}', '/', ';', '*', '[', ']', '"', "'", '$'];
  bool = input
  bob.forEach((e, i) => {
    badChar.forEach((e2, i2) => {
      if (e === e2) {
        console.log('someone tried to put in some bad characters');
        console.log(input)
        bob.splice()
        bool = false
      }
    });
  });
  return bool
}

app.post("/signup", (req, res, next) => {
  var user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.routes = {created: [], ran: [], saved: []};
  user.stats = [];
  user.info = false;
  user.secretId = sha256(user.firstName + user.email);
  if (user.firstName != false && sanitize(user.lastName) != false && verifyEmail(sanitize(user.email)) != 0) {
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
              success: false,
            });
          } else {
            confirmEmail(userReturned.email, userReturned.firstName, user.secretId)
            res.json({
              found: true,
              message: "Account created.",
              success: true,
              firstName: userReturned.firstName,
              lastName: userReturned.lastName,
              email: userReturned.email,
              routes: userReturned.routes,
              stats: userReturned.stats,
              connections: userReturned.connections,
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
          res.json({ found: true, success: true, user: user, message: 'U R l0gg3d 1n' });
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
  User.find({ secretId: req.body.id }, (err, userFound) => {
    if (err) {
      console.log(err);
      res.json({ msg: "User not found", verified: false })
      next(err)
    } else {
      userFound.info = true;
      res.json({ verified: true, msg: "You have been verified!" })
    }
  });
});

app.post('/addRun', (req, res, next) => {
  User.findByIdAndUpdate({ _id: req.body.user._id }, "routes", (err, user) => {
    if (err) {
      console.log(err);
    } else {
      let d = new Date;
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      user.stats.push({ distance: req.body.distance, time: req.body.time, date: months[d.getMonth()] + " " + d.getDay() + ", " + d.getFullYear() })
      user.save((error, userReturned) => {
        if (error) {
          console.log(error);
          next(error);
        } else {
          User.findById({ _id: req.body.user._id }, (err, user) => {
            if (err) {
              console.log(err);
              next(err);
            } else {
              res.json(user.stats)
            }
          });
        }
      });
    }
  });
});

app.post('/getRoutes', (req, res, next) => {
  if (req.session.passport) {
    User.findById(req.session.passport.user, (err, userFound) => {
      let routesToFind = [];
      let routes = [];
      userFound.routes.created.forEach((e, i)=>{
        routesToFind.push(e.id);
      });
      userFound.routes.ran.forEach((e, i)=>{
        routesToFind.push(e.id);
      });
      userFound.routes.saved.forEach((e, i)=>{
        routesToFind.push(e.id);
      });
      if(routesToFind.length > 0){
        routesToFind.forEach((e, i)=>{
          Route.findById(e, (err, routeFound)=>{
            if(err)
              console.log(err);
            else
              routes.push(routeFound);
          });
        });
        Route.find({lat : {$gte: maxLat, $lt: minLat}, long: {$gte: maxLong, $lt: minLong}}, (error, routesFound)=>{
          // LOL
          if(error)
            console.log(error);
          else{
            console.log(routesFound);
            routes.push(routesFound);
          }
        });
        console.log("SPLIT!")
        console.log(routes);
        res.json(routes);
      }else{
        res.json("No routes to find.");
      }
    });
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});
