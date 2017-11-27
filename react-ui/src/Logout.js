import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Routie from './Redirect';


var Logout = observer(class Logout extends Component{
  render(){
    this.props.UserStore.logOut();
    return (
      <div>
        Logging Out . . .
        <Routie url='/#/login'/>
      </div>
    )
  }
});

export default inject('UserStore')(Logout);