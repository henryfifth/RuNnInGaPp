import { extendObservable } from "mobx";
var axios = require('axios');

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: {
        message: '',
      },
      get retrieveUser() {
        return this.user
      }
    });
    axios.post('/getUser').then((data) =>{
      this.user = data.data
    });
  }

  submitLogin(a, b) {
    return new Promise((resolve, reject) => {
      axios.post('/login', {
        username: a,
        password: b,
      }).then((res) => {
        if (res.data.success) {
          this.user = res.data.user;
        }
        this.user.shouldRedirect = true;
        resolve(res.data);
      });
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
          if(this.user.success){
            this.submitLogin(signupObj.email, signupObj.password);
          }
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
        }).then(() => {
        })
      })
    } else {
      this.user.message = 'Passwords don\'t match'
    }
  }
}