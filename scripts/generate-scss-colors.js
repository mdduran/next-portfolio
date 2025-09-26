/*
  Generates src/styles/_colors.scss from src/styles/colors.json.
  Ensures SCSS and global CSS variables can use the same color values as the JS MUI theme.
*/
const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../src/styles/colors.json');
const scssPath = path.resolve(__dirname, '../src/styles/_colors.scss');

function run() {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const colors = JSON.parse(raw);

  const lines = [];
  lines.push('/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. */');
  lines.push('/* Source: src/styles/colors.json */');
  lines.push('');

  // Named color variables
  Object.entries(colors).forEach(([name, value]) => {
    lines.push(`$${name}: ${value};`);
  });
  lines.push('');

  // Map of all named colors
  lines.push('$colors: (');
  Object.keys(colors).forEach((name, idx, arr) => {
    const comma = idx === arr.length - 1 ? '' : ',';
    lines.push(`  ${name}: $${name}${comma}`);
  });
  lines.push(');');
  lines.push('');

  // Palette variables (mirrors src/styles/theme.js)
  const palette = {
    primary: { light: 'zomp', main: 'castletonGreen', dark: 'phthaloGreen' },
    secondary: { light: 'cadetBlue', main: 'feldgrau', dark: 'outerSpaceCrayola' },
    error: { light: 'puce', main: 'popstar', dark: 'solidPink' },
    success: { light: 'caribbeanGreen', main: 'spanishViridian', dark: 'tropicalRainforest' },
    warning: { light: 'queenPink', main: 'tuscany', dark: 'roseDust' },
    info: { light: 'rocketMetallic', main: 'deepTaupe', dark: 'blackCoffee' },
    header: { light: 'zomp', main: 'white', dark: 'black' }
  };

  Object.entries(palette).forEach(([group, tones]) => {
    Object.entries(tones).forEach(([tone, name]) => {
      lines.push(`$color-${group}-${tone}: $${name};`);
    });
  });
  lines.push('');

  // Export a map of palette colors as well
  lines.push('$palette: (');
  Object.entries(palette).forEach(([group, tones], gi, ga) => {
    const commaG = gi === ga.length - 1 ? '' : ',';
    lines.push(`  ${group}: (`);
    Object.entries(tones).forEach(([tone, name], ti, ta) => {
      const commaT = ti === ta.length - 1 ? '' : ',';
      lines.push(`    ${tone}: $${name}${commaT}`);
    });
    lines.push(`  )${commaG}`);
  });
  lines.push(');');
  lines.push('');

  // CSS custom properties for global usage in styles via var(--color-...)
  lines.push(':root {');
  Object.entries(palette).forEach(([group, tones]) => {
    Object.entries(tones).forEach(([tone, name]) => {
      lines.push(`  --color-${group}-${tone}: #{$${name}};`);
    });
  });
  lines.push('}');
  lines.push('');

  // Helper function to get a named color by key
  lines.push('@function color($key) {');
  lines.push('  @return map-get($colors, $key);');
  lines.push('}');
  lines.push('');

  fs.writeFileSync(scssPath, lines.join('\n'));
  // eslint-disable-next-line no-console
  console.log(`Generated ${path.relative(process.cwd(), scssPath)}`);
}

run();
