import react, {Component} from 'react';
import observable from 'mobx';

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
  }
}