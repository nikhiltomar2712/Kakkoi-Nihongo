// Content Protection System
(function() {
    'use strict';
    
    // 1. Dynamic Content Loading (Hide data from initial source)
    class ContentProtector {
        constructor() {
            this.protectedData = new Map();
            this.initProtection();
        }
        
        initProtection() {
            // Encrypt sensitive data
            this.encryptContent();
            // Disable right-click
            this.disableContextMenu();
            // Prevent text selection
            this.preventSelection();
            // Add fake data traps
            this.addHoneypotData();
            // Check for DevTools
            this.detectDevTools();
            // Protection against iframe embedding
            this.preventIframeEmbedding();
        }
        
        encryptContent() {
            // Move actual content to JS and load dynamically
            const dataElements = document.querySelectorAll('[data-protected]');
            dataElements.forEach(el => {
                const encrypted = this.simpleEncrypt(el.innerHTML);
                el.innerHTML = '';
                el.dataset.encrypted = encrypted;
                // Decrypt when visible
                if (this.isElementVisible(el)) {
                    el.innerHTML = this.simpleDecrypt(encrypted);
                }
            });
        }
        
        simpleEncrypt(text) {
            // Basic encryption (layer 1)
            return btoa(text.split('').reverse().join(''));
        }
        
        simpleDecrypt(encoded) {
            try {
                return atob(encoded).split('').reverse().join('');
            } catch {
                return '';
            }
        }
        
        disableContextMenu() {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.logProtectionEvent('Right-click blocked');
            });
        }
        
        preventSelection() {
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
            });
            document.addEventListener('copy', (e) => {
                e.preventDefault();
                this.logProtectionEvent('Copy blocked');
                // Add fake data to clipboard
                e.clipboardData.setData('text/plain', 'Content protected');
            });
        }
        
        addHoneypotData() {
            // Add fake kanji/vocabulary to confuse scrapers
            const fakeData = [
                '㐀㐁㐂', '䷀䷁䷂', '𠀀𠀁𠀂'
            ];
            const honeypot = document.createElement('div');
            honeypot.style.display = 'none';
            honeypot.dataset.honeypot = 'true';
            honeypot.textContent = fakeData.join(' ');
            document.body.appendChild(honeypot);
        }
        
        detectDevTools() {
            // Detect DevTools opening
            let devtoolsOpen = false;
            const threshold = 160;
            
            const checkDevTools = () => {
                const widthDiff = window.outerWidth - window.innerWidth;
                const heightDiff = window.outerHeight - window.innerHeight;
                
                if (widthDiff > threshold || heightDiff > threshold) {
                    if (!devtoolsOpen) {
                        devtoolsOpen = true;
                        this.logProtectionEvent('DevTools detected');
                        this.handleDevToolsOpen();
                    }
                } else {
                    devtoolsOpen = false;
                }
            };
            
            // Check periodically
            setInterval(checkDevTools, 1000);
            
            // Check on resize
            window.addEventListener('resize', checkDevTools);
        }
        
        handleDevToolsOpen() {
            // Option 1: Redirect
            // window.location.href = 'about:blank';
            
            // Option 2: Clear content
            // document.body.innerHTML = '<h1>Content Protected</h1>';
            
            // Option 3: Show warning
            console.log('%c🔒 Content Protected', 'font-size: 20px; color: red;');
            console.log('%cThis content is for educational purposes only.', 'font-size: 14px;');
        }
        
        preventIframeEmbedding() {
            if (window.top !== window.self) {
                window.top.location = window.self.location;
            }
        }
        
        isElementVisible(el) {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }
        
        logProtectionEvent(event) {
            // Log protection events (optional)
            if (window._protectionLogs) {
                window._protectionLogs.push({
                    event: event,
                    time: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
            }
        }
    }
    
    // 2. Anti-Scraping: Rate limiting for API calls
    class RateLimiter {
        constructor() {
            this.requests = new Map();
            this.initRateLimiting();
        }
        
        initRateLimiting() {
            // Monitor fetch/XHR requests
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const url = args[0];
                const key = url.toString();
                
                if (RateLimiter.isRateLimited(key)) {
                    return Promise.reject(new Error('Rate limit exceeded'));
                }
                
                RateLimiter.recordRequest(key);
                return originalFetch.apply(this, args);
            };
        }
        
        static isRateLimited(key) {
            const now = Date.now();
            const requests = this.requests.get(key) || [];
            const recent = requests.filter(t => now - t < 60000); // 1 minute
            return recent.length > 10; // Max 10 requests per minute
        }
        
        static recordRequest(key) {
            const now = Date.now();
            if (!this.requests.has(key)) {
                this.requests.set(key, []);
            }
            this.requests.get(key).push(now);
            // Clean old entries
            this.requests.set(key, 
                this.requests.get(key).filter(t => now - t < 60000)
            );
        }
    }
    
    // 3. Dynamic Content Watermarking
    class Watermark {
        constructor() {
            this.addWatermark();
        }
        
        addWatermark() {
            const style = document.createElement('style');
            style.textContent = `
                body::after {
                    content: '🔒 Private Content';
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    color: rgba(0,0,0,0.1);
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 9999;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize protection
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ContentProtector();
            new RateLimiter();
            new Watermark();
        });
    } else {
        new ContentProtector();
        new RateLimiter();
        new Watermark();
    }
    
})();
