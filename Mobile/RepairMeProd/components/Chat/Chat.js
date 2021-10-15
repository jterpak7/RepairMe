import React from 'react';
import { GiftedChat } from "react-native-gifted-chat";
import { Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import Globals from '../../constants/Globals'
import TimerMixin from 'react-timer-mixin';
mixins: [TimerMixin];

class Chat extends React.Component {
    state = {
        messages: [],
        users: [],
        chatID:"",
        userID:"",
        loading:true,
        userIndex:0,
        messageHash:""
    };

    componentDidMount() {
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({userID: value});
        })
        var users = [
            {
                _id: 0,
                name: "Tenant",
                avatar: "https://placeimg.com/140/140/any"
            },
            {
                _id: 1,
                name: "Contractor",
                avatar: "https://placeimg.com/140/140/any"
            },
            {
                _id: 2,
                name: "Building Manager",
                avatar: "https://placeimg.com/140/140/any"
            }
        ]
        this.setState({users:users},()=>{
            const chatID = this.props.navigation.getParam('chatID', 'none');
            this.setState({chatID: chatID},()=>{
                this.getChat()
            });
        });
        this.interval = setInterval(() => { this.checkForNewMessages() }, 2000);
    }
    getChat(){
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/chat/existing/${this.state.chatID}?userID=${this.state.userID}`
        })
        .then((response) => {
            this.setMessages(response.data.chat.messages, response.data.chat)
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
            }
        });
    }
    checkForNewMessages(){
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/chat/checkNewMessages/${this.state.chatID}?localHash=${this.state.messageHash}`
        })
        .then((response) => {
            if(response.data.isNew){
                this.getChat()
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
        

    onSend(newMessages = []) {
        newMessages[0].user=this.state.userIndex
        axios({
            method: 'put',
            url: `http://${Globals.WebAPI}/api/chat/existing/`+this.state.chatID,
            data: newMessages
        })
        .then((response) => {
            this.getChat()
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
            }
        });
    }

    setMessages(messages,chat){
        for (var i = 0;i<messages.length;i++){
            messages[i].user=this.state.users[messages[i].user]
        }
        this.setState({messages: messages},()=>{
            if (chat.tenantID==this.state.userID){
                this.setState({userIndex:0},()=>{
                    this.setState({loading:false})
                })
            }else if (chat.subcontractorID==this.state.userID){
                this.setState({userIndex:1},()=>{
                    this.setState({loading:false})
                })
            }else{
                this.setState({userIndex:2},()=>{
                    this.setState({loading:false})
                })
            }
        })
        this.setState({messageHash:chat.messagesHash})
    }

    render() {
        if (this.state.loading){
            return (
                <Text>
                    Loading...
                </Text>
            );

        }
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={this.state.users[this.state.userIndex]}
                renderUsernameOnMessage={true}
            />
        );
      }
}

export default Chat;