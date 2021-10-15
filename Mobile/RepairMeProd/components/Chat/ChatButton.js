import React, { Component } from 'react';
import {  TouchableOpacity } from 'react-native';
import styles from '../../constants/GlobalStyle'
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

class ChatButton extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
        <TouchableOpacity style={{paddingRight:20}}>
            <Icon name="menu" type="material" size={25} color={styles.white.color} onPress={() => { this.props.navigation.navigate('ChatHome'); }} />
        </TouchableOpacity>
    );
  }
}

export default withNavigation(ChatButton);