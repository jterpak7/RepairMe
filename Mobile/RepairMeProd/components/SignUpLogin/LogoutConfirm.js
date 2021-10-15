import React, { Component } from 'react';
import { View, Text, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import { createStackNavigator, withNavigation  } from 'react-navigation';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../../constants/GlobalStyle'
import authenticatedAxios from '../../tools/AuthenticatedAxios'

class LogoutConfirmScreen extends React.Component {

  state = {

  }

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  logout() {
    AsyncStorage.getItem("AuthToken").then((value) => { 
        authenticatedAxios({
            method: 'delete',
            url: `http://${Globals.WebAPI}/api/authentication/login/${value}`,
        })
        .then((response) => {  
           console.log(response.data)
            let keys = ['AuthToken', 'AssetID', 'UserAccount', 'BM'];
            AsyncStorage.multiRemove(keys, (err) => {
              this.props.navigation.navigate('Login');
            });
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
    })

  }

  cancel() {
    this.props.navigation.goBack();
  }

  //hide the nav bar
  static navigationOptions = { header: null }

  render() {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={styles.mainBG}
        resetScrollToCoords={{ x: 0, y: 50 }}
        contentContainerStyle={styles.scrollView}
        scrollEnabled={true}
      >

        <View
        style={styles.container}>
          <Image
          style={styles.logoStyle}
          source={require('../../assets/logoWhite.png')}/>
        </View>    
        <Text style={styles.biggerText}>
            Are you sure you want to logout?
        </Text>    
        <TouchableOpacity
          style={styles.buttonContrast}
          onPress={this.logout}
        >
          <Text style={styles.basicTextContrast}>
            LOGOUT
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.basicBox}
          onPress={this.cancel}
        >
          <Text style={styles.basicText}>
            CANCEL
          </Text>

        </TouchableOpacity>

        
      </KeyboardAwareScrollView>

    );
  }
}

export default withNavigation(LogoutConfirmScreen)
