'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Dimensions,
  Vibration,
  Animated,
  Easing,
  View,
  Text,
  Platform,
} from 'react-native';

import Camera from 'react-native-camera'


export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    cameraType: PropTypes.oneOf(['front','back']),
    customMarker: PropTypes.element,
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any,
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    bottomContent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    notAuthorizedView: PropTypes.element,
  }

  static defaultProps = {
    onRead: () => (console.log('QR code scanned!')),
    reactivate: false,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    cameraType: 'back',
    notAuthorizedView: (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          textAlign: 'center',
          fontSize: 16,
        }}>
          Camera not authorized
        </Text>
      </View>
    ),
  }

  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      fadeInOpacity: new Animated.Value(0),
      isAuthorized: false,
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      Camera.checkVideoAuthorizationStatus().then(isAuthorized => {
        this.setState({ isAuthorized })
      })
    }
    else {
      this.setState({ isAuthorized: true })
    }
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
    if (!this.state.scanning) {
      Vibration.vibrate();
      this._setScanning(true);
      this.props.onRead(e)
      if (this.props.reactivate) {
        setTimeout(() => (this._setScanning(false)), this.props.reactivateTimeout);
      }
    }
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
    if (this.props.showMarker) {
      if (this.props.customMarker) {
        return this.props.customMarker;
      } else {
        return (
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle} />
          </View>
        );
      }
    }
    return null;
  }

  _renderCamera() {
    const { notAuthorizedView, cameraType } = this.props
    const { isAuthorized } = this.state
    if (isAuthorized) {
      if (this.props.fadeIn) {
        return (
          <Animated.View
            style={{
              opacity: this.state.fadeInOpacity,
              backgroundColor: 'transparent'
            }}>
            <Camera type={cameraType} style={[styles.camera, this.props.cameraStyle]} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
              {this._renderCameraMarker()}
            </Camera>
          </Animated.View>
        )
      }
      return (
        <Camera type={cameraType} style={[styles.camera, this.props.cameraStyle]} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
          {this._renderCameraMarker()}
        </Camera>
      )
    } else {
      return notAuthorizedView
    }
  }

  reactivate() {
    this._setScanning(false);
  }

  render() {
    return (
      <View style={[styles.mainContainer, this.props.containerStyle]}>
        <View style={[styles.infoView, this.props.topViewStyle]}>
          {this._renderTopContent()}
        </View>
        {this._renderCamera()}
        <View style={[styles.infoView, this.props.bottomViewStyle]}>
          {this._renderBottomContent()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
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
