import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import styles from "../../constants/GlobalStyle"

class TileTicket extends React.Component {

    constructor(props) {
        super(props);
    }
 
    render() {
        const ticket = this.props.ticket;
        const img = ticket.image;
        return (
            <View 

            >
                <TouchableOpacity
                    style={styles.tileWithShaddow}
                    onPress={this.props.onPress}
                >
                    <View
                        style={{flex:1, justifyContent: "center", alignItems: "center", overflow:"hidden"}}
                    >
                     <Image
                        source={{ uri: `data:image/gif;base64,${img}` }}
                        style={{minWidth:"100%", minHeight: 150}}
                    />
                    </View>
                  
                    <View
                        style={{width: '50%', margin: 10, position: "relative"}}
                    >
                        <Text
                            style={styles.greyText}
                        >
                            {this.props.ticket.description}
                        </Text>
                        <Text
                            style={styles.greyText}
                        >
                            {moment(this.props.ticket.timeOpened).format('MM/DD/YYYY')}
                        </Text>                           
                        <Text
                            style={[styles.basicTextContrast, {fontSize:12, position: "absolute", bottom: 0, textAlign: "left"}]}
                        >
                        - DETAILS - 
                        </Text>
                        <View
                            style={{paddingRight:20, position: "absolute", right: 0, bottom: 0}}
                        >
                            <Text
                            style={[styles.greyText,{fontSize: 12,}]}
                            >
                                {this.props.ticket.ticketState}
                            </Text>                        
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default TileTicket;