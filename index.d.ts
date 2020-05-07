/* Type definitions for react-native-qrcode-scanner 1.1.0
 * Definitions by: Jan Hesters <https://github.com/janhesters/>
 * If you modify this file, put your GitHub info here as well (for easy contacting purposes)
 */
import { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { RNCameraProps } from 'react-native-camera';

type BarCodeType = Readonly<{
  aztec: any;
  code128: any;
  code39: any;
  code39mod43: any;
  code93: any;
  ean13: any;
  ean8: any;
  pdf417: any;
  qr: any;
  upce: any;
  interleaved2of5: any;
  itf14: any;
  datamatrix: any;
}>;

interface Point<T = number> {
  x: T;
  y: T;
}

interface Size<T = number> {
  width: T;
  height: T;
}

export interface Event {
  data: any;
  type: keyof BarCodeType;
  /**
   * @description For Android use `[Point<string>, Point<string>]`
   * @description For iOS use `{ origin: Point<string>, size: Size<string> }`
   */
  bounds:
    | [Point<string>, Point<string>]
    | { origin: Point<string>; size: Size<string> };
}

export interface RNQRCodeScannerProps {
  onRead(e: Event): void;
  vibrate?: boolean;
  reactivate?: boolean;
  reactivateTimeout?: number;
  fadeIn?: boolean;
  showMarker?: boolean;
  cameraType?: 'front' | 'back';
  customMarker?: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  cameraStyle?: StyleProp<ViewStyle>;
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
  cameraProps?: RNCameraProps;
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
  _handleBarCodeRead(e: Event): void;
  _renderTopContent(): JSX.Element | null;
  _renderBottomContent(): JSX.Element | null;
  _renderCameraMarker(): JSX.Element | null;
  _renderCameraComponent(): JSX.Element | null;
  _renderCamera(): JSX.Element;
  reactivate(): void;
}
