import React, { Component } from 'react';
import { Col, Button, CardSubtitle, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {inject, observer} from 'mobx-react';

var Login = observer(class Login extends Component {
  constructor() {
    super();
    this.inputemailChange = this.inputemailChange.bind(this);
    this.inputpasswordChange = this.inputpasswordChange.bind(this);
    // this.testFunc = this.testFunc.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    // this.submitLogin = this.submitLogin.bind(this);
    // this.logOut = this.logOut.bind(this);
    this.state = {
      email: '',
      password: '',
      message: ''
    }
  }

  inputemailChange(event) {
    this.props.UserStore.user.email = event.target.value 
  }
  inputpasswordChange(event) {
    this.props.UserStore.user.password = event.target.value
  }
  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.props.UserStore.testFunc(this.props.UserStore.user.email, this.props.UserStore.user.password);
    }
  }
  render() {
    return (
      <div>
        <Col className='signup-col'></Col>
        <Card className='signup-card' style={{ 'marginTop': '30px' }}>
          <CardTitle className='signup-title' style={{'marginTop': '10px'}}>Login</CardTitle>
          <CardSubtitle className='signup-title' style={{ color: 'red' }}>{this.props.UserStore.user.message}</CardSubtitle>
          <CardBody>
            <FormGroup className="login-input">
              <Label for="email">Email</Label>{' '}
              <Input className='login-input' type="email" onChange={this.inputemailChange} name="email" id="email" placeholder="you@something.com" />
            </FormGroup>
            {' '}
            <FormGroup className="login-input">
              <Label for="password">Password</Label>{' '}
              <Input className='login-input' type="password" onChange={this.inputpasswordChange} name="password" id="password" onKeyPress={this._handleKeyPress} />
            </FormGroup>
            {' '}
            <Button className="login-button" onClick={() => this.props.UserStore.testFunc(this.props.UserStore.user.email, this.props.UserStore.user.password)} >Submit</Button>
          </CardBody>
        </Card>
      </div>
    )
  }
});

export default withRouter(inject('UserStore')(Login));