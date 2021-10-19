/* Type definitions for react-native-qrcode-scanner 1.5.0
 * Definitions by: Jan Hesters <https://github.com/janhesters/>
 * Updated by: Abdullah Hilson <https://github.com/abumalick/>
 * If you modify this file, put your GitHub info here as well (for easy contacting purposes)
 */
import { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { RNCameraProps, BarCodeReadEvent, Constants } from 'react-native-camera';

export interface RNQRCodeScannerProps {
  onRead(e: BarCodeReadEvent): void;
  vibrate?: boolean;
  reactivate?: boolean;
  reactivateTimeout?: number;
  fadeIn?: boolean;
  showMarker?: boolean;
  cameraType?: 'front' | 'back';
  customMarker?: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  cameraStyle?: StyleProp<ViewStyle>;
  cameraContainerStyle?: StyleProp<ViewStyle>;
  markerStyle?: StyleProp<ViewStyle>;
  topViewStyle?: StyleProp<ViewStyle>;
  bottomViewStyle?: StyleProp<ViewStyle>;
  topContent?: JSX.Element | string;
  bottomContent?: JSX.Element | string;
  notAuthorizedView?: JSX.Element;
  permissionDialogTitle?: string;
  permissionDialogMessage?: string;
  buttonPositive?: string;
  checkAndroid6Permissions?: boolean;
  flashMode?: keyof Constants['FlashMode'];
  cameraProps?: RNCameraProps;
  cameraTimeout?: number;
  cameraTimeoutView?: JSX.Element;
}

export interface RNQRCodeScannerState {
  readonly scanning: boolean;
  readonly fadeInOpacity: any;
  readonly isAuthorized: boolean;
  readonly isAuthorizationChecked: boolean;
  readonly disableVibrationByUser: boolean;
}

export default class QRCodeScanner extends Component<
  RNQRCodeScannerProps,
  RNQRCodeScannerState
> {
  disable(): void;
  enable(): void;
  _setScanning(value: boolean): void;
  _handleBarCodeRead(e: BarCodeReadEvent): void;
  _renderTopContent(): JSX.Element | null;
  _renderBottomContent(): JSX.Element | null;
  _renderCameraMarker(): JSX.Element | null;
  _renderCameraComponent(): JSX.Element | null;
  _renderCamera(): JSX.Element;
  reactivate(): void;
}
