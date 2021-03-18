// 'use strict';

import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';


const ScanQRCodeScreen = () => {
  const [qrcodeGetData, setQRCodeGetData] = useState(null);
  
  useEffect(() => {
  },[qrcodeGetData]);
  
  onSuccess = (e) => {
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );  
    setQRCodeGetData(e.data);
  }

  console.log(`AFTER setQRCodeGetData ${qrcodeGetData}`);

  return (
    <QRCodeScanner
      onRead={onSuccess}   
      reactivate={true}
      reactivateTimeout={3000}     
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
          <Text style={styles.buttonText}>QRCode data: {qrcodeGetData}</Text>
        </TouchableOpacity>
      }
    />
  );
}
export default ScanQRCodeScreen;

const styles = StyleSheet.create({
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
    textAlign: 'center',
  },
  buttonTouchable: {
    padding: 16,
  },
});
