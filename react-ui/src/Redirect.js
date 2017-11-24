import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Routie extends Component {
  constructor(){
    super();
    this.redirect = this.redirect.bind(this);
  }
  redirect(url){
    this.props.history.push(url);
  }
  render(){
    this.redirect(this.props.url);
    return null
  }
}

export default withRouter(Routie)