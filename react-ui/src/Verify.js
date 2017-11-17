import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
const axios = require('axios')

class Verify extends Component {
  constructor() {
    super();
    this.slice = this.slice.bind(this);
    this.redirect = this.redirect.bind(this);
    this.state = {
      bool: false
    }
  }
  slice(url) {
    let bob = url.split('/');
    bob.forEach((e, i) => {
      if (e === 'users' && bob[i + 2]) {
        axios.post('/verify', { id: bob[i + 2] }).then((res) => {
          if (res.data.verified) {
            this.setState({bool: true})
          }
        });
      }
    });
  }
  redirect() {
    this.props.history.push('/login');
  }
  componentDidMount() {
    this.slice(window.location.href)
    setTimeout(() => {
      if (this.state.bool) {
        this.redirect();
        return null;
      }
    }, 2000);

  }
  render() {
    return null;
  }
}

export default withRouter(Verify);