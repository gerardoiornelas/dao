require('colors');
const fs = require('fs');
const templatesSrc = require('./ssComponentTemplates');

const componentName = process.argv[2];
const componentType = process.argv[3] || 'components';

const componentDirectory = `./src/components/${componentType}`;
const componentDirFile = `./src/components/${componentType}/${componentName}`;
const generatedSrcTemplates = templatesSrc.map((template) => template(componentName));

if (!componentName) {
  console.error('Please supply a valid component name'.red);
  process.exit(1);
}

console.log('Creating Component w/ScreenSmith of name: ' + componentName.blue);

if (fs.existsSync(componentDirFile)) {
  console.error(`Component ${componentName} already exists in that directory.`.red);
  process.exit(1);
}

generatedSrcTemplates.forEach((template) => {
  fs.writeFileSync(`${componentDirectory}/${componentName}${template.extension}`, template.content);
});

console.log('Successfully created Component w/ScreenSmith under: ' + componentDirectory.green);
