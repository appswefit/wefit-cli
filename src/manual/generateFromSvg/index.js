const parseSvg = require('svgps');
const fs = require('fs');
const path = require('path');


function main () {
    const regex = /<defs[^>]*>[\s\S]*?<\/defs\s*>/g;
    const iconConfig = {};
    const assestsPath = path.resolve(__dirname,'assets');

    fs.readdirSync(assestsPath).forEach(fileName => {
        const filePath = path.resolve(assestsPath, fileName);

        const fileContent = fs.readFileSync(filePath).toString();

        const [iconname] = fileName.split('.')

        console.log({fileContent, iconname})  
        const svgWithoutDefs = fileContent.replace(regex, "");

        iconConfig[iconname] = parseSvg.default(svgWithoutDefs, { template: "icomoon" });
    });

    fs.writeFileSync(path.resolve(__dirname,'result.json'),JSON.stringify(iconConfig));

}

main()