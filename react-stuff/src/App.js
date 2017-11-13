import React, { Component } from 'react';
import Home from './Home.js';
import SignUp from './SignUp.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Home />
        <SignUp />
      </div>
    );
  }
}

export default App;
