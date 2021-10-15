import React from 'react';
import { TouchableOpacity, Text, Picker, View, Modal, TouchableHighlight, Image, AsyncStorage } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../LoadingSpin'
import styles from '../../constants/GlobalStyle'


class ConnectToAssetTenant extends React.Component {

    state = {
        list: [],
        assetSelected: '',
    }

    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.getList = this.getList.bind(this);
        this.selectBuilding = this.selectBuilding.bind(this);
    }

    componentWillMount() {
        this.getList();
    }

    getList() {
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/asset`,
        })
            .then((response) => {
                this.setState({ list: response.data.assets, assetSelected: response.data.assets[0]._id });

                // console.log(this.state.list)
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error);
                }
            });
    }

    selectBuilding() {

        data = {
            id: this.props.navigation.getParam('userID', 'NA'),
            assetSelected: this.state.assetSelected,
        }

        console.log(data)

        axios({
            method: 'put',
            url: `http://${Globals.WebAPI}/api/account/asset/connectToAsset`,
            data: data
        }).then((response) => {
            AsyncStorage.setItem("AssetID", this.state.assetSelected);
            AsyncStorage.setItem("AuthToken", response.data.token);
            this.props.navigation.navigate("TenantHome")
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response)
            }
        })

    }
    pickerChange(id) {
        console.log(id)
        this.setState({ assetSelected: id })
        console.log(this.state.assetSelected)
    }

    render() {
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                style={styles.mainBG}
                resetScrollToCoords={{ x: 0, y: 0 }}
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
                    style={{ ...styles.basicText, marginBottom: 5 }}
                >
                    Select the Building You Live In

                </Text>


                <Picker
                    selectedValue={this.state.assetSelected}
                    style={{
                        color: "white",
                        borderColor: "white",
                        width: "66%",
                        marginBottom: 10
                    }}

                    onValueChange={(itemValue) => this.pickerChange(itemValue)}>{
                        this.state.list.map((v) => {
                            return <Picker.Item label={v.city + ", " + v.address} key={v._id} value={v._id} />
                        })
                    }
                </Picker>

                <TouchableOpacity
                    style={styles.buttonContrast}
                    onPress={this.selectBuilding}
                >
                    <Text style={styles.basicTextContrast}>
                        SELECT BUILDING
                    </Text>

                </TouchableOpacity>
            </KeyboardAwareScrollView>
        );
    }
}

export default ConnectToAssetTenant