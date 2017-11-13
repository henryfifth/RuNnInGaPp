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
var http = require('http');
var path  = require('path');
require('dotenv').config();

var mongodbUri = 'mongodb://localhost/Users';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
var allowedOrigins = "http://localhost:* http://127.0.0.1:* http://potluck-react.herokuapp.com:*";
var ioServer = io(server, {
  origins: allowedOrigins
});
mongoose.connect(mongooseUri, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Item database connected.');
});

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: "moby" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./potluck/build'));

passport.use(new LocalStrategy({ username: "email", password: "password" },  (email, password, done) => {
  User.findOne({
    email: email
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
      next(err);
    } else if (foundUser == null){
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

function sendThing(){
  return true
}

ioServer.on('connection', (client)=>{
  console.log('WEVE CONNECTGED')
  client.on('joinHouse', (house)=>{
    console.log('joining a house: ' + house);
    client.join(house);
  });

  client.on('deleteItem', (data)=>{
    console.log('deteled item')
    House.findByIdAndUpdate({ _id:data.house  }, "items", (err, house) => {
      var num = null;
      house.items.forEach(function (e, i) {
        if (e._id == data._id) {
          num = house.items.indexOf(e);
        }
      });
      house.items.splice(num, 1);
      house.save((err, itemReturned) => {
        if (err) {
          console.log(err);
        } else {
          House.findById({ _id: data.house }, (err, house) => {
            if (err) {
              console.log(err);
            } else {
              ioServer.in(data.house).emit('updatedMyItems', house.items)
            }
          });
        }
      });
    });
  });

  client.on('selectorToServer', (data)=>{
    console.log('selected to server')
    House.findByIdAndUpdate({ _id: data.house }, "items", (err, house) => {
      house.items.forEach(function (e, i) {
        if (e._id == data._id) {
          e.selector = data.selector
          e.color = data.user.color
        }
      });
      house.save((err, itemReturned) => {
        if (err) {
          console.log(err);
        } else {
          House.findById({ _id: data.house }, (err, house) => {
            if (err) {
              console.log(err);
            } else {
              ioServer.in(data.house).emit('updatedMyItems', house.items)
            }
          });
        }
      });
    })
  });

  client.on('addedItem', (data)=>{
    console.log('adding an item')
    House.findByIdAndUpdate({ _id: data.house }, "items", (err, house) => {
      if (err) {
        console.log(err);
      } else {
        house.items.push({ name: data.item.name, quantity: data.item.quantity, selector: false })
        house.save((err, itemReturned) => {
          if (err) {
            console.log(err);
          } else {
            House.findById({ _id: data.house }, (err, house) => {
              if (err) {
                console.log(err);
              } else {
                ioServer.in(data.house).emit('updatedMyItems', house.items)
              }
            });
          }
        });
      };
    })
  })

  client.on('disconnect', ()=>{console.log("client disconnected")});
});

//  app.get('/*', function (req, res) {
//    res.sendFile(path.join(__dirname, 'potluck', 'build', 'index.html'));
//  });

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
app.post("/signup", (req, res, next) => {
  var user = new User();
  user.firstName = sanitize(req.body.firstName);
  user.lastName = sanitize(req.body.lastName);
  user.email = verifyEmail(req.body.email);
  user.password = req.body.password;
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
});

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});