/**
 * Entry Point — Application Entry Point
 * =====================================
 * Application initialization after DOM load
 */

'use strict';

import { App } from './app.js';

// Start application after DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
