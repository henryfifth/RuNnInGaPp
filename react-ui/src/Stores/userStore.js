//TODO: Add comments

import { extendObservable } from "mobx";
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
      routeToAdd: {
        type: null,
        info: [[], [], []]
      },
      adding: false,
      get retrieveUser() {
        return this.user
      }
    });
    axios.post('/getUser').then((res) => {
      this.user = res.data
    });
  }

  getLat() {
    this.user.lat = lat;
    return lat;
  }

  getLng() {
    this.user.lng = lng;
    return lng;
  }

  getRoutes() {
    axios.post('/getRoutes', {}).then((res) => {
      if (res.data.success) {
        this.routes = res.data.routes;
      }
    });
  }

  addRouteInfo(e, that) {
    //for some reason, google maps changes 'this' so i pass this.props.UserStore 
    //in the GoogleMap component to addRouteInfo when it is called
    if (that.routeToAdd.type <= 2 && that.adding && typeof that.routeToAdd.type === 'number')
      that.routeToAdd.info[that.routeToAdd.type].push({ lat: e.ga.x, lng: e.ga.y });
    else if (that.routeToAdd.type === 3)
      that.routeToAdd.info = [0, 0, 0];
    //and this is how I pass the info back to the userStore.
    that.horribleHack(that.routeToAdd.info)
    //Please don't ask me how it works.
  }

  horribleHack(info) {
    this.routeToAdd.info = info;
    if (this.routeToAdd.type === 4)
      this.addRoute();
  }

  addRoute() {
    axios.post('/addRoute', {
      route: this.routeToAdd,
    }).then((res) => {
      console.log(res);
    });
  }

  change(input) {
    this.routeToAdd.type = input;
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
    }).then(() => {
      if (lat === 45 && lng === 45) {
        setTimeout(() => {
          console.log(lat + ', ' + lng)
          axios.post('/getRoutes', { lat: lat, lng: lng }).then((res) => {
            console.log(res);
            this.routes = res.data
          });
        }, 3000);
      } else {
        console.log(lat + ', ' + lng)
        axios.post('/getRoutes', { lat: lat, lng: lng }).then((res) => {
          console.log(res);
          this.routes = res.data
        });
      }
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
        if (this.user.success) {
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