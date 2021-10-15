import React, { Component } from 'react';
import { View, Text, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Globals from '../constants/Globals'
import axios from 'axios';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../constants/GlobalStyle'
//import default from '@expo/vector-icons/Foundation';

class UpdateInfo extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        userID: '',
        firstNameBorderColor: 'white',
        lastNameBorderColor: 'white',
        emailBorderColor: 'white',
        phoneNumberBorderColor: 'white',
        helpText: 'Enter the changes you wish to make, then submit'
    }
    constructor(props){
        super(props);
        this.submitChanges = this.submitChanges.bind(this); 
        
    }
    componentWillMount(){
        
        AsyncStorage.getItem("UserAccount").then((value) => {
            axios({
                method: 'get',
                url: `http://${Globals.WebAPI}/api/account/` + value
            }).then((response) => {
                this.setState({firstName: response.data.account.firstName});
                this.setState({lastName: response.data.account.lastName});
                this.setState({userID: response.data.account._id});
                this.setState({email: response.data.account.email});
                this.setState({phoneNumber: response.data.account.phoneNumber});
                
            })
        }).done();
    }
    submitChanges(){
        var validInput = true;
        //Regex expressions to confirm that the format of the email and phonenumber is valid
        var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
        if (!this.state.firstName) {
            console.log('bad firstname: ' + this.state.firstName)
            validInput = false;
            this.setState({
              firstNameBorderColor: 'red',
              helpText: 'Your name must only contain letters'
            })
        }
        if (!this.state.lastName) {
            console.log('bad lastname: ' + this.state.lastName)
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
        if (!validPhoneNumber.test(this.state.phoneNumber)) {
            console.log('bad phonenumber: ' + this.state.phoneNumber)
            validInput = false;
            this.setState({
              phoneNumberBorderColor: 'red',
              helpText: 'Your phone number must only contain numbers (eg. 14165551111)'
            })
        }
        if (validInput){
        axios({
                method: 'post',
                url: `http://${Globals.WebAPI}/api/account/` + this.state.userID,
                data: {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    phoneNumber: this.state.phoneNumber
                }
            }).then((response) => {
                console.log(response);
                //console.log(value);
            }).catch(function(error){
                console.log(error);
            });
        }
        
    }
    onFirstNameChange(text) {
        this.setState({ firstName: text, firstNameBorderColor: 'white' })
    }
    
    onLastNameChange(text) {
        this.setState({ lastName: text, lastNameBorderColor: 'white' })
    }
    
    onEmailChange(text) {
        this.setState({ email: text, emailBorderColor: 'white' })
    }
    onPhoneNumberChange(text) {
        this.setState({ phoneNumber: text, phoneNumberBorderColor: 'white' })
    }
//sss
    render(){
       
       return(
        
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            style={styles.mainBG}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.scrollView}
            scrollEnabled={true}>
        <Text style={styles.smallTextHelp}>
           {this.state.helpText}
        </Text>
            
            <TextInput
                style={[styles.basicBox, { borderColor: this.state.firstNameBorderColor }]}
                onChangeText={(text) => this.onFirstNameChange(text)}
                value={this.state.firstName}
                placeholder = {this.state.firstName}
                returnKeyType={"next"}
                onSubmitEditing={() => { this.lastNameTextInput.focus(); }}
                blurOnSubmit={false}
            />
            <TextInput
                style={[styles.basicBox, { borderColor: this.state.firstNameBorderColor }]}
                ref={(input) => { this.lastNameTextInput = input; }}
                onChangeText={(text) => this.onLastNameChange(text)}
                value={this.state.lastName}
                placeholder = {this.state.lastName}
                returnKeyType={"next"}
                onSubmitEditing={() => { this.emailTextInput.focus(); }}
                blurOnSubmit={false}
            />
            <TextInput
                style={[styles.basicBox, { borderColor: this.state.emailBorderColor }]}
                ref={(input) => { this.emailTextInput = input; }}
                onChangeText={(text) => this.onEmailChange(text)}
                value={this.state.email}
                placeholder={this.state.email}
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
                value={this.state.phoneNumber}
                placeholder={this.state.phoneNumber}
                autoCapitalize="none"
                textContentType="telephoneNumber"
                returnKeyType={"next"}
                //onSubmitEditing={() => { this.usernameTextInput.focus(); }}
                blurOnSubmit={false}
            />            

            <TouchableOpacity
                style={styles.buttonContrast}
                onPress={this.submitChanges}
            >
                <Text style={styles.basicTextContrast}>
                    SUBMIT
                </Text>

            </TouchableOpacity>


        </KeyboardAwareScrollView>
       );

    }

}

export default UpdateInfo