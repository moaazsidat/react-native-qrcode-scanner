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
  PermissionsAndroid,
} from 'react-native';

import Permissions from 'react-native-permissions';
import { RNCamera as Camera } from 'react-native-camera';

const PERMISSION_AUTHORIZED = 'authorized';
const CAMERA_PERMISSION = 'camera';

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
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    bottomContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    notAuthorizedView: PropTypes.element,
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    checkAndroid6Permissions: PropTypes.bool,
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
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
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
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          ...
        </Text>
      </View>
    ),
    permissionDialogTitle: 'Info',
    permissionDialogMessage: 'Need camera permission',
    checkAndroid6Permissions: false,
  };

  state = {
    scanning: false,
    fadeInOpacity: new Animated.Value(0),
    isAuthorized: false,
    isAuthorizationChecked: false,
    disableVibrationByUser: false,
  };

  componentWillMount() {
    if (Platform.OS === 'ios') {
      Permissions.request(CAMERA_PERMISSION).then(response => {
        this.setState({
          isAuthorized: response === PERMISSION_AUTHORIZED,
          isAuthorizationChecked: true,
        });
      });
    } else if (
      Platform.OS === 'android' &&
      this.props.checkAndroid6Permissions
    ) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: this.props.permissionDialogTitle,
        message: this.props.permissionDialogMessage,
      }).then(granted => {
        const isAuthorized =
          Platform.Version >= 23
            ? granted === PermissionsAndroid.RESULTS.GRANTED
            : granted === true;

        this.setState({ isAuthorized, isAuthorizationChecked: true });
      });
    } else {
      this.setState({ isAuthorized: true, isAuthorizationChecked: true });
    }
  }

  componentDidMount() {
    const { fadeIn } = this.props;
    const { fadeInOpacity } = this.state;

    if (!fadeIn) {
      return;
    }

    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        easing: Easing.inOut(Easing.quad),
      }),
    ]).start();
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

  _handleBarCodeRead = e => {
    const { vibrate, onRead, reactivate, reactivateTimeout } = this.props;
    const { scanning } = this.state;

    if (scanning) {
      return;
    }

    if (vibrate) {
      Vibration.vibrate();
    }

    this._setScanning(true);
    onRead(e);

    if (reactivate) {
      setTimeout(() => this._setScanning(false), reactivateTimeout);
    }
  };

  _renderTopContent() {
    const { topContent } = this.props;

    return topContent ? topContent : null;
  }

  _renderBottomContent() {
    const { bottomContent } = this.props;

    return bottomContent ? bottomContent : null;
  }

  _renderCameraMarker() {
    const { showMarker, customMarker } = this.props;

    if (!showMarker) {
      return null;
    }

    if (customMarker) {
      return customMarker;
    }

    return (
      <View style={styles.rectangleContainer}>
        <View style={styles.rectangle} />
      </View>
    );
  }

  _renderCamera() {
    const {
      notAuthorizedView,
      fadeIn,
      cameraStyle,
      pendingAuthorizationView,
      cameraType,
    } = this.props;
    const { isAuthorized, isAuthorizationChecked, fadeInOpacity } = this.state;

    const CameraWithMarker = (
      <Camera
        style={[styles.camera, cameraStyle]}
        onBarCodeRead={this._handleBarCodeRead}
        type={cameraType}
      >
        {this._renderCameraMarker()}
      </Camera>
    );

    if (isAuthorized) {
      if (!fadeIn) {
        return <CameraWithMarker />;
      }

      return (
        <Animated.View
          style={{
            opacity: fadeInOpacity,
            backgroundColor: 'transparent',
          }}
        >
          <CameraWithMarker />
        </Animated.View>
      );
    } else if (!isAuthorizationChecked) {
      return pendingAuthorizationView;
    }

    return notAuthorizedView;
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
    flex: 1,
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
    // It it supposed for the height to be equal to the width?
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
});
