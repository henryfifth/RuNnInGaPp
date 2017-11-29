import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Bananas from './Hello';
import Howdy from './Howdy';
import ButtonBasics from './third';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox,
} from 'react-native-router-flux';

export default class App extends React.Component {
  render() {
    return (
    <Router>
      <Stack key="root">
        {/* <Scene key="login" component={Login} title="Login"/>
        <Scene key="register" component={Register} title="Register"/> */}
        <Scene key='third' component={ButtonBasics} title='buttonz' />
        <Scene key='Howdy' component={Howdy} title='Howdy' />
        <Scene key="Home" component={Bananas}/>
      </Stack>
    </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  red: {
    color: 'green',
  },
});
