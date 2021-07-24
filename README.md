# react-native-qrcode-scanner

[![npm version](https://badge.fury.io/js/react-native-qrcode-scanner.svg)](https://badge.fury.io/js/react-native-qrcode-scanner) [![Backers on Open Collective](https://opencollective.com/react-native-qrcode-scanner/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/react-native-qrcode-scanner/sponsors/badge.svg)](#sponsors)

A QR code scanner component for React Native built on top of [react-native-camera by Lochlan Wansbrough](https://github.com/lwansbrough/react-native-camera)

Please note, this will also function as a generic barcode scanner by the virtue of the above module supporting barcode scanning, however, this module was initially built as a QR code scanner.

This module was originally written because the author couldn't find a module that could be simply plugged into a project without requiring too much setup.

Looking for active contributors. See [Contribution guide](https://github.com/moaazsidat/react-native-qrcode-scanner/blob/master/CONTRIBUTION.md) for more details.

_**Please note**: Most of the support on debugging new issues, especially with Android, relies on the open source community. The project is on the look out for active contributors who want to maintain this library more rigorously._

## Getting started

### Requirements

#### iOS 10

With iOS 10 and higher you need to add the "Privacy - Camera Usage Description" key to the info.plist of your project. This should be found in 'your_project/ios/your_project/Info.plist'. Add the following code:

```
<key>NSCameraUsageDescription</key>
<string>Your message to user when the camera is accessed for the first time</string>

<!-- Include this only if you are planning to use the camera roll -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Your message to user when the photo library is accessed for the first time</string>

<!-- Include this only if you are planning to use the microphone for video recording -->
<key>NSMicrophoneUsageDescription</key>
<string>Your message to user when the microsphone is accessed for the first time</string>
```

#### Android 7

With Android 7 and higher you need to add the "Vibration" permission to your AndroidManifest.xml of your project. This should be found in your `android/app/src/main/AndroidManifest.xml` Add the following:

```
<uses-permission android:name="android.permission.VIBRATE"/>
```
You need to add the "missingDimensionStrategy" config for the 'react-native-camera' setting  to 'general', this should be found in your `android/app/build.gradle` add the following:
```
android {
  ...
  defaultConfig {
    ...
    missingDimensionStrategy 'react-native-camera', 'general' <-- insert this line
  }
}
```

#### react-native-camera

[react-native-camera](https://github.com/lwansbrough/react-native-camera) is a dependency for this package that you'll need to add to your project. To install, run the following commands:

1. `npm install react-native-camera --save`
2. `react-native link react-native-camera`

#### New Version/Migration

If using an older version of this module with RCTCamera you will need to follow the docs [here](https://github.com/react-native-community/react-native-camera/blob/master/docs/migration.md) to move from the old RCTCamera to the new RNCamera. You will then need to install it as above.

**Versions of this library > 0.0.30 will not support react-native-camera versions less than 1.0.0.**

### To install and start using react-native-qrcode-scanner:

1. `npm install react-native-qrcode-scanner --save`
2. `react-native link react-native-qrcode-scanner`

#### react-native-permissions

You will also need to install react-native-permissions to handle camera related permissions

1. `npm install react-native-permissions --save`
2. `react-native link react-native-permissions`

For iOS, as part of the [react-native-permissions setup](https://github.com/react-native-community/react-native-permissions#setup) you will need to add the following code to your `Podfile`

```
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
```

You may also need to reset your simulator data after adding those permissions `Device -> Erase All Content and Settings...`

## Usage

To use react-native-qrcode-scanner, `import` the `react-native-qrcode-scanner` module and use the `<QRCodeScanner />` tag. More usage examples can be seen under the `examples/` folder.

Here is an example of basic usage:

```js
'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class ScanScreen extends Component {
  onSuccess = e => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            Go to{' '}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

AppRegistry.registerComponent('default', () => ScanScreen);
```

Screenshot of the above:

![screenshot 2017-05-02 15 06 33](https://cloud.githubusercontent.com/assets/5963656/25634528/fae4290a-2f48-11e7-899d-4c91ea079678.png)

Please open an issue if something doesn't work or is not clear enough.

## Methods

#### `reactivate()`

Call this method to programmatically enabling scanning again. Use this by attaching a `ref` like so `<QRCodeScanner ref={(node) => { this.scanner = node }}>` and calling `this.scanner.reactivate()`

## Props

#### `onRead` (required)

propType: `func.isRequired`
default: `(e) => (console.log('QR code scanned!', e))`

Will call this specified method when a QR code or a barcode is detected in the camera's view passing in the event emitted upon reading the code.

#### `fadeIn`

propType: `bool`
default: `true`

When set to `true` this ensures that the camera view fades in after the initial load up instead of being rendered immediately.
Set this to false to prevent the animated fade in of the camera view.

#### `reactivate`

propType: `bool`
default: `false`

When set to `false`, when a QR code is scanned, the `QRCodeScanner` will not scan another code until it is re-rendered.
When set to `true` this will reactivate the scanning ability of the component.

#### `reactivateTimeout`

propType: `number`
default: `0`

Use this to configure how long it should take (in milliseconds) before the `QRCodeScanner` should reactivate.


#### `cameraTimeout`
propType: `number`
default: `0`

Use this to configure how long it should take (in milliseconds) before the `QRCodeScanner` should be displayed. After that the camera will be inactive and press the view to reactivate it.
The `0` default means it's always on.

#### `cameraTimeoutView`

propType: `element`

Pass an RN element/component to show it when the camera is inactive for `cameraTimeout` (another prop) milliseconds. If the `cameraTimeout` is 0 or not specified, this prop will never be used.

#### `flashMode`

propType: `RNCamera.Constants.FlashMode`
default: `RNCamera.Constants.FlashMode.auto`

**Flash modes**

FYI: [react-native-camera/flashMode](https://github.com/react-native-community/react-native-camera/blob/master/docs/RNCamera.md#flashmode)

- `RNCamera.Constants.FlashMode.off` turns it off.
- `RNCamera.Constants.FlashMode.on` means camera will use flash in all photos taken.
- `RNCamera.Constants.FlashMode.auto` leaves your phone to decide when to use flash when taking photos, based on the lightning conditions that the camera observes.
- `RNCamera.Constants.FlashMode.torch` turns on torch mode, meaning the flash light will be turned on all the time (even before taking photo) just like a flashlight.


#### `topContent`

propType: `oneOfType([ PropTypes.element, PropTypes.string, ])`

Use this to render any additional content at the top of the camera view.

#### `bottomContent`

propType: `oneOfType([ PropTypes.element, PropTypes.string, ])`

Use this to render any additional content at the bottom of the camera view.

#### `containerStyle`

propType: `any`

Use this to pass styling for the outermost container. Useful for adding margin/padding to account for navigation bar.

#### `cameraStyle`

propType: `any`

Use this to pass or overwrite styling for the camera window rendered.

#### `cameraContainerStyle`

propType: `any`

Use this to pass or overwrite styling for the camera container (view) window rendered.

#### `topViewStyle`

propType: `any`

Use this to pass or overwrite styling for the `<View>` that contains the `topContent` prop.

#### `bottomViewStyle`

propType: `any`

Use this to pass or overwrite styling for the `<View>` that contains the `bottomContent` prop.

#### `showMarker`

propType: `boolean`
default: `false`

Use this to show marker on the camera scanning window.

#### `customMarker`

propType: `element`

Pass a RN element/component to use it as a custom marker.

#### `markerStyle`

propType: `any`

Use this to add custom styling to the default marker.

#### `notAuthorizedView`

propType: `element`

Pass a RN element/component to use it when no permissions given to the camera (iOS only).

#### `cameraType`

propType: `oneOf(['front', 'back'])`
default: `'back'`

Use this to control which camera to use for scanning QR codes, defaults to rear camera.

#### `checkAndroid6Permissions`

propType: `bool`
default: `false`

Use this to enable permission checking on Android 6

#### `permissionDialogTitle`

propType: `string`
default: `'Info'`

Use this to set permission dialog title (Android only).

#### `permissionDialogMessage`

propType: `string`
default: `'Need camera permission'`

Use this to set permission dialog message (Android only).

#### `buttonPositive`

propType: `string`
default: `'OK'`

Use this to set permission dialog button text (Android only).

#### `cameraProps`

propType: `object`

Properties to be passed to the `Camera` component.

<!--## Contriubting-->
<!--See [CONTRIBUTING.md](CONTRIBUTING.md)-->

## Contributors

This project exists thanks to all the people who contribute. We're immensely gratetful to everyone who has taken the time to submit pull requests, spent time debugging or filing issues.

<a href="https://github.com/moaazsidat/react-native-qrcode-scanner/graphs/contributors"><img src="https://opencollective.com/react-native-qrcode-scanner/contributors.svg?width=890&button=false" /></a>

## Backers & Sponsors

Most of the core contributors maintain this library, add new features, and review PRs in their free time. If you're using react-native-qrcode-scanner in a commercial app, or have found it to be valuable, [please considering backing or sponsoring the project on OpenCollective](https://opencollective.com/react-native-qrcode-scanner). Please note that you do not need to give any amount of money in order to use this library.

This is how the donations will be used:

- Allow the core contributors to work on react-native-qrcode-scanner
- Thank contributors if they invested a large amount of time in contributing
- Setup a contributor bounty program to encourage participation
- Fees for money handling

Thank you to all our backers & sponsors! 🙏

[[Become a backer](https://opencollective.com/react-native-qrcode-scanner#backer)] [[Become a sponsor](https://opencollective.com/react-native-qrcode-scanner#sponsor)]

<a href="https://opencollective.com/react-native-qrcode-scanner#backers" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/backers.svg?width=890"></a>

Support this project by becoming a sponsor. Your logo will show up here with a link to your website.

<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/0/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/1/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/2/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/3/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/4/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/5/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/6/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/7/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/8/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/react-native-qrcode-scanner/sponsor/9/website" target="_blank"><img src="https://opencollective.com/react-native-qrcode-scanner/sponsor/9/avatar.svg"></a>

## License

See [LICENSE.md](LICENSE.md)

## Thanks

Thanks to [Lochlan Wansbrough](https://github.com/lwansbrough) for the [react-native-camera module](https://github.com/lwansbrough/react-native-camera) which provided me with an awesome example of how to set up this module.

This QR code scanner was inspired by the QR code scanner within [Whatsapp](https://www.whatsapp.com/).
