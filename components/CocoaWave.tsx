import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function CocoaWave() {
    return (
        <Svg
            width={width}
            height={height * 0.5} // Covers top half of screen
            viewBox={`0 0 ${width} ${height * 0.5}`}
            style={{ position: 'absolute', top: 0 }}
        >
            <Path
                d={`
          M0,300 
          C${width / 5},${height * 0.6} ${width * 1.},${-height * 0.1} ${width},${height * 0.4} 
          L${width},0 
          L0,0 
          Z
        `}
                fill="rgba(255,255,255,0.1)"
            />
        </Svg>
    );
}
