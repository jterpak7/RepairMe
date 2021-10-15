import React from 'react';
import { Text, TouchableOpacity, Button, View } from 'react-native';
import styles from '../constants/GlobalStyle'
import { Icon } from 'react-native-elements';

class Material extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View
            style={{flex:1, flexDirection:"row", width:200}}>

                <Text style={styles.descriptionText}>

                    <Text style={{ fontWeight: 'bold' }}>Description:</Text> {this.props.material.title+"\n"}
                    <Text style={{ fontWeight: 'bold' }}>Unit Cost:</Text> ${this.props.material.price + "\n"}
                    <Text style={{ fontWeight: 'bold' }}>Quantity:</Text> ${this.props.material.quantity + "\n"}
                    <Text style={{ fontWeight: 'bold' }}>Total Cost:</Text> ${this.props.material.quantity*this.props.material.price}
                </Text>

                <TouchableOpacity
                    style={{alignSelf:"center"}}
                    onPress={()=>{this.props.onPress(false)}}// possibly only a clickable edit button @austin pls advise
                >
                    <Icon name="edit" type="material" size={25} color={styles.mainBlue.color} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default Material;