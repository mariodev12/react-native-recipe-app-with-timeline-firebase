import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

import App from './component/App'
import Profile from './component/Profile'
import NewRecipes from './component/NewRecipes'
import Recipes from './component/Recipes'
import * as firebase from 'firebase'
import Login from './component/Login'
import Firebase from './lib/firebase'

export default class dribbleChallenge extends Component {
  constructor(props){
    super(props)
    Firebase.init()
    
    this.state = {
      initialView : null,
      userLoaded: false
    }
    this.getInitialView()
    this.getInitialView = this.getInitialView.bind(this)
  }

  getInitialView(){
    firebase.auth().onAuthStateChanged((user) => {
      let initialView = user ? 'App' : 'Login'

      this.setState({
        userLoaded: true,
        initialView
      })
    })
  }

  configureScene(route){
    if(route.sceneConfig){
      return route.sceneConfig
    } else {
      return ({
        ...Navigator.SceneConfigs.HorizontalSwipeJumpFromRight,
        gestures: {}
      });
    }
  }

  renderScene(route, navigator){
    var globalProps = {navigator}
    switch(route.id){
      case 'Recipes':
        return (
          <Recipes navigator={navigator} />
        )
      case 'New Recipes':
        return (
          <NewRecipes navigator={navigator} />
        )
      case 'Profile':
        return (
          <Profile navigator={navigator}/>
        )
      case 'App': 
        return (
          <App navigator={navigator}/>
        )
      case 'Login':
        return (
          <Login navigator={navigator}/>
        )
    }
  }
  render() {
    if(this.state.userLoaded) {
        return (
          <Navigator 
            initialRoute={{
              id: this.state.initialView
            }}
            renderScene={this.renderScene}
            configureScene={this.configureScene}
          />
      );
    } else {
      return null
    }
  }
}

AppRegistry.registerComponent('dribbleChallenge', () => dribbleChallenge);
