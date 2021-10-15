import React from 'react';
import { View, Text, Button, TouchableOpacity, AsyncStorage, Image, Picker } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import styles from '../../constants/GlobalStyle'

class TenantTicketDetails extends React.Component {

    state = {
        currTicket: null,
        ticketImage: null,
        modalVisible: false,
        assetID: '',
        contractors: null,
        selectedCont: null,
        userID: null,
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({ userID: value });
        })
        AsyncStorage.getItem("AssetID").then((value) => {
            this.setState({ assetID: value });
        });
        this.setState({ currTicket: ticket });
        //this._getTicketImage();
    }

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <View>
                <Text>Select Your Desired Contractor</Text>
                <Text>Ticket Categories:</Text>
                <Text>-{this.state.currTicket.categories[0]}</Text>
                <Text>-{this.state.currTicket.categories[1]}</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={this.state.selectedCont}
                    onValueChange={(value) => (this.setState({ selectedCont: value }))}
                >
                    {this.state.contractors && this._renderContractorList()}
                </Picker>
            </View>
            <Button
                title="Assign Contractor"
                onPress={this._assignContractor}
            />
        </View>
    )

    render() {
        const img = this.state.currTicket.image;
        const state = this.state.currTicket.ticketState;
        if (state === 'Declined' || state === 'Cancelled') {
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
                            {"\n\nOpened: "}

                        </Text>
                        {moment(this.state.currTicket.timeOpened).format('MM/DD/YYYY')}


                        <Text style={{ fontWeight: "bold" }}>
                            {"\n\nStatus: "}

                        </Text>
                        {this.state.currTicket.ticketState}
                    </Text>

                    <TouchableOpacity
                        style={[styles.buttonContrast, { marginBottom: 15 }]}
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
                                {"\n\nOpened: "}

                            </Text>
                            {moment(this.state.currTicket.timeOpened).format('MM/DD/YYYY')}


                            <Text style={{ fontWeight: "bold" }}>
                                {"\n\nStatus: "}

                            </Text>
                            {this.state.currTicket.ticketState}
                        </Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            )
        }
        else {
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
                            {"\n\nOpened: "}

                        </Text>
                        {moment(this.state.currTicket.timeOpened).format('MM/DD/YYYY')}


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
                            CHAT ABOUT THIS TICKET
                        </Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            );
        }
    }
}

export default TenantTicketDetails