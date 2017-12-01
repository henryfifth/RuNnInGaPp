import React, { Component } from 'react';
//Make sure you get Button from react-native not react-native-material-ui
import { AppRegistry, Image, View, Button } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';
import { StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
const axios = require('axios');

export default class Login extends Component {
  static navigationOptions = {
    title: "Profile",
    tabBarLabel: 'Profile',
    headerStyle: {
      backgroundColor: COLOR.teal800,
    },
    headerTintColor: '#fff',

    tabBarIcon: ({ tintColor }) => (
      <Image
        source='https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwj04pfH7-fXAhVHy2MKHZ7vAsoQjRwIBw&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FNicolas_Cage&psig=AOvVaw2q04clVE3k1Xgql1vVPlEc&ust=1512185350451020'
        style={[tabstyle.icon, { tintColor: tintColor }]}
      />
    )
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

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
  inputText:{
    height: 50,   
    borderColor: COLOR.brown100,
    borderWidth: 1,
    backgroundColor: 'white',
    margin: 8,
    padding: 8,
    fontSize: 20,
  },
  buttonContainer: {
    margin: 20
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
});
