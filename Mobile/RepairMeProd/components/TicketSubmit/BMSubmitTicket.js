import React from 'react';
import { View, Text, Button, AsyncStorage, Image, TouchableOpacity, TextInput, Picker, Modal } from 'react-native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Globals from '../../constants/Globals';
import Loading from '../LoadingSpin';
import LoadingSpin from '../LoadingSpin'

class BMSubmitTicket extends React.Component {

    state = {
        description: '',
        imageBase64: '',
        userID: '',
        assetID: '',
        loading: false,
        categories: null,
        selectedCat: null,
        modalVisible: false
    }

    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.pressSubmit = this.pressSubmit.bind(this);
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

    pressSubmit(){
        this.props.navigation.navigate('BMCategoryTicket', {data: this.state})

    }
    render() {
        return (
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
                        source={{ uri: `data:image/gif;base64,${this.state.imageBase64}` }}
                    />

                </View>

                <TextInput
                    style={[styles.buttonContrast, { height: 100, borderColor: styles.mainGrey.color }]}
                    placeholder="ENTER A BRIEF DESCRIPTION. Example: Leaking Faucet in Room 203 Kitchen)"
                    onChangeText={(text) => this.setState({ description: text })}
                    multiline={true}
                    numberOfLines={4}
                />
                {this.state.loading ? (
                    <Loading />
                ) : (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={ this.pressSubmit}
                            >
                            <Text
                                style={styles.basicTextContrast}>
                                NEXT
                    </Text>
                        </TouchableOpacity>
                    )}
            </KeyboardAwareScrollView>

        );
    }
}


export default BMSubmitTicket