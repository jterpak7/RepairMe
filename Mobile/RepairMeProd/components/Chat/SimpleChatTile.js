import React from 'react';
import { Text, Image, TouchableOpacity, AsyncStorage, View } from 'react-native';
import moment from 'moment'
import styles from '../../constants/GlobalStyle'

class Chat extends React.Component {
    state = {
        userID: null,
    }
    constructor(props) {
        super(props);
    }
    componentWillMount () {
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({userID: value});
        })
    }

    render() {
        const tickets = this.props.tickets;
        const chat = this.props.chat;
        var ticket
        for (var i = 0;i<tickets.length;i++){
            if (tickets[i]._id==chat.ticketID){
                ticket=tickets[i]
            }
        }
        const img = ticket.image;
        var user=-1
        var isNew=false
        if (chat.subcontractorID==this.state.userID){
            user=2
            isNew = chat.newForSubcontractor
        }else{
            if (chat.tenantID==this.state.userID){
                user=0
                isNew = chat.newForTenant
            }else{
                user=1
                isNew = chat.newForAsset
            }
        }
        var chatDescription = "ERROR"
        if (chat.subcontractorID!=undefined){
            if (chat.tenantID!=undefined){
                if(chat.asset!=undefined){
                    if (user==0){
                        chatDescription = "Building Manager and Tradesman"
                    }else if (user==1){
                        chatDescription = "Tenant and Tradesman"
                    }else{
                        chatDescription = "Tenant and Building Manager"
                    }              
                }else{
                    if (user==0){
                        chatDescription = "Tradesman"
                    }else{
                        chatDescription = "Tenant"
                    }                
                }
            }else{
                if (user==1){
                    chatDescription = "Tradesman"
                }else{
                    chatDescription = "Building Manager"
                }
            }
        }else{
            if (user==0){
                chatDescription = "Building Manager"
            }else{
                chatDescription = "Tenant"
            }
        }

        return (
            <TouchableOpacity
                style={styles.tileWithShadow}
                onPress={this.props.onPress}
            >
                <View
                    style={{ flex: 1, flexDirection: "row", overflow: "hidden" }}
                >
                    <Image
                        source={{ uri: `data:image/gif;base64,${img}` }}
                        style={{ width: 80, height: 80 }}
                    />
                    <View
                        style={{ paddingLeft: 20, paddingTop: 10 }}
                    >   
                        <Text
                            style={styles.greyText}
                        > 
                            {chatDescription} 
                            is new: {isNew.toString()}
                        </Text>
                        <Text
                            style={[styles.basicTextContrast, {fontSize: 13, textAlign: 'left'}]}
                        > 
                            {ticket.ticketState} 
                        </Text>
                    </View>           
                </View>     
            </TouchableOpacity>
        );
    }
}

export default Chat;