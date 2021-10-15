import React from 'react';
import { View, FlatList, Text, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import DismissKeyboard from 'dismissKeyboard';
import { SearchBar } from 'react-native-elements';
import Globals from '../../constants/Globals';
import axios from 'axios';
import Ticket from '../Tickets/SimpleTicket'
import styles from '../../constants/GlobalStyle'
import Loading from '../Loading'

class BMClosedTickets extends React.Component {

    state = {
        userID: '',
        assetID: '',
        list: [],
        currTicket: null,
        ticketImage: null,
        contractors: null,
        pageNumb: 1,
        limit: 5,
        totalTicks: 0,
        search: '',
    }
  
    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.getList = this.getList.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
    }

    componentWillMount () {
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({userID: value});

            AsyncStorage.getItem("AssetID").then((value) => {
                this.setState({assetID: value});
                this.getList();
            });
        });
    }
  
    getList() {
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/ticket/BMClosedTicket/${this.state.assetID}?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}`,
        })
        .then((response) => { 
            this.setState({list: response.data.tickets.docs});
            this.setState({totalTicks: response.data.tickets.total})
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
    }

    getInitialList() {
        this.setState({pageNumb: 1, limit: 5}, () => {
            axios({
                method: 'get',
                url: `http://${Globals.WebAPI}/api/ticket/BMClosedTicket/${this.state.assetID}?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}`,
            })
            .then((response) => { 
                this.setState({list: response.data.tickets.docs});
                this.setState({totalTicks: response.data.tickets.total})
            })
            .catch(function(error) {
                if (error.response) {
                    console.log(error);
                }
            });
        })
    }

    _renderItem = ({item}) => {
        return ( 
            <Ticket
                key={item._id}
                ticket={item}
                onPress={() => {
                    this.setState({currTicket: item}, () => {
                        this.props.navigation.navigate('BMTicket', {ticket: this.state.currTicket});
                    });
                }}
            />
        )
    }

    _listEmpty = () => {
        if(this.state.list.length === 0) {
            return <Text>No Tickets Currently...</Text>
        }
        else{
            return <Loading/>
        }
    }

    _onEndReached = () => {
        if(this.state.totalTicks < (this.state.pageNumb * this.state.limit)){
            return;
        }
        this.setState({pageNumb: this.state.pageNumb + 1}, () => {
            axios({
                method: 'get',
                url: `http://${Globals.WebAPI}/api/ticket/BMClosedTicket/${this.state.assetID}?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}`,
            })
            .then((response) => { 
                newTickets = response.data.tickets.docs;
                newList = [...this.state.list, ...newTickets]
                this.setState({list: newList});
            })
            .catch(function(error) {
                if (error.response) {
                console.log(error);
                }
            });
        });
    }

    query = () => {
        this.setState({pageNumb: 1, limit: 5}, () => {
            axios({
                method: 'get',
                url: `http://${Globals.WebAPI}/api/ticket/BMClosedTicket/search/${this.state.assetID}?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}&query=${this.state.search}`,
            })
            .then((response) => {
                this.setState({list: response.data.tickets.docs});
                this.setState({totalTicks: response.data.tickets.total})
            })
            .catch(function(error) {
                if (error.response) {
                    console.log(error);
                }
            });
        })
    }

    _keyExtractor = (item, index) => item._id;

    updateSearch = search => {
        this.setState({ search }, () => {
            this.query();
        });
    };

    _onClear = () => {
        this.setState({search: ''}, () => {
            this.getInitialList();
        })
    }

    render() {
        const { search } = this.state;
        return (
            <TouchableWithoutFeedback onPress={() => {DismissKeyboard}} accessible={false}>
                <View>
                    <NavigationEvents 
                        onDidFocus={payload => {
                            if(payload.action.type === "Navigation/NAVIGATE" || payload.action.type === "Navigation/COMPLETE_TRANSITION"){
                                this.getInitialList();
                            }
                        }}
                    />
                    <SearchBar
                        placeholder="Search Completed Tickets..."
                        onChangeText={this.updateSearch}
                        value={search}
                        lightTheme={true}
                        onClear={this._onClear}
                    />
                    <FlatList
                        data={this.state.list}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ListEmptyComponent={this._listEmpty}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={0}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
  }
  
  
  export default BMClosedTickets