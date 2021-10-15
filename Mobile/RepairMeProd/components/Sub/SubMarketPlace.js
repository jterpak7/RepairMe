import React, {component} from 'react';
import { Dropdown } from 'react-native-material-dropdown';
import { View, FlatList, Text, AsyncStorage} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Globals from '../../constants/Globals'
import axios from 'axios';
import Ticket from '../Tickets/TileTicket'
import Loading from '../LoadingSpin'

class SubMarketPlace extends React.Component {
    state = {
        userID: '',
        assetID: '',
        list: [],
        currentTicket: null,
        ticketImage: null,
        pageNumb: 1,
        limit: 5,
        totalTicks: 0,
        option: '',
        cities:[]
    }

    constructor (props){
        super(props);

    }
    componentWillMount(){
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({userID: value});

            AsyncStorage.getItem("AssetID").then((value) => {
                this.setState({assetID:value});
                //this.getList();
              // this.getCities();
            });

        });
    }
    getList() {
        //console.log('hey');
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/ticket/acceptedTickets/?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}`,
        })
        .then((response) => { 
            this.setState({list: response.data.tickets.docs});
            this.setState({totalTicks: response.data.tickets.total});
           // console.log('ere');
            
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
       
    
    }

    getCities() {
        
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/asset`
        })
        .then((response) => {
            console.log(response.data.assets);
            var temp =[{value: ''}];
            var temp2 = [];
                      
            for(var i = 0; i<response.data.assets.length; i++){
                temp2[i] =  response.data.assets[i].city;   
            }
            
            temp2 =[...new Set(temp2)];
            for (var j = 0; j< temp2.length; j++){
                temp[j] = {value: temp2[j]};
            }
            this.setState({cities: temp}); 
            this.setState({option:cities[0]})
        })
        .catch(function(error){
            if(error.response){
                console.log(error);
            }
        });
    }

    sortTick = (option) => {
        this.setState({pageNumb: 0});
        this.setState({option:option});
        console.log(option);
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/ticket/getTickLocation/${option}`
        })
        .then((response) =>{
            this.setState({list: response.data.tickets});
            //this.setState({totalTicks: response.data.tickets.total});
            //console.log(response);
        })
        .catch(function(error) {
            console.log(error)
            if (error.response) {
                console.log(error);
            }
        });
    }
    /*getInitialList() {
        this.setState({pageNumb: 1, limit: 5}, () => {
            axios({
                method: 'get',
                url: `http://${Globals.WebAPI}/api/ticket/acceptedTickets/?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}`,
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
    }*/
    _renderItem = ({item}) => {
        return ( 
            <Ticket
                key={item._id}
                ticket={item}
                onPress={() => {
                    this.setState({currTicket: item}, () => {
                        this.props.navigation.navigate('SubBid', {ticket: this.state.currTicket});
                    });
                }}
            />
        )
    }
    _listEmpty = () => {
        if(this.state.list.length === 0) {
            return <Text>No tickets to currently bid on ...</Text>
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
                url: `http://${Globals.WebAPI}/api/ticket/TicketLocation/${this.state.option}/?pageNumb=${this.state.pageNumb}&limit=${this.state.limit}`,
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

    _keyExtractor = (item, index) => item._id;

    render() {
        return (

            <View>
                <Dropdown 
                    //onPress = {this.sortTick}
                    
                    onChangeText = {(text =>  this.sortTick(text))}
                    label='cities'
                    data={this.state.cities}

                />
                <NavigationEvents 
                    onDidFocus={payload => {
                        if(payload.action.type === "Navigation/NAVIGATE"){
                            this.getList();
                            this.getCities();
                        }
                    }}
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
        );
    }

}

export default SubMarketPlace