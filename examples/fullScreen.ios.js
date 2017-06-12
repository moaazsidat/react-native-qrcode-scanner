/*
 * Full screen QR code scanner example
 */

'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Dimensions
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanScreen extends Component {
  onSuccess(e) {
    Linking.openURL(e.data).catch(err => console.error('An error occured', err))
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: QRCodeScanner,
          title: 'Scan Code',
          passProps: {
            onRead: this.onSuccess.bind(this),
            cameraStyle: styles.cameraContainer,
            topViewStyle: styles.zeroContainer,
            bottomViewStyle: styles.zeroContainer,
          }
        }}
        style={{flex: 1}}
      />
    )
  }
}

const styles = StyleSheet.create({
  zeroContainer: {
    height: 0,
    flex: 0,
  },

  cameraContainer: {
    height: Dimensions.get('window').height,
  },
});

AppRegistry.registerComponent('fullScreen', () => ScanScreen);
