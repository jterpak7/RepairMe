import React from 'react';
import { View, Text, Button, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../constants/GlobalStyle'
import moment from 'moment'


class SubClosedTicketDetails extends React.Component {

    state = {
        currTicket: null,
        userID: null,
    }

    constructor(props) {
        super(props);
    }

    componentWillMount () {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({userID: value});
        })
        this.setState({currTicket: ticket});
    }

    _viewInvoice = () => {
        this.props.navigation.navigate('SubViewCompletedTicket', {ticket: this.state.currTicket});
    }

    render() {
        const img = this.state.currTicket.image;
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.centerContainer}
                scrollEnabled={true}
            >
                <View
                    style={styles.imagePreview}
                >
                    <Image
                        source={{ uri: `data:image/gif;base64,${img}` }}
                        style={{ minWidth: "100%", minHeight: 350 }}
                    />
                </View>

                <Text
                    style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20 }]}
                >
                    <Text style={{ fontWeight: "bold" }}>
                        {"Details: "}
                    </Text>
                    {this.state.currTicket.description}

                    <Text style={{ fontWeight: "bold" }}>
                        {"\n\nDate Secured: "}

                    </Text>
                    {moment(this.state.currTicket.timeSubbed).format('MM/DD/YYYY')}


                    <Text style={{ fontWeight: "bold" }}>
                        {"\n\nStatus: "}

                    </Text>
                    {this.state.currTicket.ticketState}
                </Text>

                <TouchableOpacity
                    style={styles.buttonContrast}
                    onPress={() => { this.props.navigation.navigate('CreateChat', { ticket: this.state.currTicket }); }}
                >
                    <Text style={styles.basicTextContrast}>
                        OPEN CHAT
                </Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        );
    }
}

export default SubClosedTicketDetails