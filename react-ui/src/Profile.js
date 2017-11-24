import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Col, Button, CardSubtitle, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
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
    this.state = {
      show: false,
      distance: null,
      time: null,
      msg: 'Congrats on going for a run!',
      initialized: false,
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
    that = this;
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
      var addRun = null
    }
    if (this.state.initialized) {
      if (this.props.UserStore.user.firstName) {
        var user = this.props.UserStore.user;
        let stats = user.stats.map((e, i) => {
          if (e.date !== undefined) {
            return (<tr><td>Date: {e.date} Distance: {e.distance} Time: {e.time} Route: {e.route}</td></tr>)
          }
        })
        if (this.props.UserStore.user.stats.length <= 0) {
          stats.push(<tr><td>You have no stats yet. Why don't you go for a run?</td></tr>);
        }
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
    } else {
      return <div>Loading...</div>
    }
  }
});

export default inject('UserStore')(Profile);