import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { COLOR, ThemeProvider } from 'react-native-material-ui';

export default class Home extends Component {
  static navigationOptions = {
    title: "Home",
    tabBarLabel: 'Home',
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
        <View style={styles.buttonContainer}>
          <Button
            onPress={()=>{navigate('SignUp')}}
            title="SignUp"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={()=>{navigate('Login')}}
            title="Login"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={()=>{navigate('Profile')}}
            title="Profile"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  }
})