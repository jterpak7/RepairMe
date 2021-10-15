import React from 'react';
import { View, Text, TextInput, TouchableOpacity, AsyncStorage, StyleSheet, Modal, TouchableHighlight, Image, Picker } from 'react-native';
import Globals from '../../constants/Globals'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import styles from '../../constants/GlobalStyle'

var labels = [{ label: "Yes     ", value: 0 }, { label: "No ", value: 1 }]

class PlaceHourlyBid extends React.Component {


    state = {
        userID: '',
        assetID: '',
        currTicket: null,
        modalVisible: false,
        bidPrice: '',
        firstHourPrice: 0,
        subsequentHours: 0,
        pageNumb: 1,
        limit: 5,
        MatIncl: 0,
        totalTicks: 0,
        expectedHours: 1,
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
    submit = () => {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/bidOnticket/${this.state.currTicket._id}`,
            data: {
                userID: this.state.userID,
                bidPrice: this.state.bidPrice,
                fixedPrice: false,
                hourlyPrice: true,
                firstHourPrice: this.state.firstHourPrice,
                subsequentHours: this.state.subsequentHours,
                materialsIncl: this.state.MatIncl,
                ExpectedHours: this.state.expectedHours,
            }
        }).then((response) => {
            alert("Bid Placed!");
            this.props.navigation.navigate("SubHome");


        }).catch((error) => {
            if (error) {
                alert("Something Went Wrong, Try Again.")
                console.log(error);
            }
        }).done();
        // this.setState({modalVisable: true});
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
                        source={{ uri: `data:image/gif;base64,${img}` }}
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
                        {"\n\nRates: "}

                    </Text>
                </Text>


                <TextInput
                    keyboardType="numeric"
                    style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                    placeholder="ENTER FIRST HOUR RATE"
                    onChangeText={(text) => this.setState({ firstHourPrice: text })}
                    multiline={true}
                    numberOfLines={1}
                />

                <TextInput
                    keyboardType="numeric"
                    style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                    placeholder="SUBSEQUENT HOURLY RATE"
                    onChangeText={(text) => this.setState({ subsequentHours: text })}
                    multiline={true}
                    numberOfLines={1}
                />

                <TextInput
                    keyboardType="numeric"
                    style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                    placeholder="PROJECTED WORKING HOURS"
                    onChangeText={(text) => this.setState({ expectedHours: text })}
                    multiline={true}
                    numberOfLines={1}
                />

                <Text
                    style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20 }]}
                >
                    <Text style={{ fontWeight: "bold" }}>
                        {"Are Material Costs Included?: "}
                    </Text>
                </Text>
                <RadioForm
                    radio_props={labels}
                    onPress={(value) => { this.setState({ MatIncl: value }) }}
                    initial={0}
                    formHorizontal={true}
                    buttonColor={styles.mainBlue.color}
                    buttonInnerColor={styles.mainBlue.color}
                    selectedButtonColor={styles.mainBlue.color}
                    labelColor={styles.mainGrey.color}
                    style={{ paddingBottom: 20 }}
                />
                <TouchableOpacity
                    style={[styles.buttonContrast, { marginBottom: 15 }]}
                    onPress={this.submit}
                >
                    <Text
                        style={styles.basicTextContrast}>
                        SUBMIT BID
                        </Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>

        );
    }
}

export default PlaceHourlyBid;