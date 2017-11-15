import React, { Component } from 'react';
import './App.css';
import SignUp from "./SignUp.js";
import Login from './Login.js';
// import Home from './Home.js';
import Profile from './Profile.js';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Provider } from "mobx-react";
import UserStore from "./Stores/userStore";
// var axios = require('axios');

class App extends Component {
  render() {
    return (
      <div>
        <Provider UserStore={new UserStore()}>
          <Router>
            <div className='bg'>
              <Route path='/Profile' render={()=><Profile/>}/>
              <Route path='/SignUp' render={() => <SignUp />} />
              <Route path='/Login' render={() => <Login />} />
            </div>
          </Router>
        </Provider>
      </div>
    )
  }
}

export default App;

