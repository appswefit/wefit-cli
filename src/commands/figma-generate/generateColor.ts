import { Color, Node } from "../../infra/http/figmaClient.types";

type Colors = Record<string, string>;

type ColorGroup = Record<string, Colors>;

function parseChannelColor(figmaValue: number) {
  const channelValue = Math.round(figmaValue * 255);

  return channelValue;
}

function parseFigmaRgba(figmaColor: Color) {
  return `rgba(${parseChannelColor(figmaColor.r)},${parseChannelColor(
    figmaColor.g
  )},${parseChannelColor(figmaColor.b)},${figmaColor.a})`;
}

function parseColorToCSS(colorGroups: ColorGroup) {
  let css = "";

  const groups = Object.entries(colorGroups);

  groups.forEach((group) => {
    const [groupName, groupValue] = group;
    const colors = Object.entries(groupValue);

    colors.forEach((color) => {
      const [colorName, colorValue] = color;

      css = css + `\t--${groupName}-${colorName}: ${colorValue};\n`;
    });
  });

  return css;
}

export default function generateColor(figmaNode: Node<"FRAME">) {
  const colorObj: ColorGroup = {};
  (figmaNode.children as Node<"FRAME">[]).forEach((colorGroup) => {
    if (colorGroup.name === "skip") return;

    const colorGroupName = colorGroup.name;
    const colors: Colors = {};

    (colorGroup.children as Node<"RECTANGLE">[]).forEach((color) => {
      if (!color.fills[0].color) return;

      colors[color.name] = parseFigmaRgba(color.fills[0].color);
    });

    colorObj[colorGroupName] = colors;
  });

  const css = `\t/* Colors */\n${parseColorToCSS(colorObj)}\n`;

  return { css, colors: colorObj };
}
