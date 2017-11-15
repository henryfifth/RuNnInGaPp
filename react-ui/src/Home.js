import React, { Component } from 'react';
import {inject, observer} from 'mobx-react';

var Home = observer(class Home extends Component {
  render(){
    return(
      <div>
        {this.props.UserStore.user.firstName}
      </div>
    )
  }
});

export default inject('UserStore')(Home);