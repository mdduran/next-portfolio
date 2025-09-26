/*
  Generates src/styles/_breakpoints.scss from src/styles/breakpoints.json.
  Ensures SCSS can use the same breakpoint values as the JS MUI theme.
*/
const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../src/styles/breakpoints.json');
const scssPath = path.resolve(__dirname, '../src/styles/_breakpoints.scss');

function run() {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const bps = JSON.parse(raw);

  const order = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];
  const lines = [];
  lines.push('/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. */');
  lines.push('/* Source: src/styles/breakpoints.json */');
  lines.push('');
  // Variables
  order.forEach((k) => {
    const val = bps[k];
    if (typeof val !== 'number') {
      throw new Error(`Breakpoint ${k} missing or not a number in breakpoints.json`);
    }
    lines.push(`$bp-${k}: ${val}px;`);
  });
  lines.push('');
  // Map
  lines.push('$breakpoints: (');
  order.forEach((k, idx) => {
    const comma = idx === order.length - 1 ? '' : ',';
    lines.push(`  ${k}: $bp-${k}${comma}`);
  });
  lines.push(');');
  lines.push('');
  // Helper function
  lines.push('@function bp($key) {');
  lines.push('  @return map-get($breakpoints, $key);');
  lines.push('}');
  lines.push('');
  // Mixins similar to MUI up/down/between
  lines.push('@mixin up($key) {');
  lines.push('  $min: bp($key);');
  lines.push('  @if $min == null { @error "Unknown breakpoint `#{$key}`"; }');
  lines.push('  @media (min-width: $min) { @content; }');
  lines.push('}');
  lines.push('');
  lines.push('@mixin down($key) {');
  lines.push('  $max: bp($key);');
  lines.push('  @if $max == null { @error "Unknown breakpoint `#{$key}`"; }');
  lines.push('  @media (max-width: calc(#{$max} - 0.02px)) { @content; }');
  lines.push('}');
  lines.push('');
  lines.push('@mixin between($lower, $upper) {');
  lines.push('  $min: bp($lower);');
  lines.push('  $max: bp($upper);');
  lines.push('  @if $min == null or $max == null { @error "Unknown breakpoint(s) `#{$lower}`, `#{$upper}`"; }');
  lines.push('  @media (min-width: $min) and (max-width: calc(#{$max} - 0.02px)) { @content; }');
  lines.push('}');
  lines.push('');

  fs.writeFileSync(scssPath, lines.join('\n'));
  // eslint-disable-next-line no-console
  console.log(`Generated ${path.relative(process.cwd(), scssPath)}`);
}

run();
