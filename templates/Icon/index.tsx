import { createElement, forwardRef, useMemo } from "react";
import { IconProps, PathAttr } from "./Icon.types";
import iconSet from "../../assets/icons/config.json";

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, color, style, ...svgProps }, forwardedRef) => {
    const currentIcon = useMemo(() => iconSet[name].icon, [name]);
    const svgDefaultStyles = useMemo(
      () => ({
        width: size,
        height: size,
        display: "inline-block",
        stroke: "currentColor",
        fill: "currentColor",
        ...style,
      }),
      [style, size]
    );

    if (!currentIcon) return null;

    const { width = "1024" } = currentIcon;

    const viewBox = `0 0 ${width} 1024`;

    const children = currentIcon.paths.map((path, index) => {
      const attrs = currentIcon.attrs?.[index] as PathAttr;

      let isColorful = name.includes("colorful");

      const pathProps = {
        d: path,
        key: path + index,
        ...attrs,
        fill: isColorful ? attrs?.fill : color ?? attrs?.fill ?? "currentColor",
      };

      return createElement("path", pathProps);
    });

    return (
      <svg
        {...svgProps}
        style={svgDefaultStyles}
        viewBox={viewBox}
        ref={forwardedRef}
      >
        {children}
      </svg>
    );
  }
);

export default Icon;
