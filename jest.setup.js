import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noOp() {}

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp });
}
