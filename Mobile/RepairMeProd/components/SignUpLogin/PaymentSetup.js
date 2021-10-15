import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../../constants/GlobalStyle'

class PaymentSetup extends React.Component {

    constructor(props) {
        super(props)
        this.connectStripe = this.connectStripe.bind(this);
    }

    connectStripe() {
        this.props.navigation.navigate("StripeView")
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
                    Connect your Bank Account to{'\n  '}Send and Receive Payments
                </Text>

                <TouchableOpacity
                    style={styles.basicBox}
                    onPress={this.connectStripe}
                >
                    <Text style={styles.basicText}>
                        CONNECT WITH STRIPE
                    </Text>

                </TouchableOpacity>

            </KeyboardAwareScrollView>
        )
    }
}

export default PaymentSetup