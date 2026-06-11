const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, 'src', 'app', '(auth)');

function revertInDir(dir, replacements) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      revertInDir(fullPath, replacements);
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
        console.log(`Reverted ${fullPath}`);
      }
    }
  }
}

// Revert mistaken changes in auth
revertInDir(authDir, [
  { from: '../../../../global.css', to: '../../../global.css' },
  { from: '../../../../constants/', to: '../../../constants/' }
]);

console.log('Done reverting auth imports!');
