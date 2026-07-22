/**
 * ═══════════════════════════════════════════════════════════════
 *  KAKKOI NIHONGO – CONTENT PROTECTION SYSTEM v1.0
 *  ⚠  Multi-layered client-side protection module
 * ═══════════════════════════════════════════════════════════════
 *
 *  Layers:
 *   1. DevTools Detection (3 strategies)
 *   2. Keyboard Shortcut Blocking
 *   3. Context Menu / Right-Click Block
 *   4. Text Selection & Drag Protection
 *   5. Console Watermarking
 *   6. Periodic Integrity Checks
 *   7. Performance Degradation Warning
 * ═══════════════════════════════════════════════════════════════
 */

;(function() {
    'use strict';

    // ─────────────────────────────────────────────
    // CONFIGURATION
    // ─────────────────────────────────────────────
    const CONFIG = {
        ENABLE_ALL: true,
        BLOCK_F12: true,
        BLOCK_CTRL_SHIFT_I: true,
        BLOCK_CTRL_SHIFT_J: true,
        BLOCK_CTRL_U: true,
        BLOCK_CTRL_S: true,
        BLOCK_CTRL_C: true,
        BLOCK_CTRL_V: true,
        BLOCK_CTRL_P: true,
        BLOCK_CTRL_SHIFT_C: true,
        BLOCK_CONTEXT_MENU: true,
        BLOCK_SELECTION: true,
        BLOCK_DRAG: true,
        CONSOLE_WATERMARK: true,
        DEVTOLS_DETECT: true,
        INTEGRITY_CHECK_INTERVAL: 5000, // ms
        REDIRECT_ON_DETECT: true,
        REDIRECT_URL: 'about:blank',
        SHOW_FAKE_DATA: false
    };

    // ─────────────────────────────────────────────
    // LAYER 1: DEVTOOLS DETECTION
    // ─────────────────────────────────────────────

    // Strategy A: Element-based detection
    function createDevToolsDetector() {
        const detector = document.createElement('div');
        detector.id = '__kakkoi_devtools_detector';
        detector.style.cssText = 'position:fixed;top:-1000px;left:-1000px;width:100px;height:100px;z-index:-9999;pointer-events:none;';
        document.body.appendChild(detector);
        
        let detectionCount = 0;
        const threshold = 3;
        
        function check() {
            if (!CONFIG.DEVTOLS_DETECT) return;
            
            const rect = detector.getBoundingClientRect();
            // When DevTools is docked to the side/bottom, elements can get zero dimensions
            // or negative width/height when the viewport shrinks unexpectedly
            if (rect.width === 0 || rect.height === 0) {
                detectionCount++;
            } else {
                detectionCount = Math.max(0, detectionCount - 1);
            }
            
            if (detectionCount >= threshold) {
                triggerProtection();
            }
        }
        
        return { check, element: detector };
    }

    // Strategy B: Debugger statement loop
    function setupDebuggerTrap() {
        let debuggerActive = false;
        let lastDebuggerTime = Date.now();
        
        function debuggerCheck() {
            const now = Date.now();
            // If debugger pauses execution, the time gap will be > 100ms
            if (now - lastDebuggerTime > 200) {
                debuggerActive = true;
            }
            lastDebuggerTime = now;
        }
        
        // Run debugger trap at intervals
        setInterval(function() {
            debuggerCheck();
            if (debuggerActive && CONFIG.DEVTOLS_DETECT) {
                // DevTools was likely paused here - reset and warn
                debuggerActive = false;
                triggerProtection();
            }
        }, 1000);
    }

    // Strategy C: Console timing attack
    function setupConsoleTrap() {
        let consoleOpen = false;
        
        const check = function() {
            const start = performance.now();
            // eslint-disable-next-line no-console
            console.log('%c ', 'background: #000; color: #000;');
            const end = performance.now();
            
            // If console is open, logging takes significantly longer
            if (end - start > 50) {
                consoleOpen = true;
                if (CONFIG.DEVTOLS_DETECT) {
                    triggerProtection();
                }
            }
        };
        
        // Run check periodically
        setInterval(check, 2000);
    }

    // ─────────────────────────────────────────────
    // LAYER 2: KEYBOARD SHORTCUT BLOCKING
    // ─────────────────────────────────────────────

    function setupKeyboardBlocking() {
        document.addEventListener('keydown', function(e) {
            // Allow normal typing in input fields
            const tag = (e.target || e.srcElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return true;
            }

            // F12
            if (CONFIG.BLOCK_F12 && e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                showConsoleWarning('🔒 Developer tools are disabled on this site.');
                return false;
            }

            // Ctrl+Shift+I (Chrome/Edge DevTools)
            if (CONFIG.BLOCK_CTRL_SHIFT_I && e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                e.stopPropagation();
                showConsoleWarning('🔒 Developer tools are disabled on this site.');
                return false;
            }

            // Ctrl+Shift+J (Chrome Console)
            if (CONFIG.BLOCK_CTRL_SHIFT_J && e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                e.stopPropagation();
                showConsoleWarning('🔒 Developer tools are disabled on this site.');
                return false;
            }

            // Ctrl+U (View Source)
            if (CONFIG.BLOCK_CTRL_U && e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                e.stopPropagation();
                showConsoleWarning('🔒 View Source is disabled.');
                return false;
            }

            // Ctrl+S (Save Page)
            if (CONFIG.BLOCK_CTRL_S && e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+C (Inspect Element)
            if (CONFIG.BLOCK_CTRL_SHIFT_C && e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+P (Print - can reveal source)
            if (CONFIG.BLOCK_CTRL_P && e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            return true;
        }, true); // Capture phase to intercept before other handlers
    }

    // ─────────────────────────────────────────────
    // LAYER 3: CONTEXT MENU / RIGHT-CLICK BLOCK
    // ─────────────────────────────────────────────

    function setupContextMenuBlock() {
        if (!CONFIG.BLOCK_CONTEXT_MENU) return;

        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        // Also block via auxclick (middle-click)
        document.addEventListener('auxclick', function(e) {
            if (e.button === 2) {
                e.preventDefault();
                return false;
            }
        }, true);
    }

    // ─────────────────────────────────────────────
    // LAYER 4: TEXT SELECTION & DRAG PROTECTION
    // ─────────────────────────────────────────────

    function setupSelectionAndDragProtection() {
        if (CONFIG.BLOCK_SELECTION) {
            document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            }, true);
            
            // CSS-level selection prevention (fallback)
            const style = document.createElement('style');
            style.id = '__kakkoi_noselect';
            style.textContent = `
                body {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
                input, textarea {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
            `;
            document.head.appendChild(style);
        }

        if (CONFIG.BLOCK_DRAG) {
            document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            }, true);
            
            document.addEventListener('drop', function(e) {
                e.preventDefault();
                return false;
            }, true);
        }
    }

    // ─────────────────────────────────────────────
    // LAYER 5: CONSOLE WATERMARKING
    // ─────────────────────────────────────────────

    function setupConsoleWatermark() {
        if (!CONFIG.CONSOLE_WATERMARK) return;

        const styles = [
            'font-size: 24px',
            'font-weight: bold',
            'color: #6366f1',
            'background: #0f172a',
            'padding: 12px 20px',
            'border-radius: 8px',
            'border: 2px solid #818cf8',
            'line-height: 1.5'
        ].join(';');

        const subStyles = [
            'font-size: 13px',
            'color: #94a3b8',
            'padding: 8px 20px'
        ].join(';');

        console.log('%c⚠️  KAKKOI NIHONGO  ⚠️', styles);
        console.log('%cThis browser console is for authorized use only.\nContent on this site is protected intellectual property.\nUnauthorized copying, inspection, or distribution is prohibited.', subStyles);
        console.log('%c© 2025 Kakkoi Nihongo. All rights reserved.', 'font-size:12px;color:#64748b;');

        // Override console methods to add watermark
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = function() {
            const args = Array.prototype.slice.call(arguments);
            if (typeof args[0] === 'string' && args[0].includes('%c')) {
                // Already styled, pass through
                return originalLog.apply(console, args);
            }
            originalLog.apply(console, ['[Kakkoi]'].concat(args));
        };

        console.info = function() {
            originalInfo.apply(console, ['[ℹ Kakkoi]'].concat(Array.prototype.slice.call(arguments)));
        };

        console.warn = function() {
            originalWarn.apply(console, ['[⚠ Kakkoi]'].concat(Array.prototype.slice.call(arguments)));
        };

        console.error = function() {
            originalError.apply(console, ['[✖ Kakkoi]'].concat(Array.prototype.slice.call(arguments)));
        };
    }

    // ─────────────────────────────────────────────
    // LAYER 6: PERIODIC INTEGRITY CHECKS
    // ─────────────────────────────────────────────

    function setupIntegrityChecks() {
        // Check if our protection elements are still intact
        setInterval(function() {
            const detector = document.getElementById('__kakkoi_devtools_detector');
            if (!detector && CONFIG.DEVTOLS_DETECT) {
                // Someone might have removed our detector
                console.warn('⚠ Integrity check: protection elements altered.');
            }
            
            const noSelect = document.getElementById('__kakkoi_noselect');
            if (!noSelect && CONFIG.BLOCK_SELECTION) {
                console.warn('⚠ Integrity check: selection protection removed.');
            }
        }, CONFIG.INTEGRITY_CHECK_INTERVAL);
    }

    // ─────────────────────────────────────────────
    // TRIGGER PROTECTION (when detection fires)
    // ─────────────────────────────────────────────

    function triggerProtection() {
        if (CONFIG.REDIRECT_ON_DETECT) {
            // Option 1: Redirect (strong)
            if (CONFIG.REDIRECT_URL) {
                window.location.href = CONFIG.REDIRECT_URL;
            }
            
            // Option 2: Clear body (stronger)
            document.body.innerHTML = '';
            document.title = 'Access Denied';
            
            // Option 3: Show fake data (deception)
            if (CONFIG.SHOW_FAKE_DATA) {
                document.body.innerHTML = '<h1>Error: 403 Forbidden</h1><p>This content is protected.</p>';
            }
        }
    }

    // ─────────────────────────────────────────────
    // CONSOLE WARNING HELPER
    // ─────────────────────────────────────────────

    function showConsoleWarning(message) {
        console.warn('%c🔒 ' + message, 'font-size:13px;color:#f87171;font-weight:bold;');
    }

    // ─────────────────────────────────────────────
    // ADDITIONAL HARDENING
    // ─────────────────────────────────────────────

    // Disable image dragging (common copy vector)
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('img').forEach(function(img) {
            img.setAttribute('draggable', 'false');
        });
    });

    // Prevent before-unload detection of DevTools
    window.addEventListener('devtoolschange', function(e) {
        e.preventDefault();
    });

    // Override toString to prevent function inspection
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
        if (this === triggerProtection || this.name === '') {
            return 'function () { [native code] }';
        }
        return originalToString.apply(this, arguments);
    };

    // ─────────────────────────────────────────────
    // INITIALIZATION
    // ─────────────────────────────────────────────

    function init() {
        if (!CONFIG.ENABLE_ALL) return;
        
        console.log('🔐 Kakkoi Nihongo Protection System v1.0 active');
        
        // Layer 1: DevTools Detection
        const detector = createDevToolsDetector();
        setInterval(detector.check, 1000);
        setupDebuggerTrap();
        setupConsoleTrap();
        
        // Layer 2: Keyboard Shortcuts
        setupKeyboardBlocking();
        
        // Layer 3: Context Menu
        setupContextMenuBlock();
        
        // Layer 4: Selection & Drag
        setupSelectionAndDragProtection();
        
        // Layer 5: Console
        setupConsoleWatermark();
        
        // Layer 6: Integrity
        setupIntegrityChecks();
        
        // Additional: Disable print (can be used to save as PDF)
        // Note: window.print() can't be fully blocked, but we disable Ctrl+P above
    }

    // Start protection when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

