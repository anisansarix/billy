const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const appAppDir = path.join(srcDir, 'app', '(app)');
const componentsDir = path.join(srcDir, 'components');

const appGroups = {
  '(dashboard)': ['dashboard.tsx', 'reports.tsx'],
  '(sales)': ['sales.tsx', 'create-invoice.tsx', 'create-estimate.tsx', 'create-quotation.tsx', 'create-delivery-challan.tsx'],
  '(purchases)': ['expenses-purchases.tsx', 'create-purchase.tsx'],
  '(inventory)': ['products-services.tsx', 'create-stock-adjustment.tsx'],
  '(parties)': ['customers-vendors.tsx'],
  '(finance)': ['payment.tsx', 'gst-returns.tsx', 'eway-bills.tsx'],
  '(settings)': ['settings.tsx']
};

const compGroups = {
  'ui': ['Button.tsx', 'AuthInput.tsx', 'Card.tsx', 'StatCard.tsx', 'AnimatedModal.tsx', 'FloatingMenu.tsx'],
  'charts': ['AreaChart.tsx'],
  'domain': ['DocumentBuilder.tsx', 'OutstandingList.tsx']
};

// Create dirs and move files in app
Object.entries(appGroups).forEach(([group, files]) => {
  const groupDir = path.join(appAppDir, group);
  if (!fs.existsSync(groupDir)) {
    fs.mkdirSync(groupDir, { recursive: true });
  }
  files.forEach(file => {
    const oldPath = path.join(appAppDir, file);
    const newPath = path.join(groupDir, file);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved ${file} to ${group}`);
    }
  });
});

// Create dirs and move files in components
Object.entries(compGroups).forEach(([group, files]) => {
  const groupDir = path.join(componentsDir, group);
  if (!fs.existsSync(groupDir)) {
    fs.mkdirSync(groupDir, { recursive: true });
  }
  files.forEach(file => {
    const oldPath = path.join(componentsDir, file);
    const newPath = path.join(groupDir, file);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved ${file} to ${group}`);
    }
  });
});

// Update imports
const componentMap = {};
Object.entries(compGroups).forEach(([group, files]) => {
  files.forEach(file => {
    const name = file.replace('.tsx', '');
    componentMap[name] = `@/components/${group}/${name}`;
  });
});

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace any import like `../../components/X` or `@/components/X`
      Object.entries(componentMap).forEach(([compName, newImportPath]) => {
        // Regex to find `import { X } from '@/components/X'` or `import X from '../../components/X'`
        // It covers default imports, named imports, etc.
        const regex1 = new RegExp(`from\\s+['"]@/components/${compName}['"]`, 'g');
        const regex2 = new RegExp(`from\\s+['"]\\.\\./\\.\\./components/${compName}['"]`, 'g');
        const regex3 = new RegExp(`from\\s+['"]\\.\\./\\.\\./\\.\\./components/${compName}['"]`, 'g'); // if already moved
        
        if (regex1.test(content) || regex2.test(content) || regex3.test(content)) {
          content = content.replace(regex1, `from "${newImportPath}"`);
          content = content.replace(regex2, `from "${newImportPath}"`);
          content = content.replace(regex3, `from "${newImportPath}"`);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done!');
