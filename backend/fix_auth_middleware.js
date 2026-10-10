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
      [/import \{ authenticateToken, isAdmin \} from '\.\.\/middleware\/adminAuth\.js';/g, ''],
      [/import \{ authenticateToken \} from '\.\.\/middleware\/adminAuth\.js';/g, ''],
      [/import \{ isAdmin \} from '\.\.\/middleware\/adminAuth\.js';/g, ''],
      [/authenticateToken, isAdmin, /g, ''],
      [/authenticateToken, /g, ''],
      [/isAdmin, /g, '']
    ]);
  }
});
