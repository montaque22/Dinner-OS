const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');
const cssDir = path.join(buildPath, 'static', 'css');

const cssFile = fs.readdirSync(cssDir).find(file => file.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(cssDir, cssFile), 'utf8');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove the <link rel="stylesheet" ... /> tag
html = html.replace(
    /<link href=".*?\.css" rel="stylesheet">/,
    `<style>${cssContent}</style>`
);

// Save the new index.html
fs.writeFileSync(indexPath, html);

console.log('✅ CSS successfully inlined into index.html');
