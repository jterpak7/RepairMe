
import React, { Component } from 'react';
import { View, Text, WebView, Image, TextInput, TouchableOpacity } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../../constants/GlobalStyle'

class CompletePaymentSetup extends React.Component {

    constructor(props) {
        super(props)
        this.goToHome = this.goToHome.bind(this);
    }

    goToHome() {
        this.props.navigation.navigate("SubHome")
    }

    render() {
        return (

            < KeyboardAwareScrollView
                style={styles.mainBG}
                enableOnAndroid={true}
                resetScrollToCoords={{ x: 0, y: 50 }}
                contentContainerStyle={styles.scrollView}
                scrollEnabled={true}
            >

                <View
                    style={styles.container}>
                    <Image
                        style={styles.logoStyle}
                        source={require('../../assets/logoWhite.png')} />
                </View>
                <Text
                    style={{
                        ...styles.smallWhiteText,
                        marginBottom: 40,
                        marginTop: -50,
                    }}
                >
                    Thank you for Connecting Your
                {'\n    '}Bank Account. You are now
                {'\n     '}able to Accept and Make
                {'\n '}Payments for Completed Jobs
                {'\n  '}

                </Text>

                <TouchableOpacity
                    style={styles.basicBox}
                    onPress={this.goToHome}
                >
                    <Text style={styles.basicText}>
                        CONTINUE
            </Text>

                </TouchableOpacity>

            </KeyboardAwareScrollView>)

    }
}
export default CompletePaymentSetup

