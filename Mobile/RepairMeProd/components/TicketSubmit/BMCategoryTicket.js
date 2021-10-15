import React from 'react';
import { View, Text, Button, AsyncStorage, Image, TouchableOpacity, TextInput, Picker, Modal } from 'react-native';
import axios from 'axios';
import Globals from '../../constants/Globals';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../constants/GlobalStyle'
import Loading from '../LoadingSpin';


class BMCategoryTicket extends React.Component {

    state={
        selectedCat:""
    }

    submitTicket() {

        data = this.props.navigation.getParam('data','NA')
        this.setState({ loading: true, modalVisible: false }, () => {
            axios({
                method: 'post',
                url: `http://${Globals.WebAPI}/api/ticket/saveticketBM`,
                data: {
                    image: data.imageBase64,
                    description: data.description,
                    user: data.userID,
                    asset: data.assetID,
                    acceptorID: data.userID,
                    category: this.state.selectedCat
                }
            })
                .then((response) => {
                    this.props.navigation.navigate('BMHome');
                })
                .catch(function (error) {
                    alert('Something Went Wrong, Try Again.')
                })

        })
    }

    _renderCategoriesList = () => {
        return (this.state.categories.map((x, i) => {
            return (
                <Picker.Item
                    label={`${x.name}`}
                    key={x._id}
                    value={x._id}
                />
            )
        }))
    }

    getCategories() {
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/categories/`,
        })
            .then((response) => {
                this.setState({ categories: response.data.categories });
                this.setState({ selectedCat: response.data.categories[0]._id });
            })
            .catch(function (error) {
                if (error) {
                    console.log(error);
                }
            }).done();
    }

    
    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.submitTicket = this.submitTicket.bind(this);
    }

    componentWillMount() {
        const base64 = this.props.navigation.getParam('base64', 'none');
        this.setState({ imageBase64: base64 });

        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({ userID: value });
        });
        AsyncStorage.getItem("AssetID").then((value) => {
            this.setState({ assetID: value });
            this.getCategories();
        });
    }




    render() {
        const paramData = this.props.navigation.getParam('data','NA')
        
        return(
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.centerContainer}
                scrollEnabled={true}
            >
                <View
                    style={styles.imagePreview}
                >
                    <Image
                        style={{ minWidth: "100%", minHeight: 350 }}
                        source={{ uri: `data:image/gif;base64,${paramData.imageBase64}` }}
                    />

                </View>

                    <Text
                    style={styles.greyText}
                    >
                    SELECT THE DESIRED CATEGORY
                    
                    </Text>
                    <Picker
                        style={[styles.mainGrey, {flex:1,width:200,}]}
                        selectedValue={this.state.selectedCat}
                        onValueChange={(value) => (this.setState({ selectedCat: value }))}
                    >
                        {this.state.categories && this._renderCategoriesList()}
                    </Picker>

                {this.state.loading ? (
                    <Loading />
                ) : (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={ this.submitTicket}
                            >
                            <Text
                                style={styles.basicTextContrast}>
                                SUBMIT
                    </Text>
                        </TouchableOpacity>
                    )}
            </KeyboardAwareScrollView>
        );
    
    }
}
export default BMCategoryTicket