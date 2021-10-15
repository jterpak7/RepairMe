import React from 'react';
import { View, Text, Button, TextInput, AsyncStorage, StyleSheet, Modal, TouchableOpacity, FlatList, TouchableHighlight, Image, Picker } from 'react-native';
import Globals from '../../constants/Globals'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import styles from '../../constants/GlobalStyle'

class BMReviewTicket extends React.Component {

    state= {
        userID: null,
        currTicket: null,
    }

    constructor(props){
        super(props)
    }

    componentWillMount() {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({ userID: value });
        })
        this.setState({ currTicket: ticket });
    }

    _completeTicket = () => {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/completeTicket/${this.state.currTicket._id}`,
        })
        .then((response) => {
            this.props.navigation.navigate('BMHome');
        })
        .catch((error) => {
            if(error){
                console.log(error);
            }
        }).done();
    }

    _renderItem = ({item}) => {
        return(
            <View>
                <Text
                    style={[styles.greyText, { textAlign: "left", marginBottom: 20 }]}
                >
                    {item.title} | Quantity: {item.quantity} | Price: ${item.quantity * item.price}
                </Text>
            </View>
        )
    }

    render() {
        let total;
        if(!this.state.currTicket.Bids[0].Hourly && this.state.currTicket.Bids[0].MaterialsIncludedInPrice){
            total = <Text>${this.state.currTicket.Bids[0].Price}</Text>
        }
        else if(!this.state.currTicket.Bids[0].Hourly && !this.state.currTicket.Bids[0].MaterialsIncludedInPrice){
            let matCost = 0;
            this.state.currTicket.materials.forEach(element => {
                matCost = matCost + element.quantity * element.price;
            })
            total = <Text>${Number(this.state.currTicket.Bids[0].Price) + matCost}</Text>
        }
        else if(this.state.currTicket.Bids[0].Hourly && this.state.currTicket.Bids[0].MaterialsIncludedInPrice){
            total = <Text>${this.state.currTicket.Bids[0].FirstHour + this.state.currTicket.Bids[0].SubsequentHours * (this.state.currTicket.Bids[0].ExpectedHours - 1)}</Text>
        }
        else{
            let matCost = 0;
            this.state.currTicket.materials.forEach(element => {
                matCost = matCost + element.quantity * element.price;
            })
            total = <Text>${(this.state.currTicket.Bids[0].FirstHour + this.state.currTicket.Bids[0].SubsequentHours * (this.state.currTicket.Bids[0].ExpectedHours - 1)) + matCost}</Text>
        }
        return (
            <View
                style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 60,
                    height: '60%'
                }}
            >
                {this.state.currTicket.Bids[0].Hourly !== true ? (
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Price: ${this.state.currTicket.Bids[0].Price}</Text>
                    </View>
                ): (
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>First Hour: ${this.state.currTicket.Bids[0].FirstHour}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Subsequent Hours: ${this.state.currTicket.Bids[0].SubsequentHours}</Text>
                    </View>
                )}
                <View>
                    {this.state.currTicket.Bids.MaterialsIncludedInPrice === true ? ( null ) : (
                        <View>
                            <FlatList
                                data={this.state.currTicket.materials}
                                renderItem={this._renderItem}
                            />
                        </View>
                    )}
                </View>
                <Text>
                    {total}
                </Text>
                <TouchableOpacity
                    onPress={() => {this._completeTicket()}}
                    style={[styles.buttonContrast, { marginBottom: 15 }]}
                >
                    <Text
                        style={styles.basicTextContrast}
                    >
                        COMPLETE TICKET
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default BMReviewTicket