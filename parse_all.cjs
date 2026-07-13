const fs = require('fs');
const svg = fs.readFileSync('public/svg/4.svg', 'utf8');

const regex = /<([^>]+)>/g;
let match;
while ((match = regex.exec(svg)) !== null) {
  const tag = match[1];
  if (tag.includes('rx="10"') || tag.includes('rx="6"')) {
     console.log(tag);
  }
}
