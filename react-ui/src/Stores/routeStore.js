import { extendObservable } from "mobx";
var axios = require('axios');

export default class RouteStore {
  constructor() {
    extendObservable(this, {
      routes: {
        id: []
      },
      get retrieveUser() {
        return this.user
      }
    });
  }
}