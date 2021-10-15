import React from 'react';
import { View, FlatList, Text, Button, TextInput, AsyncStorage, TouchableWithoutFeedback, Keyboard, Modal, TouchableHighlight, Image } from 'react-native';
import { createStackNavigator, NavigationEvents } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import Globals from '../../constants/Globals'
import axios from 'axios';
import Chat from './SimpleChatTile'
import LoadingSpin from '../LoadingSpin'
import styles from '../../constants/GlobalStyle'

class ChatHome extends React.Component {

    state = {
        userID: '',
        assetID: '',
        list: [],
        tickets: []
    }
  
    constructor(props) {
        super(props);
        // Replace instance method with a new 'bound' version
        this.getList = this.getList.bind(this);
    }

    componentWillMount () {
        AsyncStorage.getItem("BM").then((value) => {
            if(value === 'true'){
                AsyncStorage.getItem("AssetID").then((value2) => {
                    this.setState({userID: value2}, () => {
                        this.getList()
                    })
                })
            }
            else{
                AsyncStorage.getItem("UserAccount").then((value3) => {
                    this.setState({userID: value3}, ()=>{
                        this.getList();
                    });
                })
            }
        })
        this.subs = [
            this.props.navigation.addListener("willFocus", () => {
                this.getList()
            }),
            this.props.navigation.addListener("didBlur", () => {
              this.setState({ list: [] })
            })
          ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());

    }
  
    getList() {
        // console.log("getting list")
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/chat/chatHome/${this.state.userID}`,
        })
        .then((response) => { 
            this.setState({tickets: response.data.tickets},()=>{
                var list = response.data.chats
                if (list.length>1){
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].subcontractorID==this.state.userID){
                            list[i].isNew = list[i].newForSubcontractor
                        }else{
                            if (list[i].tenantID==this.state.userID){
                                list[i].isNew = list[i].newForTenant
                            }else{
                                list[i].isNew = list[i].newForAsset
                            }
                        }
                    }
                    var swapped;
                    do {
                        swapped = false;
                        for (var i=0; i < list.length-1; i++) {
                            if (!list[i].isNew && list[i+1].isNew) {
                                var temp = list[i];
                                list[i] = list[i+1];
                                list[i+1] = temp;
                                swapped = true;
                            }
                        }
                    } while (swapped);
                    // console.log(list)
                }         
                this.setState({list: list})
            });
            
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
    }


    _renderItem = ({item}) => {
        return ( 
            <Chat
                key={item._id}
                chat={item}
                tickets={this.state.tickets}
                onPress={() => {
                    this.props.navigation.navigate('Chat', {chatID: item._id});
                }}
            />
        )
    }

    _listEmpty = () => {
        return <LoadingSpin/>
    }

    _keyExtractor = (item, index) => item._id;

    render() {
        const { search } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                    <NavigationEvents 
                        onDidFocus={payload => {
                            if(payload.action.type === "Navigation/NAVIGATE"){
                                this.getList();
                            }
                        }}
                    />
                    <FlatList
                        data={this.state.list}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ListEmptyComponent={this._listEmpty}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
  }
  
  
  export default ChatHome