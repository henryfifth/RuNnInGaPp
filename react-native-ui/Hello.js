import React, { Component } from 'react';
import { AppRegistry, Image, View } from 'react-native';
import { COLOR, ThemeProvider, Button } from 'react-native-material-ui';
import { StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 5,
    height: 40,
    backgroundColor: '#7567B1',
    justifyContent: 'center'
  },
});

export default class Bananas extends Component {
  constructor() {
    super();
    this.route = this.route.bind(this);
  }
  route() {
    navigate('Howdy');
  }
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <div>
        <Image source={pic} style={{ width: 193, height: 110 }} />
        {/* <Button raised primary theme='Button' title='Login' text="Login" onPress={this.route} /> */}
      </div>
    );
  }
}

