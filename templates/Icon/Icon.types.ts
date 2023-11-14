import iconSet from "./IconNames";

export type IconNames = iconSet;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconNames;
  size?: number;
  notification?: string;
}

export interface IIconStylesProps {
  size?: number;
}

export interface PathAttr {
  fill?: string;
}
