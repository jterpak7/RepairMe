import React from 'react';
import { View, TextInput, Text, Button, TouchableOpacity, AsyncStorage, StyleSheet, Modal, TouchableHighlight, Image, Picker } from 'react-native';
import Globals from '../../constants/Globals'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createStackNavigator } from 'react-navigation';
import moment from 'moment';
import axios from 'axios';
import styles from '../../constants/GlobalStyle'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';



class SubBidOnTick extends React.Component{
    state = {
        currTicket: null,
        ticketImage: null,
        modalVisible: false,
        assetID: '',
        contractors: null,
        selectedCont: null,
        userID: null,
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({ userID: value });
        })
        AsyncStorage.getItem("AssetID").then((value) => {
            this.setState({ assetID: value });
        });
        this.setState({ currTicket: ticket });
        
    }
    render() {
                const img = this.state.currTicket.image;
        
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
                                source={{ uri: `data:image/gif;base64,${img}`  }}
                                style={{ minWidth: "100%", minHeight: 350 }}
                            />
                        </View>
        
                        <Text
                            style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20 }]}
                        >
                            <Text style={{ fontWeight: "bold" }}>
                                {"Details: "}
                            </Text>
                            {this.state.currTicket.description}
        
                            <Text style={{ fontWeight: "bold" }}>
                                {"\n\nOpened: "}
        
                            </Text>
                            {moment(this.state.currTicket.timeOpened).format('MM/DD/YYYY')}
        
        
                            <Text style={{ fontWeight: "bold" }}>
                                {"\n\nStatus: "}
        
                            </Text>
                            {this.state.currTicket.ticketState}
                        </Text>
        
        
        
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress = {() =>{
                                this.props.navigation.navigate('PlaceFixBid', {ticket: this.state.currTicket});
                            }}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                FIXED COST BID
                        </Text>
                        </TouchableOpacity>
        
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15, borderColor: styles.accentPink.color }]}
                            onPress = {() =>{
                                this.props.navigation.navigate('PlaceHourlyBid', {ticket: this.state.currTicket});
                            }}
                        >
                            <Text
                                style={[styles.basicTextContrast, { color: styles.accentPink.color }]}
                            >
                                HOURLY BID
                        </Text>
                        </TouchableOpacity>

                    </KeyboardAwareScrollView>
        
                );
            }
}
export default SubBidOnTick;