import React, { Component } from 'react';
import './App.css';
import SignUp from "./SignUp.js";
import Login from './Login.js';
import Homepage from './Homepage.js';
import Profile from './Profile.js';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Provider } from "mobx-react";
import UserStore from "./Stores/userStore";
import Navbar from './Navbar/Navbar';
import {Container} from 'semantic-ui-react';

class App extends Component {
  render() {
    return (
      <div>
        <Provider UserStore={new UserStore()}>
          <Router>
            <div className='bg'>
              <Navbar/>
              <Container>
                <Route exact path='/' render={()=><Homepage/>}/>
                <Route path='/Profile' render={()=><Profile/>}/>
                <Route path='/SignUp' render={()=><SignUp/>}/>
                <Route path='/Login' render={()=><Login/>}/>
              </Container>
            </div>
          </Router>
        </Provider>
      </div>
    )
  }
}

export default App;