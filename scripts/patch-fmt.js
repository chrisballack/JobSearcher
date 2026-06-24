// scripts/patch-fmt.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filePath = path.join(__dirname, '../ios/Pods/fmt/include/fmt/base.h');

if (!fs.existsSync(filePath)) {
  console.log('base.h not found. Run `npx expo prebuild` first.');
  process.exit(1);
}

// Hacer el archivo escribible (CocoaPods los pone como solo lectura)
try {
  execSync(`chmod u+w "${filePath}"`);
} catch (e) {
  console.log('No se pudo cambiar permisos, intentando continuar...');
}

let content = fs.readFileSync(filePath, 'utf8');
const originalContent = content;

// Reemplazar consteval por constexpr
content = content.replace(
  /#\s+define\s+FMT_CONSTEVAL\s+consteval/g,
  '#  define FMT_CONSTEVAL constexpr'
);

if (content !== originalContent) {
  fs.writeFileSync(filePath, content);
  console.log('Patched fmt/base.h: consteval → constexpr');
} else {
  console.log('fmt/base.h already patched');
}