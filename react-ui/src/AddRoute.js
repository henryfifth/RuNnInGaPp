import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, FormGroup, Input, } from 'reactstrap';
import Map from './Map.js';

var AddRoute = observer(class AddRoute extends Component {
  constructor() {
    super();
    this.inputNameChange = this.inputNameChange.bind(this);
  }
  inputNameChange(e) {
    this.props.UserStore.routeToAdd.name = e.target.value;
  }
  render() {
    var store = this.props.UserStore;
    store.adding = true;
    if (store.user.firstName)
      return (
        <div>
          <br></br>
          <br></br>
          <br></br>
          <Button onClick={() => { store.change(0) }} style={{ marginRight: 10 }}>Add or Change Beginning</Button>
          <Button onClick={() => { store.change(1) }} style={{ marginRight: 10 }}>Add Waypoint</Button>
          <Button onClick={() => { store.change(2) }} style={{ marginRight: 10 }}>Add or Change Ending</Button>
          <Button onClick={() => { store.change(3) }} style={{ marginRight: 10 }}>Clear</Button>
          <Button onClick={() => {
            store.change(0);
            store.addRoute();
          }} style={{ marginRight: 10 }}>Add</Button>
          <br></br>
          <br></br>
          <br></br>
          <FormGroup className="signup-input">
            <Input type="name" onChange={this.inputNameChange} value={store.routeToAdd.name} name="name" id="name" placeholder="Route Name" />
          </FormGroup>
          <br></br>
          <Map zoom={15} />
        </div>
      );
    else
      return(
        <div>
          No user logged in
        </div>
      )
  }
})

export default inject('UserStore')(AddRoute)