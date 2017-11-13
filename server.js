const express = require('express');
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io');
const bodyParser = require("body-parser");
// const expressSession = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const passwordHash = require("password-hash");
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const User = require('./models/users.js');
const Route = require('./models/routes.js');
// const cookieParser = require('cookie-parser');
// const nodemailer = require('nodemailer');
const http = require('http');
const path = require('path');
require('dotenv').config();

const mongodbUri = 'mongodb://localhost/Users';
const mongooseUri = uriUtil.formatMongoose(mongodbUri);
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
mongoose.connect(mongooseUri, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected.');
});

// app.use(bodyParser.json({ type: 'application/json' }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressSession({ secret: "Lee is a motherfucking BEAST!" }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.static('./potluck/build'));

// passport.use(new LocalStrategy({ username: "email", password: "password" }, (email, password, done) => {
//   User.findOne({
//     email: email
//   }, (err, foundUser) => {
//     if (err) {
//       console.log(err);
//       next(err);
//     } else if (foundUser == null) {
//       console.log(foundUser)
//       return done('Something went wrong! Please try again', null)
//     } else {
//       if (passwordHash.verify(password, foundUser.password)) {
//         return done(null, foundUser);
//       } else {
//         return done("password and username don't match", null);
//       }
//     }
//   });
// }));

// passport.serializeUser(function (user, done) {
//   done(null, user._id);
// })

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     if (err) {
//     } else {
//       done(null, user);
//     }
//   })
// })

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

function inviteEmail(email) {
  let beenVerified = verifyEmail(email);
  if (beenVerified != "") {
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'idfkbob@gmail.com',
          pass: 'ThisIsAPassword'
        }
      });
      let mailOptions = {
        from: '"Potluck 👻" <idfkbob@gmail.com>',
        to: beenVerified,
        subject: 'Hello ✔',
        text: 'Hi there!',
        html: '<body>' +
          '<style>#bob{font-size: 50%;}</style>' +
          "<p>You have received an invitation to join your friends on our app, Potluck! </p>" +
          "<footer class=bob>Access our application at http://potluck-react.herokuapp.com ! Create an account, then join the list 'Blunderbuss' using the password '123' !</footer>" +
          '</body>',
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
}

function sanitize(input){
  console.log(input)
  tim = input.toString();
  bob = input.split('');
  badChar = ['(', ')', '<', '>', '{', '}', '/', ';'];
  bob.forEach((e, i)=>{
    badChar.forEach((e2, i2)=>{
      if(e === e2){
        return false
      }
    });
  });
  return input
}

app.post('/signup', (req, res, next) => {
  console.log(req.body)
  var user = new User();
  user.firstName = sanitize(req.body.firstName);
  user.lastName = sanitize(req.body.lastName);
  user.email = sanitize(req.body.email);
  user.password = req.body.password;
  if(user.firstName && user.lastName && verifyEmail(user.email)){
    User.findOne({
      email: user.email
    }, (err, foundUser) => {
      if (err) {
        res.json({
          found: false,
          message: err,
          success: false
        });
      } else {
        user.save((error, userReturned) => {
          if (error) {
            res.json({
              found: true,
              message: 'An account is already associated with that email address.',
              success: false
            });
          } else {
            res.json({
              userReturned: userReturned,
              found: true,
              message: "Account created.",
              success: true
            });
          }
        });
      }
    });
  }
});

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});