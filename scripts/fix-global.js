const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');
const compDir = path.join(__dirname, 'src', 'components');

function replaceInDir(dir, replacements) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath, replacements);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      replacements.forEach(({ from, to }) => {
        if (content.includes(from)) {
          content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

// In app/, files were moved 1 level deeper. So ../../../ becomes ../../../../
replaceInDir(appDir, [
  { from: '../../../global.css', to: '../../../../global.css' },
  { from: '../../../constants/', to: '../../../../constants/' }
]);

// In components/, files were moved 1 level deeper. So ../../ becomes ../../../
replaceInDir(compDir, [
  { from: '../../global.css', to: '../../../global.css' },
  { from: '../../constants/', to: '../../../constants/' }
]);

console.log('Done fixing global imports!');
