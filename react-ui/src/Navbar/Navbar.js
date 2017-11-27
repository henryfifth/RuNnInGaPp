import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

var Navbar = observer(class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 'home'
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    let entryLinks = [];

    if (this.props.UserStore.user.firstName) {
      entryLinks.push(<Link className='item' key='linkLogout' to='/logout'>Logout</Link>);
      entryLinks.push(<Link className='item' key='linkProfile' to='/profile'>Profile</Link>)
    } else {
      entryLinks.push(<Link className="item" key='linkLogin' to="/login">Login</Link>);
      entryLinks.push(<Link className="item" key='linkSignup' to="/signup">Signup</Link>);
    }

    return (
      <div>
        <Menu inverted pointing secondary size='large'>
          <Link className="item" to="/"> Running App
          </Link>
          <Link className="item" to="/#/about">About</Link>
          <Menu.Menu position='right'>
            {/* show user dashboard & logout */}
            {entryLinks}
            {/* if not logged in show these: */}
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
});

export default inject("UserStore")(Navbar);