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

const controllersDir = path.join(__dirname, 'src', 'admin', 'controllers');
fs.readdirSync(controllersDir).forEach(file => {
  if (file.endsWith('.js')) {
    replaceInFile(path.join(controllersDir, file), [
      [/\.\.\/models\//g, '../../models/'],
      [/\.\.\/utils\//g, '../../utils/'],
      [/\.\.\/middleware\//g, '../../middleware/']
    ]);
  }
});

const routesDir = path.join(__dirname, 'src', 'admin', 'routes');
fs.readdirSync(routesDir).forEach(file => {
  if (file.endsWith('.js') && file !== 'index.js') {
    replaceInFile(path.join(routesDir, file), [
      [/\.\.\/middleware\/authMiddleware\.js/g, '../middleware/adminAuth.js'],
      // Now all routes are under adminAuth anyway, so we can strip authenticateToken, isAdmin from the route handlers in these files
      // to avoid double middleware. Or we can just leave it for now.
    ]);
  }
});
