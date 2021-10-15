import React from 'react';
import { AppLoading, Font } from 'expo';
import RobotoRegular from '../assets/fonts/Roboto/Roboto-Regular.ttf';
import MontserratLight from '../assets/fonts/Montserrat/Montserrat-Light.ttf'

export class FontLoader extends React.Component {
  state = {
    fontLoaded: false
  };
  async componentWillMount() {
    try {
      await Font.loadAsync({
        RobotoRegular,
        MontserratLight        
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading font', error);
    }
  }
  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }
    return this.props.children;
  }
}