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
import AddRoute from './AddRoute';
import About from './About';
import { Container, Segment } from 'semantic-ui-react';

class App extends Component {
  render() {
    return (
      <Provider UserStore={new UserStore()}>
        <Router>
          <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }} className='bg'>
            <Segment
              inverted
              textAlign='center'
              style={{ padding: '1em 0em' }}
              vertical
            >
              <Navbar />
            </Segment>
            <div style={{ flex: 1 }}>
              <Verify />
              <Switch>
                <Route exact path='/' render={() => <Homepage />} />
                <Container>
                  <Switch>
                    <Route path='/profile' render={() => <Profile />} />
                    <Route path='/signUp' render={() => <SignUp />} />
                    <Route path='/login' render={() => <Login />} />
                    <Route path='/logout' render={() => <Logout />} />
                    <Route path='/addRoute' render={()=><AddRoute />} />
                    <Route path='/about' render={()=> <About/>} />
                    <Route render={() => <NotFoundRoute />} />
                  </Switch>
                </Container>
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App;