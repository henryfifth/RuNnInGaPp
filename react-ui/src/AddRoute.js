import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Button, CardSubtitle, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import Map from './Map.js';
import Routie from './Redirect';

var AddRoute = observer(class AddRoute extends Component {
  render(){
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        <Map zoom={15} height={600}/>
      </div>
    );
  }
})

export default inject('UserStore')(AddRoute)