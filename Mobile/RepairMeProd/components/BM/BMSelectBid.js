import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import styles from '../../constants/GlobalStyle';

class BMSelectBid extends React.Component {

    state = {
        bid: null,
        sub: null,
        ticket: null,
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const bid = this.props.navigation.getParam('bid', 'none')
        const ticket = this.props.navigation.getParam('ticket', 'none');
        this.setState({ bid: bid, ticket: ticket }, () => {
            this.getSubInfo();
        });
    }

    getSubInfo() {
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/account/${this.state.bid.SubId}`,
        })
            .then((response) => {
                this.setState({ sub: response.data.account });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    _onPress() {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/acceptBid/${this.state.ticket._id}`,
            data: {
                bid: this.state.bid
            }
        })
            .then((response) => {
                this.props.navigation.navigate('BMHome');
            })
            .catch((error) => {
                alert("Something Went Wrong, Please Try Again ...");
                console.log(error);
            })
    }

    render() {
        const sub = this.state.sub;
        if (sub) {
            return (
                <View
                    style={{
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        height: '90%'
                    }}
                >
                    <Text
                        style={[styles.greyText, { paddingTop: 20, paddingBottom: 20 }]}
                    >
                        Bid Details
                    </Text>

                    <Text
                        style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20 }]}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            {"Name: "}
                        </Text>
                        {this.state.sub.firstName + " " + this.state.sub.lastName}

                        {this.state.bid.Fixed === true ? (
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {"\n\nBid Type: "}
                                </Text>

                                <Text>
                                    <Text style={{ fontSize: 18 }}>Fixed Bid {"\n\n"}

                                    </Text>
                                    <Text style={{ fontWeight: 'bold' }}>Quote:</Text> ${this.state.bid.Price + '\n\n'}
                                </Text>
                            </Text>
                        ) : (
                            <Text>

                                <Text style={{ fontWeight: "bold" }}>
                                    {"\n\nBid Type: "}

                                    </Text>
                                    <Text style={{ fontSize: 18 }}>Hourly Bid {"\n\n"}


                                    {"\n\n"}
                                    <Text>
                                        <Text style={{ fontWeight: 'bold' }}>First Hour:</Text> ${this.state.bid.FirstHour + "\n"}
                                        <Text style={{ fontWeight: 'bold' }}>Subsequent Hours:</Text> ${this.state.bid.SubsequentHours + "\n"}
                                        <Text style={{ fontWeight: 'bold' }}>Expected Hours:</Text> {this.state.bid.ExpectedHours + "\n\n"}
                                        <Text style={{ fontWeight: 'bold' }}>Quote:</Text> ${this.state.bid.FirstHour + this.state.bid.SubsequentHours * (this.state.bid.ExpectedHours - 1)} {"\n\n"}
                                    </Text>
                                </Text>
                                </Text>
                            )}

                        {this.state.bid.MaterialsIncludedInPrice === false ? (
                            <Text>Materials are not Included</Text>
                        ) : (
                                <Text>Materials are Included</Text>
                            )}
                    </Text>

                    <TouchableOpacity
                        onPress={() => { this._onPress() }}
                        style={[styles.buttonContrast, { marginBottom: 15 }]}
                    >
                        <Text
                            style={styles.basicTextContrast}>
                            ACCEPT BID
                        </Text>
                    </TouchableOpacity>

                </View>
            )
        }
        else {
            return (<View></View>)
        }
    }
}

export default BMSelectBid