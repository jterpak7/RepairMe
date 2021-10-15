import React from 'react';
import { View, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Globals from '../../constants/Globals'
import axios from 'axios';
import styles from '../../constants/GlobalStyle'

class SubOpenTicketDetails extends React.Component {

    state = {
        currTicket: null,
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
        this.setState({ currTicket: ticket });
    }

    _startTicket = () => {
        console.log(this.state.currTicket._id)
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/subcontractor/startTicket/${this.state.currTicket._id}`,
        })
            .then((response) => {
                alert("Job Started")
                this.setState({ currTicket: response.data.ticket });
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error);
                }
            });
    }

    _onComplete = () => {
        this.props.navigation.navigate('SubCompleteTicket', { ticket: this.state.currTicket });
    }


    render() {
        var price = ""
        var pricePreview = ""
        const img = this.state.currTicket.image;
        const state = this.state.currTicket.ticketState;
        var showButton
        if (this.state.currTicket.timeStarted == null) {
            showButton = <TouchableOpacity
                style={styles.buttonContrast}
                onPress={this._startTicket}
            >
                <Text style={styles.basicTextContrast}>
                    START TICKET
                                </Text>
            </TouchableOpacity>
        }
        else {
            if (this.state.currTicket.timeStarted == null) {
                showButton =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ this._onComplete }
                                >
                                    <Text style={styles.basicTextContrast}>
                                        FINISH WORK
                                    </Text>                                    
                                </TouchableOpacity>
            }else{
                var bid = this.state.currTicket.Bids[0]
                console.log(bid)
                pricePreview=   <Text style={{ fontWeight: "bold" }}>
                                    {"\n\nCurrent Price: "}
                                </Text>
                var labour = 0
                if (bid.fixed) {
                    labour = parseFloat(bid.price)
                } else {
                    if (this.state.currTicket.labour <= 0) {
                        labour = 0
                    } else if (this.state.currTicket.labour <= 1) {
                        labour = parseFloat(bid.FirstHour)*parseFloat(this.state.currTicket.labour)
                    } else {
                        labour = parseFloat(bid.FirstHour)+ parseFloat(bid.SubsequentHours)*(parseFloat(this.state.currTicket.labour)-1)
                    }
                }
                var mats = 0
                if (!bid.MaterialsIncludedInPrice){
                    for (var i = 0; i < this.state.currTicket.materials.length; i++) {
                        mats += parseFloat(this.state.currTicket.materials[i].price) * parseFloat(this.state.currTicket.materials[i].quantity)
                    }
                }
                price = "$" + (labour+mats).toString()

                showButton =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ this._onComplete }
                                >
                                    <Text style={styles.basicTextContrast}>
                                        UPDATE WORK
                                    </Text>                                    
                                </TouchableOpacity>
            }

        }
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
                        {"\n\nDate Secured: "}

                    </Text>
                    {moment(this.state.currTicket.timeSubbed).format('MM/DD/YYYY')}


                    <Text style={{ fontWeight: "bold" }}>
                        {"\n\nStatus: "}

                    </Text>
                    {this.state.currTicket.ticketState}

                    {pricePreview}
                    {price}
                </Text>

                {showButton}

                <TouchableOpacity
                    style={styles.buttonContrast}
                    onPress={() => { this.props.navigation.navigate('CreateChat', { ticket: this.state.currTicket }); }}
                >
                    <Text style={styles.basicTextContrast}>
                        OPEN CHAT
                </Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        );
    }
}

export default SubOpenTicketDetails