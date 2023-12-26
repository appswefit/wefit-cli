import { createElement, forwardRef, useMemo } from "react";
import { IconProps, PathAttr } from "./Icon.types";
import iconSet from "../../assets/icons/config.json";
import {
  IconNotification,
  NotificationContainer,
  StyledSvg,
} from "./Icon.styles";

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, color, notification, ...svgProps }, forwardedRef) => {
    const currentIcon = useMemo(() => iconSet[name]?.icon, [name]);

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

    if (notification) {
      return (
        <NotificationContainer>
          <IconNotification>{notification}</IconNotification>
          <StyledSvg
            {...svgProps}
            size={size}
            viewBox={viewBox}
            ref={forwardedRef}
            fill="none"
          >
            {children}
          </StyledSvg>
        </NotificationContainer>
      );
    }

    return (
      <StyledSvg
        {...svgProps}
        size={size}
        viewBox={viewBox}
        ref={forwardedRef}
        fill="none"
      >
        {children}
      </StyledSvg>
    );
  }
);

export default Icon;
