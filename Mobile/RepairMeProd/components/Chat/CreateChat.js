import React from 'react';
import { View, Image, TouchableOpacity, AsyncStorage, TextInput, Text } from 'react-native';
import Globals from '../../constants/Globals'
import axios from 'axios';
import uuid from 'react-native-uuid';
import styles from '../../constants/GlobalStyle'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class CreateChat extends React.Component {
    state = {
        currTicket: null,
        userID: null,
        isBM: false,
        isTenant: false,
        isSub: false,
        show: false,
        text:"",
        tenantBMExists: false,
        tenantSubExists: false,
        BMSubExists: false,
        allExists: false,
        index:-1,
        modalVisible: false
    }

    constructor(props) {
        super(props);
    }

    componentWillMount () {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({userID: value},()=>{
            });
        })
        this.setState({currTicket: ticket},()=>{
            
            axios({
                method: 'get',
                url: `http://${Globals.WebAPI}/api/chat/checkForExisting/`+this.state.currTicket._id
            })
            .then((response) => {
                // console.log("chats")
                const  chats = response.data.chats
                for(var i = 0; i<chats.length;i++){
                    if (chats[i].subcontractorID!=undefined){
                        if (chats[i].tenantID!=undefined){
                            if(chats[i].asset!=undefined){
                                this.setState({allExists: true}) 
                            }else{
                                this.setState({tenantSubExists: true}) 
                            }
                        }else{
                            this.setState({BMSubExists: true}) 
                        }
                    }else{
                        this.setState({tenantBMExists: true})
                    }
                }
                this.setRequiredStates();
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                }
            });
        });
    }

    _onCreateChat = () => {
        var index = this.state.index
        var data = {
            ticketID:this.state.currTicket._id,
            asset:undefined,
            tenantID:undefined,
            subcontractorID:undefined,
            messages:[]
        }
        if(index==0||this.state.isTenant){
            data.tenantID = this.state.currTicket.UserID
        }
        if(index==1||this.state.isSub){
            data.subcontractorID=this.state.currTicket.subcontractorID
        }
        if(index==2||this.state.isBM){
            data.asset = this.state.currTicket.AssetID
        }
        if(index==3){
            data.asset = this.state.currTicket.AssetID
            data.tenantID = this.state.currTicket.UserID
            data.subcontractorID=this.state.currTicket.subcontractorID
        }
        var userIndex = 0
        if(this.state.isTenant){
            userIndex=0
        } else if(this.state.isSub){
            userIndex=1
        } else if(this.state.isBM){
            userIndex=2
        }
        data.messages.push({
            _id: uuid.v1(),
            createdAt: Date.now(),
            text: this.state.text,
            user:  userIndex
        })
        axios({
                method: 'post',
                url: `http://${Globals.WebAPI}/api/chat`,
                data: data
            })
            .then((response) => {
                this._onGoToChat(this.state.index)
            })
            .catch(function (error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
              }
        });
    }

    _onGoToChat = (index) => {
        var data = {
            ticketID:this.state.currTicket._id,
            asset:undefined,
            tenantID:undefined,
            subcontractorID:undefined,
        }
        if(index==0||this.state.isTenant){
            data.tenantID = this.state.currTicket.UserID
        }
        if(index==1||this.state.isSub){
            data.subcontractorID=this.state.currTicket.subcontractorID
        }
        if(index==2||this.state.isBM){
            data.asset = this.state.currTicket.AssetID
        }
        if(index==3){
            data.asset = this.state.currTicket.AssetID
            data.tenantID = this.state.currTicket.UserID
            data.subcontractorID=this.state.currTicket.subcontractorID
        }
        axios({
                method: 'post',
                url: `http://${Globals.WebAPI}/api/chat/navToChat`,
                data: data
            })
            .then((response) => {
                this.props.navigation.navigate('Chat', {chatID: response.data.chats._id});
            })
            .catch(function (error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
              }
        });
    }

    setRequiredStates() {
        if(this.state.currTicket.UserID==this.state.userID && !this.state.isTenant) {
            this.setState({isTenant: true},()=>{
                this.setState({isSub: false},()=>{
                    if (this.state.currTicket.UserID==this.state.currTicket.acceptorID){
                        this.setState({isBM: true})
                    }else{
                        this.setState({isBM: false})
                    }
                })                    
            })
        }
        else if(this.state.currTicket.subcontractorID==this.state.userID && !this.state.isSub) {
            this.setState({isTenant: false},()=>{
                this.setState({isSub: true},()=>{
                    this.setState({isBM: false})
                })                    
            })
        }
        else /*(!this.state.isTenant && !this.state.isSub && !this.state.isBM)*/ {
            this.setState({isSub: false},()=>{
                this.setState({isTenant: false},()=>{
                    this.setState({isBM: true})
                })                    
            })
        }
    }

    render() {
        var withTenant
        var withSub
        var withBM
        var withAll
        if (this.state.currTicket!=null){

            // if(this.state.currTicket.UserID==this.state.userID && !this.state.isTenant) {
            //     this.setState({isTenant: true},()=>{
            //         this.setState({isSub: false},()=>{
            //             if (this.state.currTicket.UserID==this.state.currTicket.acceptorID){
            //                 this.setState({isBM: true})
            //             }else{
            //                 this.setState({isBM: false})
            //             }
            //         })                    
            //     })
            // }else 
            if(this.state.isTenant) {
            }else{
                if((this.state.isBM && this.state.tenantBMExists)||(this.state.isSub && this.state.tenantSubExists)){
                    withTenant =    <TouchableOpacity
                                        style={styles.buttonContrast}
                                        onPress={ ()=>{this._onGoToChat(0)}}
                                    >
                                        <Text style={styles.basicTextContrast}>
                                        GO TO CHAT WITH TENANT
                                        </Text>                                    
                                    </TouchableOpacity>
                }else{
                    withTenant =    <TouchableOpacity
                                        style={styles.buttonContrast}
                                        onPress={ ()=>{
                                            this.setState({index: 0},()=>{
                                                this._onCreateChat()
                                            })  
                                        } }
                                    >
                                        <Text style={styles.basicTextContrast}>
                                        START CHAT WITH TENANT
                                        </Text>                                    
                                    </TouchableOpacity>
                }
            }

            // if(this.state.currTicket.subcontractorID==this.state.userID && !this.state.isSub) {
            //     this.setState({isTenant: false},()=>{
            //         this.setState({isSub: true},()=>{
            //             this.setState({isBM: false})
            //         })                    
            //     })
            // }else
             if(this.state.isSub) {
                if(this.state.currTicket.UserID==this.state.currTicket.acceptorID){
                    var temp
                    withTenant=temp
                }
            }else if(this.state.currTicket.subcontractorID!=undefined) {
                if((this.state.isBM && this.state.BMSubExists)||(this.state.isTenant && this.state.tenantSubExists)){
                    withSub =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ ()=>{this._onGoToChat(1)}}
                                >
                                    <Text style={styles.basicTextContrast}>
                                    GO TO CHAT WITH SUBCONTRACTOR
                                    </Text>                                   
                                </TouchableOpacity>
                }else{
                    withSub =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ ()=>{
                                        this.setState({index: 1},()=>{
                                            this._onCreateChat()
                                        })  
                                    } }
                                >
                                    <Text style={styles.basicTextContrast}>
                                    START CHAT WITH SUBCONTRACTOR
                                    </Text>                                   
                                </TouchableOpacity>
                }
            }

            // if(!this.state.isTenant && !this.state.isSub && !this.state.isBM) {
            //     this.setState({isSub: false},()=>{
            //         this.setState({isTenant: false},()=>{
            //             this.setState({isBM: true})
            //         })                    
            //     })
            // }else 
            if(this.state.isBM) {
            }else{
                if((this.state.isSub && this.state.BMSubExists)||(this.state.isTenant && this.state.tenantBMExists)){
                    withBM =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ ()=>{this._onGoToChat(2)}}
                                >
                                    <Text style={styles.basicTextContrast}>
                                    GO TO CHAT WITH BUILDING MANAGER
                                    </Text>                                    
                                </TouchableOpacity>
                }else{
                    withBM =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ ()=>{
                                        this.setState({index: 2},()=>{
                                            this._onCreateChat()
                                        })  
                                    } }
                                >
                                    <Text style={styles.basicTextContrast}>
                                    START CHAT WITH BUILDING MANAGER
                                    </Text>
                                </TouchableOpacity>
                }
            }

            if(this.state.currTicket.subcontractorID!=undefined && this.state.currTicket.UserID!=this.state.currTicket.acceptorID) {
                if(this.state.allExists){
                    withAll =   <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ ()=>{this._onGoToChat(3)}}
                                >
                                    <Text style={styles.basicTextContrast}>
                                    GO TO CHAT WITH BOTH
                                    </Text>                                    
                                </TouchableOpacity>
                }else{
                    withAll =    <TouchableOpacity
                                    style={styles.buttonContrast}
                                    onPress={ ()=>{
                                        this.setState({index: 3},()=>{
                                            this._onCreateChat()
                                        })  
                                    } }
                                >
                                    <Text style={styles.basicTextContrast}>
                                    START CHAT WITH BOTH
                                    </Text>                                    
                                </TouchableOpacity>
                }
            }
        }
    
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                style={styles.mainBG}
                resetScrollToCoords={{ x: 0, y: 50 }}
                contentContainerStyle={styles.scrollView}
                scrollEnabled={true}
            >
                <View
                    style={styles.container}
                >
                    <Image
                    style={styles.logoStyle}
                    source={require('../../assets/logoWhite.png')}/>
                </View>
                <TextInput
                    style={styles.basicBox}
                    onChangeText={(text) => this.setState({text:text})}
                    value={this.state.text}
                    placeholder="enter a message"
                />
                {withTenant}
                {withBM}
                {withSub}
                {withAll}
            </KeyboardAwareScrollView>
        );
      }
}

export default CreateChat;