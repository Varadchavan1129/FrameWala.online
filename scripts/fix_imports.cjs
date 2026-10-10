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

// AdminApp.jsx
replaceInFile(path.join(__dirname, 'src', 'AdminApp.jsx'), [
  [/'.\/routes\/AdminRoutes\.jsx'/g, "'./admin/routes/AdminRoutes.jsx'"],
  [/'.\/context\/AdminAuthContext\.jsx'/g, "'./admin/context/AdminAuthContext.jsx'"]
]);

// AdminRoutes.jsx
replaceInFile(path.join(__dirname, 'src', 'admin', 'routes', 'AdminRoutes.jsx'), [
  [/\.\.\/pages\/admin\//g, '../pages/']
]);

// AdminLayout.jsx
replaceInFile(path.join(__dirname, 'src', 'admin', 'layouts', 'AdminLayout.jsx'), [
  [/\.\.\/components\/admin\/Sidebar\.jsx/g, '../components/Sidebar.jsx']
]);

// Pages
const pagesDir = path.join(__dirname, 'src', 'admin', 'pages');
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    replaceInFile(path.join(pagesDir, file), [
      [/\.\.\/\.\.\/context\/AdminAuthContext\.jsx/g, '../../admin/context/AdminAuthContext.jsx'],
      [/\.\.\/\.\.\/context\/AuthContext\.jsx/g, '../../context/AuthContext.jsx'],
      [/\.\.\/\.\.\/services\/(.*?)/g, '../../services/$1'],
      // wait, pages are in src/admin/pages. So going up two levels reaches src/. 
      // If they had ../../services/authService, it stays ../../services/authService.js, unless we move them.
    ]);
  }
});
