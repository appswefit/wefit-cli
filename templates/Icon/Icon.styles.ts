import styled, { css } from "styled-components";
import { IIconStylesProps } from "./Icon.types";

export const StyledSvg = styled.svg<IIconStylesProps>`
  ${({ size = 24 }) => css`
    --_size: ${size + "px"};

    width: var(--_size);
    height: var(--_size);
    display: "inline-block";
    stroke: "currentColor";
    fill: "currentColor";
  `}
`;

export const NotificationContainer = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
`;

export const IconNotification = styled.span`
  font-family: "Helvetica Neue", "Arial", "Sans-Serif";
  right: 0;
  position: absolute;
  color: white;
  background: ${({ theme }) => theme.colors.Error[50]};
  font-size: 8px;
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  filter: drop-shadow(-1px 1px 2px rgba(31, 41, 61, 0.16));
`;
