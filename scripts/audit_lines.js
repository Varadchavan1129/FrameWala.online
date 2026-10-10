const { execSync } = require('child_process');
const fs = require('fs');

const files = execSync('git ls-files').toString().trim().split('\n');
const results = [];

for (const file of files) {
  if (!file) continue;
  if (!fs.existsSync(file)) continue;
  
  try {
    const stats = fs.statSync(file);
    if (stats.isDirectory() || stats.size === 0) continue;
    
    // Fast line counting using buffer
    const buffer = fs.readFileSync(file);
    let lines = 0;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 10) lines++; // newline
    }
    results.push({ file, lines, size: stats.size });
  } catch (e) {
    // Ignore permissions/read errors
  }
}

console.log('Top 15 files by SIZE:');
results.sort((a, b) => b.size - a.size);
results.slice(0, 15).forEach(r => console.log(`${Math.round(r.size/1024)} KB - ${r.file}`));

console.log('\nTop 15 files by line count:');
results.sort((a, b) => b.lines - a.lines);
results.slice(0, 15).forEach(r => console.log(`${r.lines} lines (${Math.round(r.size/1024)} KB) - ${r.file}`));

const over10k = results.filter(r => r.lines > 10000);
console.log('\nFiles over 10k lines:', over10k.length);

const over50k = results.filter(r => r.lines > 50000);
console.log('\nFiles over 50k lines:', over50k.length);

const totalLines = results.reduce((acc, r) => acc + r.lines, 0);
console.log('\nTotal lines in tracked files:', totalLines);
