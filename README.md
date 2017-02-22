# react-native-qrcode-scanner
[![npm version](https://badge.fury.io/js/react-native-qrcode-scanner.svg)](https://badge.fury.io/js/react-native-qrcode-scanner)

A QR code scanner component for React Native built on top of [react-native-camera by Lochlan Wansbrough](https://github.com/lwansbrough/react-native-camera)


Please note, this will also function as a generic barcode scanner by the virtue of the above module supporting barcode scanning, however, this module was initially built as a QR code scanner.

Please also note, this module currently supports **iOS only**. I'll be looking to setup and add Android support in the coming months.

I wrote this module because I couldn't find one that could be simply plugged into a project without requiring too much setup.


## Getting started

If you have your own react-native project now, 

install and start using react-native-qrcode-scanner:

```sh
npm install react-native-qrcode-scanner

react-native link react-native-qrcode-scanner
```

If you want to use this from sample, make clear that `react` and `react-native` is installed. (Doesn't matter if Globally or Locally)

If not, install `react` and `react-native` first.

```sh
npm install react react-native
```

To install and start using react-native-qrcode-scanner:

> Be aware that you should install this inside your react-native project.

```
npm install react-native-qrcode-scanner

react-native link react-native-qrcode-scanner

npm install rnpm

rnpm link react-native-camera

rnpm link react-native-qrcode-scanner
```

## Usage: If you start from `react-native init qrcode`

First, let's make sample project named `qrcode` with code below.

```sh
react-native init qrcode
```

Then, move to your project folder(`qrcode`), and modify `index.ios.js` file with below code:

```js
'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class qrcode extends Component {
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
            topContent: <Text style={styles.centerText}>Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.</Text>,
            bottomContent: <TouchableOpacity style={styles.buttonTouchable}><Text style={styles.buttonText}>OK. Got it!</Text></TouchableOpacity>
          }
        }}
        style={{flex: 1}}
      />
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: 3,
    padding: 32,
    width: 100,
    marginTop: 64,
    marginBottom: 64,
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
    padding: 16,
  },
});

AppRegistry.registerComponent('qrcode', () => qrcode);

```

This app won't work successfully if you are working with Virtual Device. (Camera Needed, so there'll be only black screen.)

It means you have to have Apple's Developer Sigining, which is $99/year.

And then you should change `Privacy - Camera Usage Description` at Project - Info - Custom iOS Target Properties like below.

![](https://www.dropbox.com/s/z1do1vhiqcwh7u1/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202017-02-22%2023.31.59.png?dl=1)

> This is enforced with iOS10, which is related with [Privacy Settings in ios 10](http://useyourloaf.com/blog/privacy-settings-in-ios-10/).

![](https://www.dropbox.com/s/0eegxnzw1mazhkt/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202017-02-22%2023.35.13.png?dl=1)

Then your app will work properly.

![](https://www.dropbox.com/s/r8yl87xd9e5fl9w/2017-02-22%2023.37.14.png?dl=1)

## Usage: If you already have your app
To use react-native-qrcode-scanner, `import` the `react-native-qrcode-scanner` module and use the `<QRCodeScanner />` tag.
(more examples coming soon)
```js
'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
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
            topContent: <Text style={styles.centerText}>Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.</Text>,
            bottomContent: <TouchableOpacity style={styles.buttonTouchable}><Text style={styles.buttonText}>OK. Got it!</Text></TouchableOpacity>
          }
        }}
        style={{flex: 1}}
      />
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: 3,
    padding: 32,
    width: 100,
    marginTop: 64,
    marginBottom: 64,
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
    padding: 16,
  },
});

AppRegistry.registerComponent('awesome', () => ScanScreen);
```

Screenshot of the above from the device:  

<img src="https://dl.dropboxusercontent.com/u/81686964/react-native-qrcode-scanner.jpg" width="375" border="1"/>

Please open an issue if something doesn't work or is not clear enough.



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

When set to `false`,  when a QR code is scanned, the `QRCodeScanner` will not scan another code until it is re-rendered.
When set to `true` this will reactivate the scanning ability of the component.

#### `reactivateTimeout`
propType: `number`
default: `0`

Use this to configure how long it should take before the `QRCodeScanner` should reactivate.

#### `topContent`
propType: `oneOfType([
  PropTypes.element,
  PropTypes.string,
])`

Use this to render any additional content at the top of the camera view.

#### `bottomContent`
propType: `oneOfType([
  PropTypes.element,
  PropTypes.string,
])`

Use this to render any additional content at the bottom of the camera view.

<!-- #### `showMarker` -->

<!-- #### `customMarker` -->

<!--## Contriubting-->
<!--See [CONTRIBUTING.md](CONTRIBUTING.md)-->

## Contributors 
- [Matthew Constantine](https://github.com/matthewconstantine)

## License
See [LICENSE.md](LICENSE.md)

## Thanks
Thanks to [Lochlan Wansbrough](https://github.com/lwansbrough) for the [react-native-camera module](https://github.com/lwansbrough/react-native-camera) which provided me with an awesome example of how to set up this module.

This QR code scanner was inspired by the QR code scanner within [Whatsapp](https://www.whatsapp.com/).


## Other notes

### To do
- Document other complex examples
- Fix styling to work across iOS screen sizes
- Add support for Android (Going to be doing some Android development later this year, will be taking a look at this again then)
- Add some tests
- Add support for width and height of the camera view
- Add contributing guidelines
