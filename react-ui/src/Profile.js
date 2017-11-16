import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

var Profile = observer(class Profile extends Component {
  render() {
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
        </div>
      )
    } else {
      return <div>No User logged in</div>;
    }
  }
});

export default inject('UserStore')(Profile);