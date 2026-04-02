import { Buffer } from 'buffer';

// Essential Polyfills for @magenta/music & Tone.js 14 compatibility
(window as any).Buffer = Buffer;
(window as any).global = window;
(window as any).process = { 
  env: { NODE_DEBUG: false }, 
  browser: true,
  hrtime: () => {
    const now = performance.now();
    const seconds = Math.floor(now / 1000);
    const nanoseconds = Math.floor((now % 1000) * 1000000);
    return [seconds, nanoseconds];
  },
  nextTick: (cb: any) => setTimeout(cb, 0)
};

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('--- POKÉMON 8-BIT COMPOSER INITIALIZING ---');

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
