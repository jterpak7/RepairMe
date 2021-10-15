
import React, { Component } from 'react';
import { View, WebView, } from 'react-native';

class StripeView extends React.Component {

    constructor(props) {
        super(props)
        //this.connectStripe = this.connectStripe.bind(this);
    }


    stripeV = (
        <View
            style={{
                flex: 1,
                backgroundColor: '#F5FCFF',
            }}>
            <WebView
                source={{ uri: 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_EglCpQJZ52NImA7iz3pckYCGtfZXQkku&scope=read_write' }}
                style={{ flex: 1 }}
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}

            />
        </View>
    )

    _onNavigationStateChange(webViewState){
        //likely need to store token created from the url, webViewState.url
        //parse through to the token, make a put request touser, add it to their account
        //https://stripe.com/docs/connect/standard-accounts

        var title = webViewState.title
        if(title=="Stripe Connect Demo"){
            this.props.navigation.navigate("CompletePaymentSetup")
        }
    }

    render() {
        return this.stripeV
    }
}
export default StripeView

