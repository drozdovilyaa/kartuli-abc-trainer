/**
 * Entry Point — Точка входа приложения
 * =====================================
 * Инициализация приложения после загрузки DOM
 */

'use strict';

import { App } from './app.js';

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
