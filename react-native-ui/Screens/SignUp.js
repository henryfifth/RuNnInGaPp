import React, { Component } from 'react';
//Make sure you get Button from react-native not react-native-material-ui
import { AppRegistry, Image, View, Button } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';
import { StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
const axios = require('axios');

export default class Signup extends Component {
  constructor() {
    super();
    this.updateFirst = this.updateFirst.bind(this);
    this.updateLast = this.updateLast.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.state = {
      first: '',
      last: '',
      email: '',
      password: '',
    }
  }
  static navigationOptions = {
    title: "SignUp",
    tabBarLabel: 'SignUp',
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
  updateFirst(input){
    this.setState({ first: input });
  }
  updateLast(input){
    this.setState({ last: input });
  }
  updateEmail(input){
    this.setState({ email: input });
  }
  updatePassword(input){
    this.setState({ password: input });
  }
  submit(){
    axios.post('http://192.168.0.23:5000/signup', {
      firstName: this.state.first,
      lastName: this.state.last,
      email: this.state.email,
      password: this.state.password,
    }).then((res)=>{
      console.log(res.data);
    })
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text></Text>
        <Text></Text>
        <TextInput style={styles.inputText}
          onChangeText={this.updateFirst}
          placeholder='First Name'
          value={this.state.first}
          autoCapitalize='sentences'
          returnKeyType='next'          
        />
        <TextInput style={styles.inputText}
          onChangeText={this.updateLast}
          placeholder='Last Name'
          autoCapitalize='sentences'
          value={this.state.last}
          returnKeyType='next'
        />
        <TextInput style={styles.inputText}
          onChangeText={this.updateEmail}
          placeholder='Email'
          value={this.state.email}
          returnKeyType='next'          
          keyboardType='email-address'
        />
        <TextInput style={styles.inputText} 
          onChangeText={this.updatePassword} 
          placeholder='Password' 
          value={this.state.password}
          secureTextEntry={true}
          returnKeyType='next'
        />
        <View style={styles.buttonContainer}>
          <Button 
            onPress={()=>{this.submit()}} 
            title="Submit"
          />
        </View>
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
