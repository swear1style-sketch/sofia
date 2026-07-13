const fs = require('fs');
const svg = fs.readFileSync('public/svg/4.svg', 'utf8');

const rectRegex = /<rect[^>]+x="([^"]+)"[^>]+y="([^"]+)"[^>]+width="([^"]+)"[^>]+height="([^"]+)"/g;
let match;
const rects = [];
while ((match = rectRegex.exec(svg)) !== null) {
  rects.push({
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    width: parseFloat(match[3]),
    height: parseFloat(match[4]),
    right: parseFloat(match[1]) + parseFloat(match[3]),
    bottom: parseFloat(match[2]) + parseFloat(match[4])
  });
}

rects.sort((a, b) => (b.width * b.height) - (a.width * a.height));
console.log("Largest rects (1600x883 ViewBox assumed):");
for (let i = 0; i < 15; i++) {
  if (rects[i]) {
    console.log(`x: ${rects[i].x.toFixed(0)}, y: ${rects[i].y.toFixed(0)}, w: ${rects[i].width.toFixed(0)}, h: ${rects[i].height.toFixed(0)}, right: ${rects[i].right.toFixed(0)}, bottom: ${rects[i].bottom.toFixed(0)}`);
  }
}
