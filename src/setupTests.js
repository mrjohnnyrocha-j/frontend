// setupTests.js

// Polyfill for TextEncoder and TextDecoder
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for window.crypto.getRandomValues
if (typeof window === 'undefined') {
  global.window = {};
}

if (typeof self === 'undefined') {
  global.self = global;
}

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});
