import React from 'react';
import { View, Text, AsyncStorage, Modal, TouchableOpacity, Image, Picker } from 'react-native';
import Globals from '../../constants/Globals'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import styles from '../../constants/GlobalStyle'

class BMTicketDetails extends React.Component {

    state = {
        currTicket: null,
        ticketImage: null,
        modalVisible: false,
        assetID: '',
        categories: null,
        selectedCat: null,
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
            this.getCategories();
        });
        this.setState({ currTicket: ticket });
        //this._getTicketImage();
    }

    getCategories() {
        axios({
            method: 'get',
            url: `http://${Globals.WebAPI}/api/categories/suggest/${this.state.currTicket.buckets[0]}`,
        })
            .then((response) => {
                this.setState({ categories: response.data.categories });
                this.setState({ selectedCat: response.data.categories[0]._id });
            })
            .catch(function (error) {
                if (error) {
                    console.log(error);
                }
            }).done();
    }

    _assignCategory = () => {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/assignCategory/${this.state.currTicket._id}`,
            data: {
                category: this.state.selectedCat
            }
        })
            .then((response) => {
                this.setState({ currTicket: response.data.ticket });
                this.setState({ modalVisible: false });
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                    alert("Something Went Wrong, Please Try Again.")
                }
            }).done();
    }

    _onPressAccept = () => {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/accept/${this.state.currTicket._id}`,
            data: {
                acceptorID: this.state.userID,
            }
        })
            .then((response) => {
                this.setState({ modalVisible: true });
                this.setState({ currTicket: response.data.ticket });
            })
            .catch((error) => {
                if (error) {
                    alert("Something Went Wrong, Try Again.")
                }
            }).done();
    }

    _onPressDecline = () => {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/decline/${this.state.currTicket._id}`,
        })
            .then((response) => {
                this.props.navigation.navigate("BMHome");
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            }).done();
    }

    _renderModalContent = () => (

        
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            resetScrollToCoords={{ x: 0, y: 50 }}
            contentContainerStyle={styles.scrollView}
            scrollEnabled={true}
        >
            <Text style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20, fontWeight: 'bold' }]}>
                Select your desired category:
        </Text>

        <View>
                <Picker
                    style={{ height: 150, width: 200 }}
                    selectedValue={this.state.selectedCat}
                    onValueChange={(value) => (this.setState({ selectedCat: value }))}
                >
                    {this.state.categories && this._renderCategoriesList()}
                </Picker>
            </View>


            <TouchableOpacity
                onPress={() => {
                    this.setState({ modalVisible: false });
                }}
                style={[styles.buttonContrast, { marginBottom: 15, borderColor: styles.accentPink.color }]}
            >
                <Text
                    style={[styles.basicTextContrast, { color: styles.accentPink.color }]}
                >
                    CANCEL
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={this._assignCategory}
                style={[styles.buttonContrast, { marginBottom: 15 }]}
                >
                <Text style={styles.basicTextContrast}>
                    SELECT AND APPROVE
                </Text>
            </TouchableOpacity>

            
        </KeyboardAwareScrollView>
        
    )

    _renderCategoriesList = () => {
        return (this.state.categories.map((x, i) => {
            return (
                <Picker.Item
                    label={`${x.name}`}
                    key={x._id}
                    value={x._id}
                />
            )
        }))
    }

    _viewBids = () => {
        this.props.navigation.navigate("BMViewBids", { ticket: this.state.currTicket });
    }

    _completeTicket = () => {
        this.props.navigation.navigate('BMReviewTicket', {ticket: this.state.currTicket});
    }

    render() {
        const ticketState = this.state.currTicket.ticketState;
        const img = this.state.currTicket.image;
        if (this.state.currTicket.acceptorID) {
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
                            {"\n\nTicket State: "}

                        </Text>
                        {this.state.currTicket.ticketState}
                    </Text>
                    {ticketState === 'Awaiting Bids' ? (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._viewBids}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                VIEW BIDS
                            </Text>
                        </TouchableOpacity>) : null
                    }
                    {ticketState === 'Under Review' ? (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._completeTicket}
                        >
                            <Text
                                style={styles.basicTextContrast}
                            >
                                REVIEW TICKET
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                        style={styles.buttonContrast}
                        onPress={() => { this.props.navigation.navigate('CreateChat', { ticket: this.state.currTicket }); }}
                    >
                        <Text style={styles.basicTextContrast}>
                            CHAT ABOUT THIS TICKET
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        ref={ref => {
                            this.Modal = ref;
                        }}
                        ticket={this.state.currTicket}
                        animationType={'slide'}
                        visible={this.state.modalVisible}
                    >
                        {this.state.currTicket && this._renderModalContent()}
                    </Modal>
                </KeyboardAwareScrollView>
            );
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
                            {"\n\nTicket State: "}

                        </Text>
                        {this.state.currTicket.ticketState}
                    </Text>

                    {ticketState === 'New' ? (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._onPressAccept}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                ACCEPT TICKET
                        </Text>
                        </TouchableOpacity>

                    ) : null
                    }
                    {ticketState === 'New' ? (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15, borderColor: styles.accentPink.color }]}
                            onPress={this._onPressDecline}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                DECLINE TICKET
                            </Text>
                        </TouchableOpacity>
                    ) : null
                    }
                    {ticketState === 'Awaiting Bids' ? (
                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._viewBids}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                VIEW BIDS
                         </Text>
                        </TouchableOpacity>) : null

                    }
                    <TouchableOpacity
                        style={styles.buttonContrast}
                        onPress={() => { this.props.navigation.navigate('CreateChat', { ticket: this.state.currTicket }); }}
                    >
                        <Text style={styles.basicTextContrast}>
                            CHAT ABOUT THIS TICKET
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        ref={ref => {
                            this.Modal = ref;
                        }}
                        ticket={this.state.currTicket}
                        animationType={'slide'}
                        visible={this.state.modalVisible}
                    >
                        {this.state.currTicket && this._renderModalContent()}
                    </Modal>
                </KeyboardAwareScrollView>
            );
        }
    }
}

export default BMTicketDetails