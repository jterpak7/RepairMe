import React from 'react';
import { View, Text, AsyncStorage, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Divider } from 'react-native-elements'
import Globals from '../../constants/Globals'
import { createStackNavigator } from 'react-navigation';
import axios from 'axios';
import styles from '../../constants/GlobalStyle';

class BMViewBids extends React.Component {

    state = {
        currTicket: null,
        bids: [],
        SelectedBid: null
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        this.setState({ currTicket: ticket });
        this.setState({ bids: ticket.Bids })
    }

    _onPress = (item) => {
        this.props.navigation.navigate('BMSelectBid', { bid: item, ticket: this.state.currTicket })
    }

    _renderItem = ({ item }) => {
        if (item.Fixed) {
            return (
                <TouchableOpacity
                    onPress={() => { this._onPress(item) }}
                    style={{
                        marginBottom: 10,
                        marginTop: 10
                    }}
                >
                    <Text 
                        style={[styles.basicTextContrast, { textAlign: "left" }]}
                    
                    >
                    ${item.Price} - Fixed Cost Bid 
                    
                    </Text>
                    <Divider style={{ backgroundColor: '#476e80' }} />

                    <Text
                    style={[styles.greyText, {fontSize:12}]}
                    
                    >
                        {item.MaterialsIncludedInPrice === false ? (
                                <Text>Materials are NOT Included</Text>
                        ) : (
                                <Text>Materials are Included</Text>
                            )}

                    </Text>

                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity
                    onPress={() => { this._onPress(item) }}
                    style={{
                        marginBottom: 10,
                        marginTop: 10
                    }}
                >
                    <Text 
                        style={[styles.basicTextContrast, { textAlign: "left" }]}
                    >
                        ${item.FirstHour+item.SubsequentHours*(item.ExpectedHours-1)} - Hourly Bid
                    </Text>
                    <Divider style={{ backgroundColor: '#476e80' }} />
                    <Text
                        style={[styles.greyText, {fontSize:12}]}
                    >
                        <Text style={{ fontWeight: 'bold' }}>First Hour:</Text> ${item.FirstHour}
                        <Text style={{ fontWeight: 'bold' }}>{"\n"}Subsequent Hours:</Text> ${item.SubsequentHours}
                    {"\n"}
                    {item.MaterialsIncludedInPrice === false ? (
                        <Text>Materials are not Included</Text>
                    ) : (
                        <Text>Materials are Included</Text>
                        )}
                    </Text>
                </TouchableOpacity>
            )
        }
    }

    _listEmpty = () => {
        return (
            <View>
                <Text
                    style={styles.basicText}
                >
                    There are no active bids currently
                </Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => item._id;

    render() {
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
                    style={[styles.greyText, { paddingTop: 20, paddingBottom:20 }]}
                >
                    Select from the Bids below:
                </Text>
                <FlatList
                    data={this.state.bids}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._listEmpty}
                    extraData={this.state}
                />
            </View>
        )
    }
}

export default BMViewBids