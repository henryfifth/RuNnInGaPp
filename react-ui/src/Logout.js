import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';

var Logout = observer(class Logout extends Component{
  render(){
    console.log('ready to log out')
    this.props.UserStore.logOut();
    this.props.UserStore.redirect('');
    return (
      <div>
        Logging Out . . .
      </div>
    )
  }
});

export default inject('UserStore')(Logout)