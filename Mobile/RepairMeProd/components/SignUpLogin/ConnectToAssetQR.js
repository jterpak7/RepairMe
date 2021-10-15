import React from 'react';
import { Text, View, TouchableOpacity, Button, Image, StyleSheet, TextInput } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo'
import axios from 'axios';
import Globals from '../../constants/Globals'
import styles from '../../constants/GlobalStyle'

class ConnectToAssetScreen extends React.Component {
    state = {
        hasCameraPermission: null,
        showScanner: false,
        code: ''
    }

    constructor() {
        super();
        this.useCode = this.useCode.bind(this);
        this.useQR = this.useQR.bind(this);
        this.codeConfirmed = this.codeConfirmed.bind(this);
    }

    handleBarCodeScanned = ({ type, data }) => {
        console.log(data);
        axios({
            method: 'get',
            url: `${Globals.WebAPI}/api/asset/confirm?id=${data}`,
        })
            .then((response) => {
                console.log("Asset found");
                //the ID comes from the data object
                this.props.navigation.navigate('SignUp', { assetID: data });
            })
            .catch(function (error) {
                console.log("Asset not found");
            });
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    useCode() {
        this.setState({ showScanner: false });
    }

    useQR() {
        this.setState({ showScanner: true });
    }

    codeConfirmed() {
        console.log(this.state.code);
        axios({
            method: 'get',
            url: `${Globals.WebAPI}/api/asset/confirm?id=${this.state.code}`,
        })
            .then((response) => {
                console.log("Asset found");
                //the ID comes from the supplied text
                this.props.navigation.navigate('SignUp', { assetID: this.state.code });
            })
            .catch(function (error) {
                console.log("Asset not found");
            });
    }

    render() {
        const { hasCameraPermission } = this.state;
        var showScanner;
        if (hasCameraPermission === null) {
            return <Text>Requesting Permission to use the Device Camera</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>Please allow us to use your Camera in your App Settings</Text>;
        }

        if (this.state.showScanner) {
            showScanner =
            <View
            style={{
                ...styles.mainBG,
                alignItems: 'center',
                justifyContent: 'center',
                height: "100%"
            }}
        >
            <View
            style={styles.container}>
                <Image
                style={styles.logoStyle}
                source={require('../../assets/logoWhite.png')}/>
            </View>
            <TextInput
                    style={[styles.basicBox,]}
                    placeholder="ENTER YOUR CODE"
                    onChangeText={(text) => this.setState({ code: text })}
                    value={this.state.username}
                />
            <TouchableOpacity
                    style={[styles.basicBox, { marginBottom: 15 }]}
                    onPress={this.useCode}
            >
                <Text
                    style={styles.basicText}>
                    USE QR CODE INSTEAD
                </Text>
            </TouchableOpacity>

            
            <TouchableOpacity
                    style={[styles.buttonContrast, { marginBottom: 15 }]}
                    onPress={this.codeConfirmed}
            >
                <Text
                    style={styles.basicTextContrast}>
                    CONFIRM
                </Text>
            </TouchableOpacity>


        </View>

                    
        }
        else {
            showScanner = (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <BarCodeScanner
                        onBarCodeScanned={this.handleBarCodeScanned}
                        style={{ minWidth: "100%", height: "100%" }}
                    />
                    <TouchableOpacity
                        style={[styles.buttonContrast, { position: 'absolute', bottom: 20, textAlign: "center", backgroundColor: "transparent" }]}
                        onPress={this.useQR}
                    >
                        <Text
                            style={styles.basicTextContrast}>
                            USE CODE INSTEAD
                        </Text>
                    </TouchableOpacity>


                </View>
            )
        }
        return (
            <View>
                {showScanner}
            </View>
        );
    }
}

export default ConnectToAssetScreen;

