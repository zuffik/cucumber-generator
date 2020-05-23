const fs = require('fs');

const file = './dist/index.js';
const content = fs.readFileSync(file).toString();
fs.writeFileSync(file, '#!/usr/bin/env node\n\n' + content)
