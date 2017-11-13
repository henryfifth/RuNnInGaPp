import React, { Component } from 'react';
import './App.css';
import SignUp from "./SignUp.js";
import {
  Route,
} from 'react-router-dom';
var axios = require('axios');

class App extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className='bg'>
        <SignUp />
      </div>
    )
  }
}


export default App;

