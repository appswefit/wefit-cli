const iconsList = require("../../assets/icons/config.json");
const fs = require("fs");
const path = require("path");

const iconNames = Object.keys(iconsList).map((icon) => {
  return `"${icon}"`;
});

const type =
  "type IconNames = " +
  iconNames.toString().replace(/,/g, " | ") +
  ";" +
  "\n export default IconNames;";

const filePath = path.resolve(__dirname, "IconNames.ts");

fs.writeFile(filePath, type, () => {
  console.log("Arquivo criado com sucesso");
});
