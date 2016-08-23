'use strict';

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  Navigator,
  Vibration,
  Linking,
  Animated,
  Easing,
  View
} from 'react-native';

import Camera from 'react-native-camera'


export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    customMarker: PropTypes.element,
    topContent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    bottomContent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    onRead: () => (console.log('QR code scanned!')),
    reactivate: false,
    reactivateTimeout: 0,
    fadeIn: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      fadeInOpacity: new Animated.Value(0)
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(
         this.state.fadeInOpacity,
         {
           toValue: 1,
           easing: Easing.inOut(Easing.quad),
         },
        )
      ]).start();
    }
   }

  _setScanning(value) {
    this.setState({ scanning: value });
  }

  _handleBarCodeRead(e) {
    Vibration.vibrate();
    if (!this.state.scanning) {
      this._setScanning(true);
      this.props.onRead(e)
      if (this.props.reactivate) {
        setTimeout(() => (this.setScanning(false)), this.props.reactivateTimeout);
      }
    }
    return;
  }

  _renderTopContent() {
    if (this.props.topContent) {
      return this.props.topContent;
    }
    return null;
  }

  _renderBottomContent() {
    if (this.props.bottomContent) {
      return this.props.bottomContent;
    }
    return null;
  }

  _renderCameraMarker() {
    return null;
    return (
      <View style={styles.rectangleContainer}>
        <View style={styles.rectangle}/>
      </View>
    )
  }

  _renderCamera() {
    if (this.props.fadeIn) {
      return (
        <Animated.View
          style={{
            opacity: this.state.fadeInOpacity,
            backgroundColor: 'transparent'
        }}>
          <Camera style={styles.camera} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
            {this._renderCameraMarker()}
          </Camera>
        </Animated.View>
      )
    }
    return (
      <Camera style={styles.camera} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
        {this._renderCameraMarker()}
      </Camera>
    )
  }


  render() {
    return (
      <View style={{
          flex: 1,
          marginTop: 64,
        }}>
        <View style={styles.infoView}>
          {this._renderTopContent()}
        </View>
        {this._renderCamera()}
        <View style={styles.infoView}>
          {this._renderBottomContent()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    // backgroundColor: 'pink',
    padding: 16,
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
})
