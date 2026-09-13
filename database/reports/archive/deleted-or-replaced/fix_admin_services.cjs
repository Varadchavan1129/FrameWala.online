const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(([regex, replacement]) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
};

// 1. Update the components in src/admin/pages to use local admin services
const pagesDir = path.join(__dirname, 'src', 'admin', 'pages');
if (fs.existsSync(pagesDir)) {
  fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.jsx')) {
      replaceInFile(path.join(pagesDir, file), [
        [/\.\.\/\.\.\/services\//g, '../services/']
      ]);
    }
  });
}

// 2. Update context in src/admin/context
const contextDir = path.join(__dirname, 'src', 'admin', 'context');
if (fs.existsSync(contextDir)) {
  fs.readdirSync(contextDir).forEach(file => {
    if (file.endsWith('.jsx')) {
      replaceInFile(path.join(contextDir, file), [
        [/\.\.\/\.\.\/services\//g, '../services/']
      ]);
    }
  });
}

// 3. Update all services in src/admin/services to use adminApi
const servicesDir = path.join(__dirname, 'src', 'admin', 'services');
if (fs.existsSync(servicesDir)) {
  fs.readdirSync(servicesDir).forEach(file => {
    if (file.endsWith('.js') && file !== 'adminApi.js') {
      replaceInFile(path.join(servicesDir, file), [
        [/import api from '\.\/api\.js';/g, "import api from './adminApi.js';"],
        [/import \{ api \} from '\.\/api\.js';/g, "import api from './adminApi.js';"]
      ]);
    }
  });
}
