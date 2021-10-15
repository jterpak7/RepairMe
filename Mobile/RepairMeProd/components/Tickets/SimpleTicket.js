import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import moment from 'moment'
import styles from "../../constants/GlobalStyle"

class SimpleTicket extends React.Component {

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
                                {this.props.ticket.description}
                            </Text>
                            <Text
                                style={[styles.greyText, { paddingTop:10, fontSize: 12, textAlign: "left"}]}
                                >
                                {moment(this.props.ticket.timeOpened).format('MM/DD/YYYY')}
                            </Text>
                            <Text
                                style={[styles.basicTextContrast, { fontSize: 12, textAlign: "left"}]}
                            >DETAILS
                            </Text>
                        </View>
                        <View
                                style={{ paddingRight: 20, paddingBottom:10, position: "absolute", bottom: 0, right: 0}}
                            >
                                <Text
                                    style={[styles.greyText, { fontSize: 12, }]}
                                >
                                    {this.props.ticket.ticketState}
                                </Text>
                            </View>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default SimpleTicket;