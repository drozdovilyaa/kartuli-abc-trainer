// Entry point for the Georgian Alphabet Trainer
import { Game } from './game.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.initialize();
    
    // Expose game instance and helper functions for debugging (use in console)
    window.game = game;
    window.showMemory = () => game.state.logMemoryState();
    window.getMemory = (mode) => mode ? game.state.memory[mode] : game.state.memory;
    window.getHistory = (mode) => mode ? game.state.recentHistory[mode] : game.state.recentHistory;
});
