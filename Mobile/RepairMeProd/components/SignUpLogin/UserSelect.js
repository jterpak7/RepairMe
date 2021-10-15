import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../../constants/GlobalStyle'


class UserSelect extends React.Component {
    navigationOptions = { header: null }

    state = {
        userType:''
    }

    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.goToSignup = this.goToSignup.bind(this);
    }
    goToSignup(_userType) {
        this.props.navigation.navigate('SignUp',{userType:_userType})
    }

    //hide the nav bar
    // static navigationOptions = { header: null }

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
                        source={require('../../assets/logoWhite.png')} />
                </View>
                <Text
                    style={{
                        ...styles.smallWhiteText,
                        marginBottom:40,
                        marginTop:-50,
                    }}
                >
                    Select which type of user you are
                </Text>

                <TouchableOpacity
                    style={styles.basicBox}
                    onPress={()=>this.goToSignup("tenant")}
                >
                    <Text style={styles.basicText}>
                        TENANT / RESIDENT
                </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.basicBox}
                    onPress={()=>this.goToSignup("BM")}
                >
                    <Text style={styles.basicText}>
                        BUILDING MANAGER
                </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.basicBox}
                    onPress={()=>this.goToSignup("subcontractor")}
                >
                    <Text style={styles.basicText}>
                        CONTRACTOR
                </Text>

                </TouchableOpacity>

            </KeyboardAwareScrollView>
        );
    }
}
export default UserSelect