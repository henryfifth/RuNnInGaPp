import react, {Component} from 'react';
import observable from 'mobx';

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: {
        message: '',
      },
      routes: [],
      get retrieveUser() {
        return this.user
      }
    });
  }

  login(){
    const { navigate } = this.props.navigation;    
    axios.post('http://192.168.0.23:5000/login', {
      username: this.state.email,
      password: this.state.password,
    }).then((res)=>{
      if(res.data.success)
        navigate('Profile')
      else 
        return <Text>Email and password don't match</Text>
    })
  }
}