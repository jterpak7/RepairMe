import React from 'react';
import { TouchableOpacity, Text, Picker, TextInput, Modal, TouchableHighlight, Image, AsyncStorage } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../LoadingSpin'
import styles from '../../constants/GlobalStyle'


class CreateAsset extends React.Component {

    state = {
        list: [],
        assetSelected: '',
        address:'',
        city:'',
        postalCode:'',
    }

    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.getList = this.getList.bind(this);
        this.createAsset=this.createAsset.bind(this);
        this.selectBuilding=this.selectBuilding.bind(this);
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
                this.setState({ list: response.data.assets,assetSelected:response.data.assets[0]._id });

                // console.log(this.state.list)
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error);
                }
            });
    }

    onAddressChange(text) {
        this.setState({ address: text})
    }

    onCityChange(text) {
    this.setState({ city: text})
    }

    onPostalCodeChange(text) {
    this.setState({ postalCode: text})
    }

    createAsset(){
        console.log("CreatingAsset")

        data={
            id:this.props.navigation.getParam('userID','NA'),
            address:this.state.address,
            city:this.state.city,
            postalCode:this.state.postalCode
        }

        console.log(data)

        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/asset/`,
            data: data
        }).then((response)=>{

            data={
                id:this.props.navigation.getParam('userID','NA'),
                assetSelected: response.data.assetID, 
            }

            axios({
                method: 'put',
                url: `http://${Globals.WebAPI}/api/account/asset/connectToAsset`,
                data: data
            }).then((response)=>{
                AsyncStorage.setItem("AssetID", response.data.assetID);
                AsyncStorage.setItem("AuthToken", response.data.token);
                this.props.navigation.navigate("BMHome")
            }).catch(function (error){
                if(error.response){
                    console.log(error.response)
                }
            })

        }).catch(function (error){
            if(error.response){
                console.log(error.response)
            }
        }) 
    }

    selectBuilding(){
        data={
            id:this.props.navigation.getParam('userID','NA'),
            assetSelected:this.state.assetSelected, 
        }

        axios({
            method: 'put',
            url: `http://${Globals.WebAPI}/api/account/asset/connectToAsset`,
            data: data
        }).then((response)=>{
            AsyncStorage.setItem("AssetID", this.state.assetSelected);
            this.props.navigation.navigate("BMHome")

        }).catch(function (error){
            if(error.response){
                console.log(error.response)
            }
        })
    }
    pickerChange(id){
        console.log(id)
        this.setState({assetSelected:id})
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

                <Text
                style={{...styles.basicText,marginBottom:5}}
                >
                    Select the Building You Manage

                </Text>


                <Picker
                    selectedValue={this.state.assetSelected}
                    style={{
                        color: "white",
                        borderColor:"white",
                        width:"66%", 
                        marginBottom:10
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

                <Text
                    style={[styles.smallWhiteText, { marginTop: 10, marginBottom: 20 }]}
                >
                    or
                </Text>

                <Text
                style={{...styles.basicText,marginBottom:15}}
                >
                    Create a New Building
                </Text>


                <TextInput
                    style={[styles.basicBox]}
                    ref={(input) => { this.address = input; }}
                    onChangeText={(text) => this.onAddressChange(text)}
                    value={this.state.address}
                    placeholder="ADDRESS"
                    autoCapitalize="none"
                    returnKeyType={"next"}
                    onSubmitEditing={() => { this.city.focus(); }}
                    blurOnSubmit={false}
                />
                <TextInput
                    style={[styles.basicBox]}
                    ref={(input) => { this.city = input; }}
                    onChangeText={(text) => this.onCityChange(text)}
                    value={this.state.city}
                    placeholder="CITY"
                    autoCapitalize="none"
                    returnKeyType={"next"}
                    onSubmitEditing={() => { this.postalCode.focus(); }}
                    blurOnSubmit={false}
                />
                <TextInput
                    style={[styles.basicBox]}
                    ref={(input) => { this.postalCode = input; }}
                    onChangeText={(text) => this.onPostalCodeChange(text)}
                    value={this.state.postalCode}
                    placeholder="POSTAL / ZIP CODE"
                    onSubmitEditing={this.createAsset}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.buttonContrast}
                    onPress={this.createAsset}
                >
                    <Text style={styles.basicTextContrast}>
                        CREATE BUILDING
                    </Text>

                </TouchableOpacity>


            </KeyboardAwareScrollView>
        );
    }
}

export default CreateAsset