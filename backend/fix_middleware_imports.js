import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const routesDir = path.join(__dirname, 'src', 'admin', 'routes');
fs.readdirSync(routesDir).forEach(file => {
  if (file.endsWith('.js')) {
    replaceInFile(path.join(routesDir, file), [
      [/\.\.\/middleware\/(?!adminAuth\.js)/g, '../../middleware/']
    ]);
  }
});

const controllersDir = path.join(__dirname, 'src', 'admin', 'controllers');
fs.readdirSync(controllersDir).forEach(file => {
  if (file.endsWith('.js')) {
    replaceInFile(path.join(controllersDir, file), [
      [/\.\.\/middleware\/(?!adminAuth\.js)/g, '../../middleware/']
    ]);
  }
});
