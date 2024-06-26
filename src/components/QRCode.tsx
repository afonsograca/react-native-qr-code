import React, {useEffect} from 'react';
import Svg, {Defs, G, Path, Rect, LinearGradient, Stop} from 'react-native-svg';
import {useQRMatrix} from '../hooks/useQRMatrix';
import {useLogo} from '../hooks/useLogo';
import {type QRCodeProps} from '../types';
import {Text} from 'react-native';

export const DEFAULT_TEST_ID = 'react-native-qrcode-composer';

export const QRCode = React.memo(
  ({
    value = 'QR code message',
    size = 100,
    logo,
    logoStyle,
    style,
    getRef,
    onError,
    testID = DEFAULT_TEST_ID,
  }: QRCodeProps) => {
    const matrixResult = useQRMatrix({value, size, ...style});
    const {
      color = 'black',
      backgroundColor = 'white',
      quietZone = 0,
      linearGradient,
      gradientDirection = ['0%', '0%', '100%', '100%'],
    } = style ?? {};
    const {logoComponent} = useLogo(size, `${testID}.logo`, logo, logoStyle);

    useEffect(() => {
      if (matrixResult.status === 'failure') {
        onError?.(matrixResult.error);
      }
    }, [matrixResult]);

    if (matrixResult.status === 'success') {
      const {path} = matrixResult.value;
      const actualSize = size + quietZone * 2;
      return (
        <Svg
          ref={getRef}
          viewBox={[-quietZone, -quietZone, actualSize, actualSize].join(' ')}
          width={actualSize}
          height={actualSize}
          testID={`${testID}.qrcode`}
        >
          {linearGradient !== undefined ? (
            <Defs>
              <LinearGradient
                id="grad"
                x1={gradientDirection[0]}
                y1={gradientDirection[1]}
                x2={gradientDirection[2]}
                y2={gradientDirection[3]}
              >
                <Stop
                  offset="0"
                  stopColor={linearGradient[0]}
                  stopOpacity="1"
                />
                <Stop
                  offset="1"
                  stopColor={linearGradient[1]}
                  stopOpacity="1"
                />
              </LinearGradient>
            </Defs>
          ) : null}
          <G>
            <Rect
              x={-quietZone}
              y={-quietZone}
              width={actualSize}
              height={actualSize}
              fill={backgroundColor}
              rx={style?.cornerRadius}
              ry={style?.cornerRadius}
            />
          </G>
          <G>
            <Path
              d={path}
              fill={linearGradient !== undefined ? 'url(#grad)' : color}
              fillRule="evenodd"
              testID={`${testID}.path`}
            />
          </G>
          {logoComponent !== null && logoComponent}
        </Svg>
      );
    }

    return onError === undefined ? (
      <Text testID={`${testID}.error`}>{matrixResult.error.message}</Text>
    ) : null;
  },
);
