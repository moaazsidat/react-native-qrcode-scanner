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
  PermissionsAndroid
} from 'react-native';

import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { RNCamera as Camera } from 'react-native-camera';

const CAMERA_FLASH_MODE = Camera.Constants.FlashMode;
const CAMERA_FLASH_MODES = [
  CAMERA_FLASH_MODE.torch,
  CAMERA_FLASH_MODE.on,
  CAMERA_FLASH_MODE.off,
  CAMERA_FLASH_MODE.auto
];

export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    vibrate: PropTypes.bool,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    cameraType: PropTypes.oneOf(['front', 'back']),
    customMarker: PropTypes.element,
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any,
    markerStyle: PropTypes.any,
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    bottomContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    notAuthorizedView: PropTypes.element,
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    buttonPositive: PropTypes.string,
    checkAndroid6Permissions: PropTypes.bool,
    flashMode: PropTypes.oneOf(CAMERA_FLASH_MODES),
    cameraProps: PropTypes.object
  };

  static defaultProps = {
    onRead: () => console.log('QR code scanned!'),
    reactivate: false,
    vibrate: true,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    cameraType: 'back',
    notAuthorizedView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16
          }}
        >
          Camera not authorized
        </Text>
      </View>
    ),
    pendingAuthorizationView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16
          }}
        >
          ...
        </Text>
      </View>
    ),
    permissionDialogTitle: 'Info',
    permissionDialogMessage: 'Need camera permission',
    buttonPositive: 'OK',
    checkAndroid6Permissions: false,
    flashMode: CAMERA_FLASH_MODE.auto,
    cameraProps: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      fadeInOpacity: new Animated.Value(0),
      isAuthorized: false,
      isAuthorizationChecked: false,
      disableVibrationByUser: false
    };

    this._scannerTimeout = null;
    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then(cameraStatus => {
        this.setState({
          isAuthorized: cameraStatus === RESULTS.GRANTED,
          isAuthorizationChecked: true
        });
      });
    } else if (
      Platform.OS === 'android' &&
      this.props.checkAndroid6Permissions
    ) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: this.props.permissionDialogTitle,
        message: this.props.permissionDialogMessage
      }).then(granted => {
        const isAuthorized = granted === PermissionsAndroid.RESULTS.GRANTED;

        this.setState({ isAuthorized, isAuthorizationChecked: true });
      });
    } else {
      this.setState({ isAuthorized: true, isAuthorizationChecked: true });
    }

    if (this.props.fadeIn) {
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(this.state.fadeInOpacity, {
          toValue: 1,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ]).start();
    }
  }

  componentWillUnmount() {
    if (this._scannerTimeout !== null) {
      clearTimeout(this._scannerTimeout);
    }
    this._scannerTimeout = null;
  }

  disable() {
    this.setState({ disableVibrationByUser: true });
  }
  enable() {
    this.setState({ disableVibrationByUser: false });
  }

  _setScanning(value) {
    this.setState({ scanning: value });
  }

  _handleBarCodeRead(e) {
    if (!this.state.scanning && !this.state.disableVibrationByUser) {
      if (this.props.vibrate) {
        Vibration.vibrate();
      }
      this._setScanning(true);
      this.props.onRead(e);
      if (this.props.reactivate) {
        this._scannerTimeout = setTimeout(
          () => this._setScanning(false),
          this.props.reactivateTimeout
        );
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
            <View
              style={[
                styles.rectangle,
                this.props.markerStyle ? this.props.markerStyle : null
              ]}
            />
          </View>
        );
      }
    }
    return null;
  }

  _renderCameraComponent() {
    return (
      <Camera
        androidCameraPermissionOptions={{
          title: this.props.permissionDialogTitle,
          message: this.props.permissionDialogMessage,
          buttonPositive: this.props.buttonPositive
        }}
        style={[styles.camera, this.props.cameraStyle]}
        onBarCodeRead={this._handleBarCodeRead.bind(this)}
        type={this.props.cameraType}
        flashMode={this.props.flashMode}
        captureAudio={false}
        {...this.props.cameraProps}
      >
          <View style={{flex:0.8,backgroundColor:"rgba(0, 0, 0, 0.5)",width:Dimensions.get("window").width}}>
          </View>

        {this._renderCameraMarker()}

          <View style={{flex:1.5,backgroundColor:"rgba(0, 0, 0, 0.5)",width:Dimensions.get("window").width}}>
          </View>

      </Camera>
    );
  }

  _renderCamera() {
    const {
      notAuthorizedView,
      pendingAuthorizationView,
      cameraType
    } = this.props;
    const { isAuthorized, isAuthorizationChecked } = this.state;
    if (isAuthorized) {
      if (this.props.fadeIn) {
        return (
          <Animated.View
            style={{
              opacity: this.state.fadeInOpacity,
              backgroundColor: 'transparent',
              height: styles.camera.height
            }}
          >
            {this._renderCameraComponent()}
          </Animated.View>
        );
      }
      return this._renderCameraComponent();
    } else if (!isAuthorizationChecked) {
      return pendingAuthorizationView;
    } else {
      return notAuthorizedView;
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
    );
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
    width: Dimensions.get('window').width
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  }
});
