const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
};

const root = path.join(__dirname, 'src');

const fixes = [
  // Shared component imports (from old ../../components/common/)
  ["from '../../components/common/Button.jsx'", "from '../components/common/Button.jsx'"],
  ["from '../../components/common/Loader.jsx'", "from '../components/common/Loader.jsx'"],

  // Admin context cross-references
  ["from '../../context/AdminAuthContext.jsx'", "from '../context/AdminAuthContext.jsx'"],
  ["from '../../admin/context/AdminAuthContext.jsx'", "from '../context/AdminAuthContext.jsx'"],

  // Old admin services path cross-references
  ["from '../../services/productService.js'", "from '../services/productService.js'"],
  ["from '../../services/categoryService.js'", "from '../services/categoryService.js'"],
  ["from '../../services/orderService.js'", "from '../services/orderService.js'"],
  ["from '../../services/reviewService.js'", "from '../services/reviewService.js'"],
  ["from '../../services/authService.js'", "from '../services/authService.js'"],
  ["from '../../services/wishlistService.js'", "from '../services/wishlistService.js'"],

  // Navigate paths - update /admin/login → /login
  ["to=\"/admin/login\"", "to=\"/login\""],
  ["to='/admin/login'", "to='/login'"],
  ["href=\"/admin/login\"", "href=\"/login\""],
  ["/admin/dashboard", "/dashboard"],
  ["/admin/products", "/products"],
  ["/admin/categories", "/categories"],
  ["/admin/orders", "/orders"],
  ["/admin/customers", "/customers"],
  ["/admin/inventory", "/inventory"],
  ["/admin/reviews", "/reviews"],

  // Fix api import inside services (adminApi is local now)
  ["from './api.js'", "from './adminApi.js'"],
  ["from '../services/api.js'", "from './adminApi.js'"],
];

const walkDir = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walkDir(full);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      replaceInFile(full, fixes);
    }
  });
};

walkDir(root);
console.log('Done!');
