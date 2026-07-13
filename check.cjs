const fs = require('fs');
const svg3 = fs.readFileSync('public/svg/3.svg', 'utf8');
const svg4 = fs.readFileSync('public/svg/4.svg', 'utf8');

console.log("3.svg size:", svg3.length);
console.log("4.svg size:", svg4.length);
