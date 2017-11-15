import { extendObservable } from "mobx";
var axios = require('axios');

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: {
        message: ''
      },
      get retrieveUser() {
        return this.user
      }
    });
    axios.post('/getUser').then((data) =>{
      this.user = data.data
    });
  }

  redirect(url){
    var john;
    if(url.length < 1){
      john = '/login';
    }else{
      john = url;
    }
    let bob = window.location.href
    bob = bob.split('/');
    bob.splice(-1, 1, john)
    //change me to https later
    bob.splice(0, 1, 'http:')
    bob.splice(1, 0, '//');
    bob = bob.join('');
    window.location.href = bob;
  }

  submitLogin(a, b) {
    return new Promise((resolve, reject) => {
      axios.post('/login', {
        username: a,
        password: b,
      }).then((res) => {
        if (res.data.success) {
          this.user = {
            currentUser: res.data
          }
        }
        resolve(res.data);
      });
    });
  }

  testFunc(a, b) {
    this.submitLogin(a, b).then((user) => {
      if (user.found) {
        this.user = {
          message: user.message
        }
        this.redirect('/profile')
      } else {
        this.user = {
          message: user.message
        }
      }
    }, (e) => {
      console.log(e);
    });
  }

  logOut() {
    return new Promise((resolve, reject) => {
      axios.post('/logout').then((res) => {
        this.user = {
          message: res.data.message
        }
      });
    });
  }

  submitSignup(signupObj) {
    return new Promise((resolve, reject) => {
      axios.post('/signup', {
          firstName: signupObj.firstName,
          lastName: signupObj.lastName,
          email: signupObj.email,
          password: signupObj.password,
        }).then((userObj) => {
          this.user = userObj.data;
          console.log(this.user)
          resolve();
        }
      );
    });
  }

  handleSignup(p1, p2, fN, lN, e) {
    if (p1 === p2) {
      return new Promise((resolve, reject) => {
        this.submitSignup({
          firstName: fN,
          lastName: lN,
          email: e,
          password: p1,
        }).then((res) => {
          
        })
      })
    } else {
      this.user.message = 'Passwords don\'t match'
    }
  }
}