//TODO: Add comments

import { extendObservable } from "mobx";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps"
var axios = require('axios');
let lat = 45;
let lng = 45;
const google = window.google;

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
      shownRoutes: [],
      routeToAdd: {
        type: null,
        info: {
          start: null,
          waypoints: [],
          end: null,
        }
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

  addRouteInfo(e) {
    let a = this.routeToAdd
    console.log(a.info.waypoints);
    let mousePos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    if (this.adding) {
      switch (a.type) {
        case 0:
          a.info.start = mousePos
          break;
        case 1:
          a.info.waypoints.push(mousePos);
          break;
        case 2:
          a.info.end = mousePos
          break;
        case 3:
          a.info = {
            start: null,
            waypoints: [],
            end: null,
          }
          break;
        case 4:
          this.addRoute();
          break;
        default:
          break;
      }
    }
    this.routeToAdd = a;
    console.log(this.routeToAdd);
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
        resolve(res.data);
      });
    }).then(() => {
      console.log('106')
      axios.post('/getRecomendedRoutes', { lat: lat, lng: lng }).then((res) => {
        console.log(res);
        this.routes = res.data
        console.log(this.routes);
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