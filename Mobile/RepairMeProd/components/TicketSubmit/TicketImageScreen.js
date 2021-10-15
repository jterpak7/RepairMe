import React from 'react';
import { Text, View, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import { Camera, Permissions, ImageManipulator } from 'expo';
import { Icon } from 'react-native-elements';
import styles from '../../constants/GlobalStyle'

class TicketImageScreen extends React.Component {
    constructor() {
        super();
        this.onPictureSaved = this.onPictureSaved.bind(this);
        //this.takePicture1 = this.takePicture1.bind(this);
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        focus: 'on'
    };

    componentDidMount = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    takePicture = () => {
        console.log("im in the takePicture");
        if (this.camera) {
            this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved, base64: true, quality: 0, skipProcessing: true });
        }
    };

    onPictureSaved = async photo => {
        await AsyncStorage.setItem('PictureBase64', photo.base64);
        const result = await ImageManipulator.manipulateAsync(photo.uri, [{resize: {height: 1000}}], {compress: 0.3, base64: true } );
        console.log(result.base64.length);
        AsyncStorage.getItem("BM").then((value) => {
            if(value === "true"){
                this.props.navigation.navigate('BMSubmitTicket', { base64: result.base64 });
            }
            else{
                this.props.navigation.navigate('TenantSubmitTicket', { base64: result.base64});
            }
        })
    }


    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        style={{ flex: 1 }}
                        type={this.state.type}
                        autoFocus={this.state.focus}
                        ref={ref => { this.camera = ref }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginBottom: 15
                        }}>
                            <TouchableOpacity
                                onPress={this.takePicture}
                            >
                            <Icon
                                name='camera'
                                type='font-awesome'
                                color={styles.white.color}
                            />
                            </TouchableOpacity>
                            
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}

export default TicketImageScreen;

