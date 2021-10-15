import React from 'react';
import { FlatList, View, Button, Text, AsyncStorage, TextInput, Modal, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Material from '../Material';
import Globals from '../../constants/Globals'
import axios from 'axios';
import styles from '../../constants/GlobalStyle'

class SubCompleteTicket extends React.Component {

    state = {
        userID: '',
        assetID: '',
        currTicket: null,
        currMatTitle: "",
        currMatPrice: "",
        currMatQuantity: "",
        materials: [],
        hoursWorked: "",
        winningBid: null,
        full: 0,
        mats: 0,
        labour: 0,
        modalVisible: false,
        materialIndex: 0
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const ticket = this.props.navigation.getParam('ticket', 'none');
        AsyncStorage.getItem("UserAccount").then((value) => {
            this.setState({ userID: value });
        })
        this.setState({currTicket: ticket},()=>{
            this.setState({materials: ticket.materials},()=>{
                if (this.state.currTicket.labour!=undefined){
                    this.setState({hoursWorked: this.state.currTicket.labour.toString()},()=>{
                        this._calcFullPrice()
                    })
                }else{
                    this._calcFullPrice()
                }
            });
        });
    }

    updateMaterials(mats) {
        axios({
            method: 'post',
            url: `http://${Globals.WebAPI}/api/ticket/SubOpenTicket/materials/` + this.state.currTicket._id,
            data: {
                materials: mats
            }
        })
            .then((response) => {
                this.setState({ currTicket: response.data.ticket }, () => {
                    this.setState({ materials: [] }, () => {
                        this.setState({ materials: response.data.ticket.materials }, () => {
                            this._calcFullPrice()
                            this.setState({ modalVisible: false });
                        });
                    });
                });
            })
            .catch(function (error) {
                console.log(error)
            });
    }


    _submit = () => {
        axios({
            method: 'put',
            url: `http://${Globals.WebAPI}/api/subcontractor/startTicket/${this.state.currTicket._id}`,
            data: {hours:this.state.hoursWorked}
        })
        .then((response) => { 
            this.props.navigation.navigate('SubHome');
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
    }


    _openMaterialModal = (i, item) => {
        this.setState({ materialIndex: i }, () => {
            this.setState({ currMatTitle: item.title }, () => {
                this.setState({ currMatPrice: item.price.toString() }, () => {
                    this.setState({ currMatQuantity: item.quantity.toString() }, () => {
                        this._calcFullPrice()
                        this.setState({ modalVisible: true });
                    });
                });
            });
        });
    }

    _calcFullPrice() {
        var bid = this.state.currTicket.Bids[0]
        // console.log(this.state.currTicket)
        var labour = 0
        if (bid.fixed) {
            labour = parseFloat(bid.price)
        } else {
            if (this.state.hoursWorked <= 0) {
                labour = 0
            } else if (this.state.hoursWorked <= 1) {
                labour = parseFloat(bid.FirstHour)*parseFloat(this.state.hoursWorked)
            } else {
                labour = parseFloat(bid.FirstHour)+ parseFloat(bid.SubsequentHours)*(parseFloat(this.state.hoursWorked)-1)
            }
        }
        this.setState({ labour: labour });
        var mats = 0
        if (!bid.MaterialsIncludedInPrice){
            for (var i = 0; i < this.state.currTicket.materials.length; i++) {
                mats += parseFloat(this.state.currTicket.materials[i].price) * parseFloat(this.state.currTicket.materials[i].quantity)
            }
        }
        var full = parseFloat(mats) + parseFloat(labour)
        this.setState({ mats: mats });
        this.setState({ full: full });
        var labour = 0;
        
        // if (!this.state.currTicket.Bids[0].MaterialsIncludedInPrice) {
        //     labour = this.state.currTicket.Bids[0].Price
        // } else 
        // {
        //     if (this.state.hoursWorked <= 0) {
        //         labour = 0
        //     } else if (this.state.hoursWorked <= 1) {
        //         labour = this.state.currTicket.Bids[0].FirstHour
        //     } else {
        //         labour = Number(this.state.currTicket.Bids[0].FirstHour)+(this.state.currTicket.Bids[0].SubsequentHours-1)*this.state.hoursWorked
        //     }
        // }
        // this.setState({ labour: labour });
        // var mats = 0;
        // if (!this.state.currTicket.Bids[0].MaterialsIncludedInPrice) {
        //     for (var i = 0; i < this.state.materials.length; i++) {
        //         mats += this.state.materials[i].price * this.state.materials[i].quantity
        //     }
        // }
        // var full = Number(mats) + Number(labour)
        // this.setState({ mats: mats });
        // this.setState({ full: full });
    }

    _renderModalContent = () => (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            resetScrollToCoords={{ x: 0, y: 50 }}
            contentContainerStyle={styles.scrollView}
            scrollEnabled={true}
        >
            <Text style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20, fontWeight: 'bold' }]}>
                Enter your material:
        </Text>

            <TextInput
                style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                onChangeText={(text) => this.setState({ currMatTitle: text })}
                value={this.state.currMatTitle}
                placeholder="ITEM DESCRIPTION"
            />
            <TextInput
                style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                onChangeText={(text) => this.setState({ currMatPrice: text })}
                value={this.state.currMatPrice}
                keyboardType="numeric"
                placeholder="PRICE"
            />
            <TextInput
                style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                onChangeText={(text) => this.setState({ currMatQuantity: text })}
                value={this.state.currMatQuantity}
                keyboardType="numeric"
                placeholder="QUANTITY"
            />

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
                style={[styles.basicBox, { borderColor: styles.mainBlue.color, marginBottom: 15 }]}
                onPress={() => {
                    var materials = this.state.materials;
                    if (this.state.materialIndex < 0) {
                        materials.push({
                            title: this.state.currMatTitle,
                            price: parseFloat(this.state.currMatPrice.toString()),
                            quantity: parseFloat(this.state.currMatQuantity.toString())
                        })
                    } else {
                        materials[this.state.materialIndex].title = this.state.currMatTitle
                        materials[this.state.materialIndex].price = parseFloat(this.state.currMatPrice.toString())
                        materials[this.state.materialIndex].quantity = parseFloat(this.state.currMatQuantity.toString())
                    }
                    this.updateMaterials(materials)
                }}
            >
                <Text style={styles.basicText}>
                    ADD MATERIAL
                </Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )

    _renderItem = ({ item, index }) => {
        return (
            <Material
                key={index}
                material={item}
                onPress={(isDelete) => {
                    if (isDelete) {
                        var materials = this.state.materials;
                        materials.splice(index, 1)
                        this.updateMaterials(materials)
                    } else {
                        this._openMaterialModal(index, item);
                    }
                }}
            />
        )
    }

    _listEmpty = () => {
        if (this.state.materials.length === 0) {
            return (
                <Text style={styles.descriptionText}>No Materials Used...</Text>
            )
        }
        else {
            return <Loading />
        }
    }


    _keyExtractor = (item, index) => index.toString();

    render() {
        if (this.state.currTicket.Bids[0].Fixed) {
            if (!this.state.currTicket.Bids[0].MaterialsIncludedInPrice) {
                return (

                    <View
                        style={styles.descriptionContainer}
                    >
                        <Text
                            style={[styles.greyText, { paddingTop: 20, paddingBottom: 20 }]}
                        >
                            Complete Job
                    </Text>
                        <Text style={styles.descriptionText}>

                            <Text style={{ fontWeight: 'bold' }}>This is a labour contract work order{'\n'}</Text>
                            <Text style={{ fontWeight: 'bold' }}>Labour Rate:</Text> ${this.state.currTicket.Bids[0].Price + "\n"}
                        </Text>

                        <View
                            style={{height:100}}
                        >  
                            <FlatList
                                data={this.state.materials}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                ListEmptyComponent={this._listEmpty}
                                scrollEnabled={true}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={() => {
                                var item = {
                                    title: "",
                                    price: "",
                                    quantity: ""
                                }
                                this._openMaterialModal(-1, item);
                            }}
                        >

                            <Text
                                style={styles.basicTextContrast}>
                                ADD NEW MATERIAL
                        </Text>
                        </TouchableOpacity>

                        <Text
                            style={styles.descriptionText}
                        >
                            <Text style={{ fontWeight: 'bold' }}>Price: {'\n'}</Text>
                            <Text style={{ fontWeight: 'bold' }}>Labour Rate:</Text> ${this.state.labour + "\n"}
                            <Text style={{ fontWeight: 'bold' }}>Materials:</Text> ${this.state.mats + "\n"}
                            <Text style={{ fontWeight: 'bold' }}>Total Price:</Text> ${this.state.full}


                        </Text>

                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._submit}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                CONFIRM AND SUBMIT
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

                    </View>
                );
            } else {
                return (

                    <View
                        style={{
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            height: '90%'
                        }}
                    >
                        <Text
                            style={[styles.greyText, { paddingTop: 20, paddingBottom: 20 }]}
                        >
                            Complete Job
                    </Text>
                        <Text
                            style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20 }]}

                        >

                            <Text style={{ fontWeight: 'bold' }}>This is a fixed contract job{'\n'}</Text>
                            <Text style={{ fontWeight: 'bold' }}>Total Price:</Text> ${this.state.full + "\n"}
                        </Text>

                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._submit}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                CONFIRM AND SUBMIT
                        </Text>
                        </TouchableOpacity>
                    </View>

                );
            }
        } else {
            if (this.state.currTicket.Bids[0].MaterialsIncludedInPrice) {
                return (
                    <View
                        style={{
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            height: '90%'
                        }}
                    >
                        <Text
                            style={[styles.greyText, { paddingTop: 20, paddingBottom: 20 }]}
                        >
                            Complete Job
                    </Text>

                        <Text style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20, fontWeight: 'bold' }]}>Enter Your Hours Worked:</Text>
                        <TextInput
                            style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                            onChangeText={(text) => this.setState({ hoursWorked: text }, () => this._calcFullPrice())}
                            value={this.state.hoursWorked}
                            keyboardType="numeric"
                            placeholder="HOURS WORKED"
                        />
                        <Text
                            style={[styles.greyText, { width: "66%", textAlign: "left", marginBottom: 20 }]}

                        >

                            <Text style={{ fontWeight: 'bold' }}>First Hour Rate:</Text> ${this.state.currTicket.Bids[0].FirstHour + "\n"}
                            <Text style={{ fontWeight: 'bold' }}>Subsequent Hourly Rate:</Text> {this.state.currTicket.Bids[0].SubsequentHours + "\n\n"}
                            <Text style={{ fontWeight: 'bold' }}>Total Price:</Text> ${this.state.labour + "\n"}
                        </Text>

                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._submit}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                CONFIRM AND SUBMIT
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
                    </View>
                );
            } else {
                return (
                    <View
                        style={{
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            height: '90%'
                        }}
                    >
                        <Text
                            style={[styles.greyText, { paddingTop: 20, paddingBottom: 20 }]}
                        >
                            Complete Job
                </Text>

                        <Text style={[styles.descriptionText, { fontWeight: 'bold' }]}>Enter Your Hours Worked:</Text>
                        <TextInput
                            style={[styles.buttonContrast, { borderColor: styles.mainGrey.color }]}
                            onChangeText={(text) => this.setState({ hoursWorked: text }, () => this._calcFullPrice())}
                            value={this.state.hoursWorked}
                            keyboardType="numeric"
                            placeholder="HOURS WORKED"
                        />
                        <Text style={styles.descriptionText}>

                            <Text style={{ fontWeight: 'bold' }}>First Hour Rate:</Text> ${this.state.currTicket.Bids[0].FirstHour + "\n"}
                            <Text style={{ fontWeight: 'bold' }}>Subsequent Hourly Rate:</Text> ${this.state.currTicket.Bids[0].SubsequentHours + "\n"}
                        </Text>
                        <View
                            style={{height:100}}
                        >  
                            <FlatList
                                data={this.state.materials}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                ListEmptyComponent={this._listEmpty}
                                scrollEnabled={true}
                            />
                        </View>
                      
                        <TouchableOpacity
                            style={[styles.buttonContrast, {  marginBottom: 15 }]}
                            onPress={() => {
                                var item = {
                                    title: "",
                                    price: "",
                                    quantity: ""
                                }
                                this._openMaterialModal(-1, item);
                            }}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                ADD NEW MATERIAL 
                        </Text>
                        </TouchableOpacity>

                        <Text style={styles.descriptionText}>

                            <Text style={{ fontWeight: 'bold' }}>Labour Cost:</Text> ${this.state.labour} {"\n"}
                            <Text style={{ fontWeight: 'bold' }}>Material Cost:</Text> ${this.state.mats + "\n\n"}
                            <Text style={{ fontWeight: 'bold' }}>Total Price:</Text> ${this.state.full}
                        </Text>

                        <TouchableOpacity
                            style={[styles.buttonContrast, { marginBottom: 15 }]}
                            onPress={this._submit}
                        >
                            <Text
                                style={styles.basicTextContrast}>
                                CONFIRM AND SUBMIT
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
                    </View>
                );
            }
        }
    }

}

export default SubCompleteTicket