import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from 'react-navigation';
import styles from '../constants/GlobalStyle'
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Globals from '../constants/Globals'
import { AsyncStorage } from 'react-native';
import axios from 'axios';

class BurgerButton extends React.Component {
  state = {
    new:false,
    count:0
};

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation
    this.interval = setInterval(() => { this.checkForNewMessages() }, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  checkForNewMessages(){
      if (this.state.count == 0 ){
        this.setState({count:1})
        return;
      }
      AsyncStorage.getItem("BM").then((value) => {
        if(value === 'true'){
            AsyncStorage.getItem("AssetID").then((value2) => {
              this.sendGet(value2)
            })
        }
        else{
            AsyncStorage.getItem("UserAccount").then((value2) => {
              this.sendGet(value2)
            })
        }
    })
  }
  sendGet(myID){
      axios({
        method: 'get',
        url: `http://${Globals.WebAPI}/api/chat/chatHomePreview/`+myID
      })
      .then((response) => {
          if(response.data.newMessages>0){
              this.setState({new:true})
          }else{
            this.setState({new:false})
          }
      })
      .catch(function (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
          }
      });
  }
  
  render() {
    if (!this.state.new){
      return (
          <TouchableOpacity style={{paddingRight:20}}>
              <Icon name="menu" type="material" size={25} color={styles.white.color} onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()) }} />
          </TouchableOpacity>
      );
    }else {
      return (
        <TouchableOpacity style={{paddingRight:20}}>
            <Icon name="chat" type="material" size={25} color={styles.accentPink.color} onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()) }} />
        </TouchableOpacity>
      );
    }
  }
}

export default withNavigation(BurgerButton);