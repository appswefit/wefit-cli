// import iconSet from './path-to/icons/config.json';

export type IconNames = keyof typeof iconSet;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconNames;
  size?: number;
}

export interface IIconStylesProps {
  size?: number;
}

export interface PathAttr {
  fill?: string;
}
