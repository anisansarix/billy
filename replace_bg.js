const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/app').concat(walk('src/components'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    let newContent = content.replace(/style=\{\{\s*flex:\s*1,\s*backgroundColor:\s*['"]#(f1f1f1|f8fafc|FAFAFA)['"]\s*\}\}/g, 'className="flex-1 bg-slate-50"');
    newContent = newContent.replace(/style=\{\{\s*flex:\s*1,\s*backgroundColor:\s*['"]white['"]\s*\}\}/g, 'className="flex-1 bg-white"');
    
    newContent = newContent.replace(/style=\{\{\s*flex:\s*1,\s*backgroundColor:\s*['"]#(f1f1f1|f8fafc|FAFAFA)['"],\s*justifyContent:\s*['"]center['"],\s*alignItems:\s*['"]center['"]\s*\}\}/g, 'className="flex-1 justify-center items-center bg-slate-50"');
    newContent = newContent.replace(/style=\{\{\s*flex:\s*1,\s*backgroundColor:\s*['"]white['"],\s*justifyContent:\s*['"]center['"],\s*alignItems:\s*['"]center['"]\s*\}\}/g, 'className="flex-1 justify-center items-center bg-white"');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated', file);
    }
});
