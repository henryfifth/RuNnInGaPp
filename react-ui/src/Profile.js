import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Button, CardSubtitle, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import Map from './Map.js';
import Routie from './Redirect'
var axios = require('axios');
var that;

var Profile = observer(class Profile extends Component {
  constructor() {
    super();
    this.change = this.change.bind(this);
    this.addRun = this.addRun.bind(this);
    this.distanceChange = this.distanceChange.bind(this);
    this.timeChange = this.timeChange.bind(this);
    this.runFunc = this.runFunc.bind(this);
    this.goToAdd = this.goToAdd.bind(this);
    this.state = {
      show: false,
      distance: null,
      time: null,
      msg: 'Congrats on going for a run!',
      initialized: false,
      shouldRedirect: false,
      bool: true,
    }
  }
  addRun() {
    if (this.state.show) {
      return (
        <div>
          <p>Hello</p>
        </div>
      )
    } else {
      return null;
    }
  }
  change() {
    this.setState({
      show: !this.state.show
    })
    that = this;
  }
  distanceChange(event) {
    this.setState({
      distance: event.target.value
    })
    that = this;
  }
  timeChange(event) {
    this.setState({
      time: event.target.value
    });
    that = this;
  }
  runFunc() {
    if (this.state.distance !== null && this.state.time !== null) {
      axios.post('/addRun', { user: this.props.UserStore.user, distance: this.state.distance, time: this.state.time }).then((res) => {
        this.props.UserStore.user.stats.push(res.data)
      })
    } else {
      this.setState({
        msg: 'You need to input a valid distance and time before submitting.'
      })
    }
  }
  goToAdd(){
    this.setState({
      shouldRedirect: true,
    })
  }
  _handleKeyPress(e) {
    if (e.key === "Enter") {
      that.runFunc();
    }
  }

  componentDidMount() {
    if (this.props.UserStore.user.firstName === undefined) {
      setTimeout(() => {
        this.setState({
          initialized: true
        });
      }, 1000)
    } else {
      this.setState({
        initialized: true
      });
    }
  }

  render() {
    this.props.UserStore.adding = false;
    if(this.state.shouldRedirect){
      var shouldRedirect = <Routie url='/addRoute' />;
    }else{
      shouldRedirect = null;
    }
    if (this.state.show) {
      var addRun = (
        <div>
          <Col className='signup-col'></Col>
          <Card className='signup-card' style={{ 'marginTop': '30px' }}>
            <CardTitle className='signup-title' style={{ 'marginTop': '10px' }}>Run</CardTitle>
            <CardSubtitle className='signup-title' >{this.state.msg}</CardSubtitle>
            <CardBody>
              <FormGroup className="login-input">
                <Label>Distance</Label>{' '}
                <Input onChange={this.distanceChange} onKeyPress={this._handleKeyPress} className='login-input' type="email" placeholder="1 Mile, 1k, 2k, 5k, etc." />
              </FormGroup>{' '}
              <FormGroup className="login-input">
                <Label for="password">Time</Label>{' '}
                <Input className='login-input' placeholder='HH:MM:SS.MS' onChange={this.timeChange} onKeyPress={this._handleKeyPress} />
              </FormGroup>{' '}
              <Button className="login-button" onClick={this.runFunc}>Submit</Button>
            </CardBody>
          </Card>
        </div>
      );
    } else {
      addRun = null
    }
    if (this.state.initialized) {
      if (this.props.UserStore.user.firstName) {
        var user = this.props.UserStore.user;
        let stats = user.stats.map((e, i) => {
          if (e.date !== undefined) {
            return (<tr key={i}><td>Date: {e.date} Distance: {e.distance} Time: {e.time} Route: {e.route}</td></tr>)
          }else{
            return null;
          }
        })
        if (this.props.UserStore.user.stats.length <= 0) {
          stats.push(<tr key='0'><td>You have no stats yet. Why don't you go for a run?</td></tr>);
        }
        return (
          <div>
            <p>Hello, {this.props.UserStore.user.firstName}</p>
            <p>You have {user.routes.created.length} routes created, {user.routes.ran.length} routes ran, and {user.routes.saved.length} routes saved</p>
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
            <Button onClick={this.change} style={{marginRight: 5}}>Add a run</Button>
            <Button onClick={this.goToAdd}>Add a route</Button>
            {shouldRedirect}
            {addRun}
            <br></br>
            <br></br>
            <Map zoom={15} height={400}/>
          </div>
        )
      } else {
        return <div>No User logged in</div>;
      }
    } else {
      return <div>Loading...</div>
    }
  }
});

export default inject('UserStore')(Profile);