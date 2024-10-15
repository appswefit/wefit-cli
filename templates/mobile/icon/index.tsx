import Svg, { Path } from 'react-native-svg';
import iconSet from "../../assets/icons/config.json";
import { IconProps } from './icon.types';
import { useMemo } from "react";

const NewIcon = ({ name, size = 24, color }: IconProps) => {
  const icon = useMemo(() => iconSet[name]?.icon, [name]);

  if (!icon) return null;

  const haveColorfulInName = name.includes('colorful');

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${icon.width} ${icon.width}`}
    >
      {icon.paths.map((d, index) => (
        <Path key={index} d={d} fill={!haveColorfulInName && !!color ? color : icon.attrs[index].fill} />
      ))}
    </Svg>
  );
};

export default NewIcon;