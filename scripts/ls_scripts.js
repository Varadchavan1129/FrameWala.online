const { execSync } = require('child_process');
const fs = require('fs');
const files = execSync('git ls-files scripts').toString().trim().split('\n');
for (const file of files) {
  if (!file) continue;
  try {
    const stats = fs.statSync(file);
    console.log(`${Math.round(stats.size/1024)} KB - ${file}`);
  } catch (e) {}
}
