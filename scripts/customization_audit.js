const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files').toString().trim().split('\n');

const keywords = [
  'custom',
  'upload',
  'canvas',
  'multer',
  'preview'
];

const found = new Set();
for (const file of files) {
  if (!file) continue;
  
  // Search path/filename
  let matched = false;
  const lowerFile = file.toLowerCase();
  
  if (lowerFile.includes('customiz') || lowerFile.includes('upload') || lowerFile.includes('canvas')) {
    matched = true;
  }
  
  // If not matched by name, check contents for /api/upload/customization or product_customizations
  if (!matched && fs.existsSync(file) && !file.includes('node_modules')) {
     const content = fs.readFileSync(file, 'utf8').toLowerCase();
     if (content.includes('api/upload/customization') || 
         content.includes('product_customizations') ||
         content.includes('multer') ||
         content.includes('canvaseditor') ||
         content.includes('custom_image')) {
         matched = true;
     }
  }
  
  if (matched && !file.includes('node_modules') && !file.includes('package-lock.json')) {
    found.add(file);
  }
}

// Add specifically known files
found.add('frontend/src/pages/customer/CustomFrame.jsx');
found.add('backend/src/routes/uploadRoutes.js');
found.add('backend/src/admin/routes/uploadRoutes.js');
found.add('backend/src/models/Order.js');
found.add('backend/src/models/Cart.js');

const results = [];
let totalLines = 0;
for (const file of found) {
   if (!fs.existsSync(file)) continue;
   const buffer = fs.readFileSync(file);
   let lines = 0;
   for(let i=0; i<buffer.length; i++) if (buffer[i]===10) lines++;
   const size = fs.statSync(file).size;
   results.push({ file, lines, size });
   totalLines += lines;
}

results.sort((a,b) => b.lines - a.lines);
console.log(JSON.stringify({ results, totalLines }, null, 2));
