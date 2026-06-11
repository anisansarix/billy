const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Fix store imports
      const storeRegex = /from\s+['"](?:\.\.\/)+store['"]/g;
      if (storeRegex.test(content)) {
        content = content.replace(storeRegex, 'from "@/store"');
        changed = true;
      }
      
      const storeRegex2 = /from\s+['"]\.\/store['"]/g;
      if (storeRegex2.test(content)) {
        content = content.replace(storeRegex2, 'from "@/store"');
        changed = true;
      }

      // Fix AnimatedModal relative import in DocumentBuilder
      const modalRegex = /from\s+['"]\.\/AnimatedModal['"]/g;
      if (modalRegex.test(content)) {
        content = content.replace(modalRegex, 'from "@/components/ui/AnimatedModal"');
        changed = true;
      }

      // Just to be safe, replace any other `../store`
      const anyStoreRegex = /from\s+['"]\.\.\/store['"]/g;
      if (anyStoreRegex.test(content)) {
        content = content.replace(anyStoreRegex, 'from "@/store"');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done!');
