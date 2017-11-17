import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Col, Button, CardSubtitle, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';

var Profile = observer(class Profile extends Component {
  constructor(){
    super();
    this.change = this.change.bind(this);
    this.addRun = this.addRun.bind(this);
    this.state ={
      show: false
    }
  }
  addRun(){
    if(this.state.show){
      return (
        <div>
          <p>Hello</p>
        </div>
      )
    }else{
      return null;
    }
  }
  change(){
    this.setState({
      show: true
    })
  }
  render() {
    if(this.state.show){
    var addRun = (
      <div>
        <Col className='signup-col'></Col>
        <Card className='signup-card' style={{ 'marginTop': '30px' }}>
          <CardTitle className='signup-title' style={{'marginTop': '10px'}}>Run</CardTitle>
          <CardSubtitle className='signup-title' >Congrats</CardSubtitle>
          <CardBody>
            <FormGroup className="login-input">
              <Label for="email">Distance</Label>{' '}
              <Input className='login-input' type="email" placeholder="1 Mile, 1k, 2k, 5k, etc." />
            </FormGroup>
            {' '}
            <FormGroup className="login-input">
              <Label for="password">Time</Label>{' '}
              <Input className='login-input' placeholder='1:10:15.59'/>
            </FormGroup>
            {' '}
            <Button className="login-button" onClick={this.login} >Submit</Button>
          </CardBody>
        </Card>
      </div>
    );
    }else{
      var addRun = null
    }
    if (this.props.UserStore.user.firstName) {
      var user = this.props.UserStore.user;
      let stats = user.stats.map((e, i) => {
        if (e.msg !== undefined) {
          return <li>{e.msg}</li>
        } else {
          return <tr><td>You have no {e.name} time yet. Why don't you go for a run?</td></tr>
        }
      }) 
      return (
        <div>
          <p>Hello, {this.props.UserStore.user.firstName}</p>
          <p>You have {user.routes[0].created.length} routes created, {user.routes[1].ran.length} routes ran, and {user.routes[2].saved.length} routes saved</p>
          <table border='1'>
            <tbody>
              <tr>
                <th>
                  Stats
                </th>
              </tr>
              {stats}
            </tbody>
          </table>
          <br></br>
          <Button onClick={this.change}>Add a run</Button>
          {addRun}
        </div>
      )
    } else {
      return <div>No User logged in</div>;
    }
  }
});

export default inject('UserStore')(Profile);