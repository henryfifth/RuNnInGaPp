import { extendObservable } from "mobx";
import { setTimeout } from "timers";
var axios = require('axios');
let lat = 45;
let lng = 45;
function showPosition(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
}
navigator.geolocation.getCurrentPosition(showPosition)

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: {
        message: '',
      },
      routes: [],
      get retrieveUser() {
        return this.user
      }
    });
    axios.post('/getUser').then((data) =>{
      this.user = data.data
    });
  }

  getLat(){
    this.user.lat = lat;
    return lat;
  }

  getLng(){
    this.user.lng = lng;
    return lng;
  }

  getRoutes(){
    axios.post('/getRoutes', {}).then((res) => {
      if (res.data.success) {
        this.routes = res.data.routes;
      }
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
        console.log(lat + ', ' + lng);
        resolve(res.data);
      });
    }).then(()=>{
      axios.post('/getRoutes', {lat: lat, lng: lng}).then((res)=>{
        console.log(res);
        this.routes = res.data
      });
      setTimeout(()=>{
        this.user.lat = lat;
        this.user.lng = lng;
        axios.post('/logActivity', {user: this.user});
        //set a timeout, because location takes a bit to load.
      }, 5000);
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

  addRoute(){
    axios.post('/addRoute', {
      //add your stuff here
    }).then((res)=>{
      //do the stuff here
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