import React from 'react';
import { FlatList, View, Button, Text, AsyncStorage, TextInput, Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MaterialView from '../MaterialView';
import Globals from '../../constants/Globals'
import axios from 'axios';

class SubViewCompletedTicket extends React.Component {

    state = {
        userID: '',
        assetID: '',
        currTicket: null,
        currMatTitle:"",
        currMatPrice:"",
        currMatQuantity:"",
        materials: [],
        hoursWorked:"",
        winningBid:null,
        full:0,
        mats:0,
        labour:0,
        modalVisible: false,
        materialIndex:0
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
        this.setState({materials: ticket.materials});
        var fakeWB = {
            plusMaterials: true,
            isContract: true,
            firstHour: 20,
            subsequentHours: 15,
            contractPrice: 0            
        }
        this.setState({winningBid: fakeWB}, () => this._calcFullPrice() );
        

    }

    updateMaterials(mats) {
        axios({
          method: 'post',
          url: `http://${Globals.WebAPI}/api/ticket/SubOpenTicket/materials/`+this.state.currTicket._id,
          data: {
            materials:mats 
          }
        })
          .then((response) => {
            this.setState({currTicket: response.data.ticket},()=>{
                this.setState({materials: []},()=>{
                    this.setState({materials: response.data.ticket.materials},()=>{
                        this._calcFullPrice()
                        this.setState({modalVisible: false});
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
            data: null
        })
        .then((response) => { 
            this.props.navigation.navigate('SubOpenTicketDetails');
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error);
            }
        });
    }


    _openMaterialModal = (i, item) => {
        this.setState({materialIndex: i},()=>{
            this.setState({currMatTitle: item.title},()=>{
                this.setState({currMatPrice: item.price.toString()},()=>{
                    this.setState({currMatQuantity: item.quantity.toString()},()=>{
                        this._calcFullPrice()
                        this.setState({modalVisible: true});
                    });            
                });
            });    
        });
    }

    _calcFullPrice(){
        var labour = 0;
        if (this.state.winningBid.isContract){
            labour = this.state.winningBid.contractPrice
        }else{
            if(this.state.hoursWorked<=0){
                labour = 0
            }else if(this.state.hoursWorked<=1){
                labour = this.state.hoursWorked * this.state.winningBid.firstHour//should this be 1 minimum
            }else {
                labour = this.state.winningBid.firstHour
                labour += (this.state.hoursWorked-1) * this.state.winningBid.subsequentHours
            }
        }
        this.setState({labour: labour});
        var mats = 0;
        if (this.state.winningBid.plusMaterials){
            for(var i = 0; i<this.state.materials.length;i++){
                mats+= this.state.materials[i].price * this.state.materials[i].quantity
            }
        }
        var full = mats+labour
        this.setState({mats: mats});
        this.setState({full: full});
    }

    _renderModalContent = () => (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            resetScrollToCoords={{ x: 0, y: 50 }}
            contentContainerStyle={styles.scrollView}
            scrollEnabled={true}
        >            
            <View>
                <Text>Add Your Material</Text>
                <Text>Description</Text>
                <TextInput
                    onChangeText={(text) => this.setState({currMatTitle:text})}
                    value={this.state.currMatTitle}
                    placeholder="Title"
                />
                <TextInput
                    onChangeText={(text) => this.setState({currMatPrice: text})}
                    value={this.state.currMatPrice}
                    keyboardType="numeric"
                    placeholder="Price"
                />
                <TextInput
                    onChangeText={(text) => this.setState({currMatQuantity: text})}
                    value={this.state.currMatQuantity}
                    keyboardType="numeric"
                    placeholder="Quantity"
                />
            </View>
            <Button
                title="Cancel"
                onPress={ ()=>{
                    this.setState({modalVisible: false});
                } }
            />
            <Button
                title="Accept"
                onPress={ ()=>{
                    var materials = this.state.materials;
                    if(this.state.materialIndex<0){
                        materials.push({
                            title:this.state.currMatTitle,
                            price:parseFloat(this.state.currMatPrice.toString()),
                            quantity:parseFloat(this.state.currMatQuantity.toString())
                        }) 
                    }else{
                        materials[this.state.materialIndex].title=this.state.currMatTitle
                        materials[this.state.materialIndex].price=parseFloat(this.state.currMatPrice.toString())
                        materials[this.state.materialIndex].quantity=parseFloat(this.state.currMatQuantity.toString())
                    }
                    this.updateMaterials(materials)
                } }
            />
        </KeyboardAwareScrollView>
    )

    _renderItem = ({item, index}) => {
        return ( 
            <MaterialView
                key={index}
                material={item}
            />
        )
    }

    _listEmpty = () => {
        if(this.state.materials.length === 0) {
            return <Text>No Materials Used...</Text>
        }
        else{
            return <Loading/>
        }
    }


    _keyExtractor = (item, index) => index.toString();

    render() {
        if(this.state.winningBid.isContract){
            if(this.state.winningBid.plusMaterials){
                return (
                    <View>
                        <Text>Complete Job</Text>
                        <Text>this is a labour contract work order</Text>
                        <Text>Agreed Labour Price: ${this.state.winningBid.contractPrice}</Text>
                        <FlatList
                            data={this.state.materials}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            ListEmptyComponent={this._listEmpty}
                            scrollEnabled="false"
                        />
                        <Text>Price: ${this.state.full}</Text>
                        <Text>Labour: ${this.state.labour}</Text>
                        <Text>Materials: ${this.state.mats}</Text>
                        <Modal
                            ref={ref => {
                                this.Modal = ref;
                            }}
                            ticket={ this.state.currTicket }
                            animationType={ 'slide' }
                            visible={ this.state.modalVisible }
                        >
                            {this.state.currTicket && this._renderModalContent()}
                        </Modal>

                    </View>
                );
            }else{
                return (
                    <View>
                        <Text>Complete Job</Text>
                        <Text>this is a purely contract job</Text>
                        <Text>Agreed Price: {this.state.winningBid.contractPrice}</Text>
                    </View>
                );
            }
        }else{
            return (
                <View>
                    <Text>Complete Job</Text>
                    <Text>Please enter your hours worked</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ hoursWorked: text }, () => this._calcFullPrice() )}
                        value={this.state.hoursWorked}
                        keyboardType="numeric"
                        placeholder="Hours Worked"
                    />
                    <Text>First hour price: ${this.state.winningBid.firstHour}</Text>
                    <Text>subsequent hours price: ${this.state.winningBid.subsequentHours}</Text>
                    <FlatList
                        data={this.state.materials}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ListEmptyComponent={this._listEmpty}
                        scrollEnabled="false"
                        />
                    <Text>Price: {this.state.full}</Text>
                    <Text>Labour: {this.state.labour}</Text>
                    <Text>Materials: {this.state.mats}</Text>
                    <Modal
                        ref={ref => {
                            this.Modal = ref;
                        }}
                        ticket={ this.state.currTicket }
                        animationType={ 'slide' }
                        visible={ this.state.modalVisible }
                    >
                        {this.state.currTicket && this._renderModalContent()}
                    </Modal>
     
                </View>
                
            );
        }
    }

}

export default SubViewCompletedTicket