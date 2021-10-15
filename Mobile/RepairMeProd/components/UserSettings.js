import React, { Component } from 'react';
import { View, Text, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Globals from '../constants/Globals'
import axios from 'axios';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../constants/GlobalStyle'
import SnackBar from 'react-native-snackbar-component'

class UserSettingsScreen extends React.Component {
  state = {
        username: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        assetID: '',
        hasCameraPermission: null,
        showScanner: true,
        userAccount: '',
        success: false,
        showSnack: false,
        helpText: 'Fill out the form below to create an account',
        firstNameBorderColor: 'white',
        lastNameBorderColor: 'white',
        emailBorderColor: 'white',
        phoneNumberBorderColor: 'white',
        usernameBorderColor: 'white',
        passwordBorderColor: 'white'
  }

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem("UserAccount").then((value) => {
        this.setState({userAccount: value});
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/account/${value}`,
        })
        .then((response) => { 
            this.setState({username: response.data.account.username, 
                           firstname: response.data.account.firstName,
                           lastname: response.data.account.lastName,
                           email: response.data.account.email,
                           phonenumber: response.data.account.phoneNumber})
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
    });
  }

  onFirstNameChange(text) {
    this.setState({ firstname: text, firstNameBorderColor: 'white', success: false })
  }

  onLastNameChange(text) {
    this.setState({ lastname: text, lastNameBorderColor: 'white', success: false })
  }

  onEmailChange(text) {
    this.setState({ email: text, emailBorderColor: 'white', success: false })
  }

  onPhoneNumberChange(text) {
    this.setState({ phonenumber: text, phoneNumberBorderColor: 'white', success: false })
  }

  update() {
    AsyncStorage.getItem("UserAccount").then((value) => { 
        data = {
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            email: this.state.email,
            phoneNumber: this.state.phonenumber
        }
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/account/${this.state.userAccount}`,
            data: data
        })
        .then((response) => {
            this.setState({success: true})
            this.setState({showSnack: true});    
            setTimeout(() => { 
                if(this.state.showSnack) {
                    this.setState({showSnack: false}) 
                }
            }, 3000);
        })
        .catch((error) => {
            console.log(error);
        })
    })

  }

  render() {
    var successMessage;
    if(this.state.success) {
        successMessage = <Text style={styles.successMessage}>Information updated successfully</Text>
    }
    else {
        successMessage = null;
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
          style={[styles.basicBox, { borderColor: this.state.firstNameBorderColor }]}
          onChangeText={(text) => this.onFirstNameChange(text)}
          value={this.state.firstname}
          placeholder="FIRST NAME"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.lastNameTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={[styles.basicBox, { borderColor: this.state.lastNameBorderColor }]}
          ref={(input) => { this.lastNameTextInput = input; }}
          onChangeText={(text) => this.onLastNameChange(text)}
          value={this.state.lastname}
          placeholder="SURNAME"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.emailTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={[styles.basicBox, { borderColor: this.state.emailBorderColor }]}
          ref={(input) => { this.emailTextInput = input; }}
          onChangeText={(text) => this.onEmailChange(text)}
          value={this.state.email}
          placeholder="EMAIL"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.phoneNumberTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={[styles.basicBox, { borderColor: this.state.phoneNumberBorderColor }]}
          ref={(input) => { this.phoneNumberTextInput = input; }}
          onChangeText={(text) => this.onPhoneNumberChange(text)}
          value={this.state.phonenumber}
          placeholder="PHONE"
          autoCapitalize="none"
          textContentType="telephoneNumber"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.usernameTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={styles.buttonContrast}
          onPress={this.update}
        >
          <Text style={styles.basicTextContrast}>
            UPDATE INFO
          </Text>
        
        </TouchableOpacity>
        {successMessage}
        <SnackBar visible={this.state.showSnack} actionHandler={()=>{ this.setState({showSnack: false})}} actionText="dismiss" textMessage="Information Successfully Updated"/>
      </KeyboardAwareScrollView>
    );
  }
}

export default UserSettingsScreen
