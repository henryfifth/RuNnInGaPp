import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

var Logout = observer(class Logout extends Component{
  constructor(){
    super();
    this.redirect = this.redirect.bind(this);
  }
  redirect(url){
    this.props.history.push(url);
  }
  render(){
    console.log(this.props)
    this.props.UserStore.logOut();
    this.redirect('/login');
    return (
      <div>
        Logging Out . . .
      </div>
    )
  }
});

export default withRouter(inject('UserStore')(Logout));