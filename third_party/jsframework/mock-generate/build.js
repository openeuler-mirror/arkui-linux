const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');
function compileMock() {
  const mockJsPath = path.join(__dirname, '..', './runtime/main/extend/systemplugin');
  let nodeDir = '';
  if (os.platform() === 'linux') {
    nodeDir = './node-v12.18.4-linux-x64/bin/node';
  } else {
    nodeDir = './node-v12.18.4-darwin-x64/bin/node';
  }
  
  const bat = spawnSync(`${path.join(__dirname, '..', nodeDir)} ${path.join(__dirname, '..','./node_modules/typescript/bin/tsc')} && 
  ${path.join(__dirname, '..', nodeDir)} ${path.join(__dirname, 'dist')}/main.js && 
  ${path.join(__dirname, '..', nodeDir)} ${path.join(__dirname, '..', './node_modules/eslint/bin/eslint.js')} -c .eslintrc --fix ${mockJsPath}/**/*.js`, {
    cwd: __dirname,
    shell: true
  });
}

compileMock();
