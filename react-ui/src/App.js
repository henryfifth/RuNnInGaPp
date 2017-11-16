import React, { Component } from 'react';
import './App.css';
import SignUp from "./SignUp.js";
import Login from './Login.js';
import Homepage from './Homepage.js';
import Profile from './Profile.js';
import Logout from './Logout.js';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Provider } from "mobx-react";
import UserStore from "./Stores/userStore";
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import {Container, Segment} from 'semantic-ui-react';
var axios = require('axios');

class App extends Component {
  constructor(){
    super();
    this.slice = this.slice.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  slice(url){
    console.log('got to slice')
    let bob = url.split('/');
    bob.forEach((e, i)=>{
      console.log(e)
      if(e === 'users'){
        console.log('got inside the if')
        axios.post('/verify', {id: bob[i+2]}).then((res)=>{
          console.log(res)
          if(res.data.verified){
            console.log('got verified')
            return 1
          }
        });
      }
    });
  }
  redirect(){
    this.props.history.push('/login');
  }
  componentDidMount(){
    console.log('got to componentdidmount')
    if(this.slice(window.location.href) === 1){
      this.redirect();
      return null;
    }

  }
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
              <Navbar/>
              </Segment>
                <Route exact path='/' render={()=><Homepage/>}/>
              <Container>
                <Route path='/profile' render={()=><Profile/>}/>
                <Route path='/signUp' render={()=><SignUp/>}/>
                <Route path='/login' render={()=><Login/>}/>
                <Route path='/logout' render={()=><Logout/>}/>
              </Container>
              <Footer/>
            </div>
          </Router>
        </Provider>
      </div>
    )
  }
}

export default App;