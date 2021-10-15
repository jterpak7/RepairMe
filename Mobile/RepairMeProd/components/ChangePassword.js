import React, { Component } from 'react';
import { Text, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import Globals from '../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../constants/GlobalStyle'
import SnackBar from 'react-native-snackbar-component'

class ChangePasswordScreen extends React.Component {

  state = {
      password: '',
      newPassword: '',
      newConfirmPassword: '',
      success: false,
      helpText: '',
      showSnack: false
  }

  constructor(props) {
      super(props);
      this.changePassword = this.changePassword.bind(this);
  }

  onPasswordChange(text) {
    this.setState({ password: text, lastNameBorderColor: 'white', success: false })
  }

  onNewPasswordChange(text) {
    this.setState({ newPassword: text, emailBorderColor: 'white', success: false })
  }

  onNewConfirmChangePassword(text) {
    this.setState({ newConfirmPassword: text, phoneNumberBorderColor: 'white', success: false })
  }

  changePassword() {
    if(this.state.newConfirmPassword != this.state.newConfirmPassword) {
        this.setState({hintText: 'Passwords do not match'})
        return;
    }
    AsyncStorage.getItem("UserAccount").then((value) => {
      data = {
          password: this.state.password,
          newPassword: this.state.newPassword,
          id: value
      }
      axios({
          method: 'put',
          url: `http://${Globals.WebAPI}/api/account/changepassword`,
          data: data
      })
      .then((response) => {
        this.setState({showSnack: true});    
        setTimeout(() => { 
            if(this.state.showSnack) {
                this.setState({showSnack: false}) 
            }
        }, 3000);
      })
      .catch((error) => {
          
      })
    })
  }

  render() {
    var successMessage; 
    if(this.state.success) {
        successMessage = <Text style={styles.successMessage}> Password Successfully Changes </Text> 
    }
    else {
        successMessage = null
    }
    return (
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={styles.mainBG}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.scrollView}
        scrollEnabled={true}
        >
        <Text
          style={styles.smallTextHelp}
        >
          {this.state.helpText}
        </Text>

        <TextInput
          style={styles.basicBox}
          onChangeText={(text) => this.onPasswordChange(text)}
          value={this.state.password}
          secureTextEntry={true}
          placeholder="PASSWORD"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.newPassword.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.basicBox}
          ref={(input) => { this.newPassword = input; }}
          onChangeText={(text) => this.onNewPasswordChange(text)}
          value={this.state.newPassword}
          secureTextEntry={true}
          placeholder="NEW PASSWORD"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.newConfirmPassword.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.basicBox}
          ref={(input) => { this.newConfirmPassword = input; }}
          onChangeText={(text) => this.onNewConfirmChangePassword(text)}
          value={this.state.newConfirmPassword}
          secureTextEntry={true}
          placeholder="NEW CONFIRM PASSWORD"
          autoCapitalize="none"
          returnKeyType={"next"}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={styles.buttonContrast}
          onPress={this.changePassword}
        >
          <Text style={styles.basicTextContrast}>
            UPDATE PASSWORD
          </Text>
        
        </TouchableOpacity>
        {successMessage}
        <SnackBar visible={this.state.showSnack} actionHandler={()=>{ this.setState({showSnack: false})}} actionText="dismiss" textMessage="Password Successfully Updated"/>
      </KeyboardAwareScrollView>
    );
  }
}

export default ChangePasswordScreen
