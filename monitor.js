// Monitor for suspicious activity
class SecurityMonitor {
    constructor() {
        this.suspiciousEvents = [];
        this.initMonitoring();
    }
    
    initMonitoring() {
        // Monitor console usage
        const originalConsole = console.log;
        console.log = function(...args) {
            // Track console access
            this.suspiciousEvents.push({
                type: 'console_access',
                args: args,
                time: new Date()
            });
            originalConsole.apply(console, args);
        };
        
        // Monitor DOM mutations
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.suspiciousEvents.push({
                        type: 'dom_mutation',
                        mutation: mutation,
                        time: new Date()
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Report suspicious activity (send to server)
function reportSuspiciousActivity() {
    if (window._suspiciousEvents && window._suspiciousEvents.length > 0) {
        fetch('/api/security/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                events: window._suspiciousEvents,
                userAgent: navigator.userAgent,
                url: window.location.href
            })
        });
    }
}

// Report every 30 seconds
setInterval(reportSuspiciousActivity, 30000);
