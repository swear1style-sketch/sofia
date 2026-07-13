const fs = require('fs');

let content = fs.readFileSync('public/svg/0.svg', 'utf8');

// Remove the rect covers I added earlier
content = content.replace(/<!-- Left margin cover[\s\S]*?<rect[^>]*\/>\n/g, '');
content = content.replace(/<!-- Right margin cover[\s\S]*?<rect[^>]*\/>\n/g, '');
content = content.replace(/<!-- Top-left cover[\s\S]*?<rect[^>]*\/>\n/g, '');

// Also remove any path that does NOT have stroke="black"
// We want to keep the monitor outline and other physical device lines, but delete the text paths and connector lines.
// We'll parse out all <path ... /> elements.
const regex = /<path\s+[^>]*\/>/g;
content = content.replace(regex, (match) => {
  if (match.includes('stroke="black"')) {
    return match; // Keep this one
  }
  return ''; // Delete this one
});

fs.writeFileSync('public/svg/0.svg', content, 'utf8');
console.log('Cleaned 0.svg by removing text paths and cover rects.');
