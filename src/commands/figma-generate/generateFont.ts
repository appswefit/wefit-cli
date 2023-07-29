import { Node } from "../../infra/http/figmaClient.types";

interface Typography {
  fontSize: number;
  fontWeight: number;
}

const positions = {
  fontFamily: 0,
};

function parseTypographyToCss(typography: Record<string, Typography>) {
  let css = "";
  Object.entries(typography).forEach((el) => {
    css =
      css +
      `\t--${el[0]}-fontSize: ${el[1].fontSize}px;\n\t--${el[0]}-fontWeight: ${el[1].fontWeight};\n`;
  });
  return css;
}

export default function generateFont(figmaNode: Node<"FRAME">) {
  const fontFamilyNode = figmaNode.children[
    positions.fontFamily
  ] as Node<"TEXT">;

  const typography: Record<string, Typography> = {};

  (figmaNode.children as Node<"TEXT">[]).forEach((fontNode, index) => {
    if (index === positions.fontFamily) return;
    const { fontSize, fontWeight } = fontNode.style;

    typography[fontNode.name] = {
      fontSize,
      fontWeight,
    };
  });

  const fontFamily = fontFamilyNode.style.fontFamily;

  const css = `\n\t/* Typography */
  \t--font-family: ${fontFamily};\n${parseTypographyToCss(typography)}
  `;

  return { css, fonts: { fontFamily, typography } };
}
