import React from 'react';
import { Text, TouchableOpacity, Button, View } from 'react-native';

class MaterialView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text> Title: {this.props.material.title} </Text>
                <Text> Unit Cost: {this.props.material.price} </Text>
                <Text> Quantity: {this.props.material.quantity} </Text>
                <Text> Total Cost: {this.props.material.quantity*this.props.material.price} </Text>               
            </View>
        );
    }
}

export default MaterialView;