import React from 'react';
import { Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import Globals from '../../constants/Globals';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../../constants/GlobalStyle'

class SignUpScreen extends React.Component {
  userType = this.props.navigation.getParam('userType', 'Unknown')
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
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);

  }

  componentWillMount() {
    this.setState({ assetID: this.props.navigation.getParam('assetID', 'none') });
  }

  login() {
    //not working
    this.LoginScreen.login
  }

  signup() {

    var validInput = true;
    //Regex expressions to confirm that the format of the email and phonenumber is valid
    var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/

    // //for speed
    // this.state.firstname = "Austino3"
    // this.state.lastname = "Baggii2"
    // this.state.email = "austinb2a@uwo.co"
    // this.state.phonenumber = "5194004040"
    // this.state.username = "BM4"
    // this.state.password = "password1"
    // this.state.confirmPassword = "password1"

    if (this.state.assetID == 'none') {
      //Problem loading assetID. Have to rollback to the past screen
    }


    if (!this.state.firstname) {
      console.log('bad firstname: ' + this.state.firstname)
      validInput = false;
      this.setState({
        firstNameBorderColor: 'red',
        helpText: 'Your name must only contain letters'
      })
    }

    if (!this.state.lastname) {
      console.log('bad lastname: ' + this.state.lastname)
      validInput = false;
      this.setState({
        lastNameBorderColor: 'red',
        helpText: 'Your lastname must only contain letters'
      })
    }

    if (!emailFormat.test(this.state.email)) {
      console.log('bad email: ' + this.state.email)
      validInput = false;
      this.setState({
        emailBorderColor: 'red',
        helpText: 'Your email should follow the format name@url.com'
      })
    }

    if (!validPhoneNumber.test(this.state.phonenumber)) {
      console.log('bad phonenumber: ' + this.state.phonenumber)
      validInput = false;
      this.setState({
        phoneNumberBorderColor: 'red',
        helpText: 'Your phone number must only contain numbers (eg. 14165551111)'
      })
    }

    if (!this.state.username) {
      console.log('bad username: ' + this.state.username)
      validInput = false;
      this.setState({
        usernameBorderColor: 'red',
        helpText: 'Your username must be 6 characters long'
      })
    }

    if (!this.state.password) {
      console.log('bad password: ' + this.state.password)
      validInput = false;
      this.setState({
        passwordBorderColor: 'red',
        helpText: 'Your password must be 8-12 characters long'
      })
    } else if (this.state.password.length < 6) {
      console.log('bad password length: ' + this.state.password)
      validInput = false;
      this.setState({
        passwordBorderColor: 'red',
        helpText: 'Your password is too short; It must be 6-12 characters long'
      })
    } else if (this.state.password != this.state.confirmPassword) {
      console.log('passwords dont match: ' + this.state.password + ' ' + this.state.confirmPassword)
      validInput = false;
      this.setState({
        passwordBorderColor: 'red',
        helpText: "Your passwords don't match"
      })
    }

    if (validInput) {
      data = {
        username: this.state.username.toLowerCase(),
        password: this.state.password,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        email: this.state.email,
        phoneNumber: this.state.phonenumber,
        //assetID: this.state.assetID
      }

      if (this.userType == "tenant") {
        data = {
          ...data,
          isTenant: true
        }
      }
      else if (this.userType == "BM") {
        data = {
          ...data,
          isBM: true
        }
      }
      else {
        data = {
          ...data,
          isSubcontractor: true
        }
      }
      
      axios({
        method: 'post',
        url: `http://${Globals.WebAPI}/api/account/`,
        data: data
      })
        .then((response) => {
          if (data.isTenant == true) {
            this.props.navigation.navigate("ConnectToAssetTenant", { userID: response.data.accountID })
          } else if (data.isBM) {
            this.props.navigation.navigate("CreateAsset", { userID: response.data.accountID })
          } else {
            this.props.navigation.navigate("PaymentSetup", { userID: response.data.accountID })
          }
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
          }
        });

    }
  }

  onFirstNameChange(text) {
    this.setState({ firstname: text, firstNameBorderColor: 'white' })
  }

  onLastNameChange(text) {
    this.setState({ lastname: text, lastNameBorderColor: 'white' })
  }

  onEmailChange(text) {
    this.setState({ email: text, emailBorderColor: 'white' })
  }

  onPhoneNumberChange(text) {
    this.setState({ phonenumber: text, phoneNumberBorderColor: 'white' })
  }

  onUsernameChange(text) {
    this.setState({ username: text, usernameBorderColor: 'white' })
  }

  onPasswordChange(text) {
    this.setState({ password: text, passwordBorderColor: 'white' })
  }

  onConfirmPasswordChange(text) {
    this.setState({ confirmPassword: text, passwordBorderColor: 'white' })
  }

  //hide the nav bar
  // static navigationOptions = { header: null }

  render() {

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
          keyboardType="email-address"
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
          keyboardType="numeric"
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
        <TextInput
          style={[styles.basicBox, { borderColor: this.state.usernameBorderColor }]}
          ref={(input) => { this.usernameTextInput = input; }}
          onChangeText={(text) => this.onUsernameChange(text)}
          value={this.state.username}
          placeholder="USERNAME"
          autoCapitalize="none"
          returnKeyType={"next"}
          onSubmitEditing={() => { this.passwordTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={[styles.basicBox, { borderColor: this.state.passwordBorderColor }]}
          ref={(input) => { this.passwordTextInput = input; }}
          onChangeText={(text) => this.onPasswordChange(text)}
          value={this.state.password}
          placeholder="PASSWORD"
          autoCapitalize="none"
          secureTextEntry={true}
          returnKeyType={"next"}
          onSubmitEditing={() => { this.confirmPasswordTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={[styles.basicBox, { borderColor: this.state.passwordBorderColor }]}
          ref={(input) => { this.confirmPasswordTextInput = input; }}
          onChangeText={(text) => this.onConfirmPasswordChange(text)}
          value={this.state.confirmPassword}
          secureTextEntry={true}
          placeholder="CONFIRM PASSWORD"
          onSubmitEditing={this.signup}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.buttonContrast}
          onPress={this.signup}
        >
          <Text style={styles.basicTextContrast}>
            SIGNUP
          </Text>

        </TouchableOpacity>


      </KeyboardAwareScrollView>
    );
  }
}

export default SignUpScreen