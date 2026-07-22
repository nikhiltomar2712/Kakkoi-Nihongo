// protect.js - Place this in your project root
const fs = require('fs');
const path = require('path');

console.log("🔒 Applying basic protection to index.html...\n");

// Read the original file
let content = fs.readFileSync('index.html', 'utf8');

// Basic minification + protection
content = content
  .replace(/\s+/g, ' ')                    // Remove extra whitespace
  .replace(/<!--[\s\S]*?-->/g, '')         // Remove comments
  .trim();

fs.writeFileSync('index.html', content);

console.log("✅ Protection applied!");
console.log("   • Removed comments");
console.log("   • Minified HTML");
console.log("\n⚠️  Note: This is basic protection.");
console.log("   No one can fully hide client-side code.");
