import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import GPay, { GooglePayImage } from 'react-native-gpay'

const cardNetworks = [ 'MASTERCARD', 'VISA','AMEX', 'JCB',] 

const paymentRequest = {
  cardPaymentMethodMap: {
    gateway: {
      name: 'GATEWAY_NAME',
      merchantId: '055XXXXXXXXXXXXX336', 
      clientKey: 'sandbox_XXXXXXXXXXXXndxm44jw',
      sdkVersion: 'client.VERSION' 
    },
    cardNetworks
  },
  transaction: {
    totalPrice: '20',
    totalPriceStatus: 'FINAL', 
    currencyCode: 'USD' 
  },
  merchantName: 'XXXXXXXXXXXX'  
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAvailable: null,
      text: ''
    }
  }
 
  onPressCheck = async () => {
    const isAvailable = await GPay.checkGPayIsEnable(
      GPay.ENVIRONMENT_TEST, 
      cardNetworks
    ).catch(error => {
      console.warn(error.toString())
      return false
    })
    this.setState({ isAvailable })
  }

  
  onPressPay = async () => {
    const token = await GPay.show(
      GPay.ENVIRONMENT_TEST,
      paymentRequest  
    ).catch(error => {
      this.setState({ text: `error: ${error}` })
      return error;
    })
    if (token) {
      this.setState({ text: `token: ${token}` })
    }
  }

  render() {
    const { isAvailable, text } = this.state

    return (
      <View style={styles.container}>
        <Text>Price</Text>
        <Text style={{ marginTop: 50 }}>
          {isAvailable === true
            ? 'Available!!'
            : isAvailable === false
              ? 'Not available'
              : null}
        </Text>
        <TouchableOpacity
          onPress={this.onPressCheck}
          style={[
            {
              marginTop: 10,
              backgroundColor: 'blue',
              padding: 10
            },
            styles.button
          ]}>
          <Text style={{ color: 'white' }}>
             Google Pay is available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isAvailable !== true}
          onPress={this.onPressPay}
          style={{ marginTop: 50 }}>
          <GooglePayImage
            style={[styles.button, { opacity: isAvailable === true ? 1 : 0.3 }]}
          />
        </TouchableOpacity>

        <Text style={{ marginTop: 20 }}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  button: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});