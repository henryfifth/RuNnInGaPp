import {
  StackNavigator,
} from 'react-navigation';
import React, {Component} from 'react';
import Home from './Screens/Home';
import SignUp from './Screens/SignUp';
import Login from './Screens/Login';
import Profile from './Screens/Profile';
import {Provider} from 'mobx-react/native';
import UserStore from './Stores/userStore';

const Pages = StackNavigator({
  Home: { screen: Home },
  SignUp: {screen: SignUp},
  Login: {screen: Login},
  Profile: {screen: Profile},
});


export default class App extends Component{
  render(){
    return (
      <Provider UserStore={new UserStore()}>
        <Pages/>
      </Provider>
    )
  }
}