import Svg, { Path } from 'react-native-svg';



export const SvgIconHolder = (props)=>{
    return (
        <Svg width={16} height={16} viewBox="0 0 16 16">
        <Path
          d={props.d}
          fill={props.fill} // Set the desired color here
        />
      </Svg>
    )
}