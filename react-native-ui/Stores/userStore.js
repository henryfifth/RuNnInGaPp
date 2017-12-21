import react, {Component} from 'react';
import observable from 'mobx';
import { extendObservable } from "mobx";
const axios = require('axios');

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: {
        message: '',
      },
      routes: [],
      routeToAdd: [],
      running: false,
      pos: null,
      init: true,
      get retrieveUser() {
        return this.user
      }
    });
  }

  login(navigate, email, pass){
    axios.post('http://192.168.0.4:5000/login', {
      username: email,
      password: pass,
    }).then((res)=>{
      if(res.data.success){
        this.user = res.data
        navigate('Profile')
      }else 
        return <Text>Email and password don't match</Text>
    })
  }

  run(){
    if(this.running){
      if(this.init){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.pos = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            };
          },
          (error) => this.pos = { error: error.message },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        this.init = false
      }
      setTimeout(()=>{
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.pos = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            };
          },
          (error) => this.pos = { error: error.message },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
        );
        if(this.running){
          this.routeToAdd.push(this.pos);
          this.run();
        }
      }, 10000)
    }
  }

  endRun(){
    this.running = false;
  }
}