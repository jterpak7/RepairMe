import React, { Component } from 'react';
import { View, Text, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../../constants/GlobalStyle'

class LoginScreen extends React.Component {

  state = {
    username: '',
    password: '',
    showUserOrPass: false
  }

  constructor(props) {
    super(props);
    // Replace instance method with a new 'bound' version
    this.login = this.login.bind(this);
    this.goToSignup = this.goToSignup.bind(this);
    console.log(Globals.WebAPI)
  }

  goToSignup() {
    this.props.navigation.navigate('UserSelect');
  }

  login() {
    axios({
      method: 'post',
      url: `http://${Globals.WebAPI}/api/authentication/login`,
      data: {

        username: this.state.username.toLowerCase(),
        password: this.state.password,
        //Sped up for testing

        // username: 'c',
        // password: 'c'
      }
    })
      .then((response) => {
        AsyncStorage.setItem("AuthToken", response.data.token);
        AsyncStorage.setItem("UserAccount", response.data.userID);
        console.log(response.data)
        this.setState({username: '', password: ''})
        if(response.data.isBM){
          AsyncStorage.setItem("BM", "true");
          AsyncStorage.setItem("AssetID", response.data.assetID);
          this.props.navigation.navigate('BMHome');
        } else if(response.data.isTenant){
          AsyncStorage.setItem("BM", "false");
          AsyncStorage.setItem("AssetID", response.data.assetID);
          this.props.navigation.navigate('TenantHome');
        } else if(response.data.isSubcontractor){
          AsyncStorage.setItem("BM", "false");
          this.props.navigation.navigate('SubHome');
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          this.setState({showUserOrPass: true, password: ''});
        }
      });
  }

  //hide the nav bar
  static navigationOptions = { header: null }

  render() {
    var message;
    if(this.state.showUserOrPass) {
      message = <Text style={styles.errorMessage}>Incorrect Username or Password</Text>
    }
    else {
      message = null
    }
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
        {message}
        <TextInput
          style={styles.basicBox}
          onChangeText={(text) => this.setState({ username: text, showUserOrPass: false })}
          value={this.state.username}
          returnKeyType={"next"}
          onSubmitEditing={() => { this.passwordTextInput.focus(); }}
          placeholder="USERNAME"
        />
        <TextInput
          style={styles.basicBox}
          ref={(input) => { this.passwordTextInput = input; }}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text, showUserOrPass: false })}
          returnKeyType={"next"}
          onSubmitEditing={this.login}
          value={this.state.password}
          placeholder="PASSWORD"
        />
        
        <TouchableOpacity
          style={styles.buttonContrast}
          onPress={this.login}
        >
          <Text style={styles.basicTextContrast}>
            LOGIN
          </Text>

        </TouchableOpacity>

        <Text
          style={[styles.smallWhiteText,{marginTop:-5,marginBottom: 15}]}
        >
          or
        </Text>


        <TouchableOpacity
          style={styles.basicBox}
          onPress={this.goToSignup}
        >
          <Text style={styles.basicText}>
            REQUEST ACCESS / SIGN-UP
          </Text>

        </TouchableOpacity>

        
      </KeyboardAwareScrollView>

    );
  }
}

export default LoginScreen
