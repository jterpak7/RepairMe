import React from 'react';
import { View, Animated, Image, Text} from 'react-native';
import styles from '../constants/GlobalStyle'

class Loading extends React.Component {

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount () {
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 1500,
        }).start()
    }

    render () {
        const interpolateRotation = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '720deg']
        });

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    style={{
                        height: 150,
                        width: 150,
                        transform: [{ rotate: interpolateRotation}] 
                    }}
                    source={require('../assets/greyWrench.png')}
                />
                <Text>Hold On a Moment...</Text>
            </View>
        )
    }
}

export default Loading;