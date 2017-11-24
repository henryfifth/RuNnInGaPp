import React, { Component } from 'react';
import './App.css';
import SignUp from "./SignUp.js";
import Login from './Login.js';
import Homepage from './Homepage.js';
import Profile from './Profile.js';
import Logout from './Logout.js';
import Verify from './Verify.js';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Provider } from "mobx-react";
import UserStore from "./Stores/userStore";
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import NotFoundRoute from './NotFoundRoute.js';
import { Container, Segment } from 'semantic-ui-react';
var axios = require('axios');

class App extends Component {
  render() {
    return (
      <div>
        <Provider UserStore={new UserStore()}>
          <Router>
            <div className='bg'>
              <Segment
                inverted
                textAlign='center'
                style={{ padding: '1em 0em' }}
                vertical
              >
                <Navbar />
              </Segment>
              <Route exact path='/' render={() => <Homepage />} />
              <Verify />
              <Container>
                <Switch>
                <Route path='/profile' render={() => <Profile />} />
                <Route path='/signUp' render={() => <SignUp />} />
                <Route path='/login' render={() => <Login />} />
                <Route path='/logout' render={() => <Logout />} />
                <Route render={()=> <NotFoundRoute />} />
                </Switch>
              </Container>
              <Footer />
            </div>
          </Router>
        </Provider>
      </div>
    )
  }
}

export default App;