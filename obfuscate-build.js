#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════
 *  KAKKOI NIHONGO – Build Obfuscator
 *  Usage: node obfuscate-build.js
 *
 *  Requires: npm install javascript-obfuscator
 *
 *  This script extracts all JavaScript from the
 *  main <script> block in kakkoi-nihongo.html,
 *  obfuscates it, and re-injects it.
 * ═══════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const HTML_FILE = path.join(__dirname, 'kakkoi-nihongo.html');
const BACKUP_FILE = path.join(__dirname, 'kakkoi-nihongo.html.backup');

// ── Colors for CLI output ──
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(msg, color = colors.reset) {
    console.log(`${color}${msg}${colors.reset}`);
}

// ── Check if javascript-obfuscator is installed ──
let obfuscator;
try {
    obfuscator = require('javascript-obfuscator');
} catch (e) {
    log('✖ javascript-obfuscator not found.', colors.red);
    log('  Install it with: npm install javascript-obfuscator', colors.yellow);
    process.exit(1);
}

// ── Main ──
async function main() {
    log('\n══════════════════════════════════════════', colors.cyan);
    log('  KAKKOI NIHONGO – Build Obfuscator', colors.cyan);
    log('══════════════════════════════════════════\n', colors.cyan);

    // 1. Read HTML file
    log('📄 Reading HTML file...', colors.yellow);
    let html;
    try {
        html = fs.readFileSync(HTML_FILE, 'utf-8');
    } catch (e) {
        log(`✖ Cannot read ${HTML_FILE}: ${e.message}`, colors.red);
        process.exit(1);
    }
    log(`  ✓ Read ${html.length} bytes\n`, colors.green);

    // 2. Find the main <script> block (the one containing ALL data)
    const scriptMatch = html.match(/<!-- ====================================================================== -->\n<!-- JAVASCRIPT – ALL DATA & LOGIC -->\n<!-- ====================================================================== -->\n<script>([\s\S]*?)<\/script>/);

    if (!scriptMatch) {
        log('✖ Could not find the main JavaScript block.', colors.red);
        log('  Looking for the JAVASCRIPT – ALL DATA & LOGIC comment marker.', colors.yellow);
        process.exit(1);
    }

    const originalJS = scriptMatch[1];
    log(`  ✓ Found main script block (${originalJS.length} bytes)\n`, colors.green);

    // 3. Create backup
    log('💾 Creating backup...', colors.yellow);
    try {
        if (!fs.existsSync(BACKUP_FILE)) {
            fs.writeFileSync(BACKUP_FILE, html, 'utf-8');
            log(`  ✓ Backup saved to obfuscate-build.js.backup\n`, colors.green);
        } else {
            log(`  ⚠ Backup already exists, skipping\n`, colors.yellow);
        }
    } catch (e) {
        log(`  ✖ Backup failed: ${e.message}`, colors.red);
    }

    // 4. Obfuscate
    log('🔒 Obfuscating JavaScript...', colors.yellow);
    
    const obfuscationResult = obfuscator.obfuscate(originalJS, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        debugProtectionInterval: true,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: ['base64'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 5,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 5,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    });

    const obfuscatedJS = obfuscationResult.getObfuscatedCode();
    log(`  ✓ Obfuscated (${obfuscatedJS.length} bytes, ${Math.round((obfuscatedJS.length / originalJS.length) * 100)}% of original)\n`, colors.green);

    // 5. Replace in HTML
    log('✏️  Replacing JavaScript in HTML...', colors.yellow);
    
    const newHTML = html.replace(
        /<!-- ====================================================================== -->\n<!-- JAVASCRIPT – ALL DATA & LOGIC -->\n<!-- ====================================================================== -->\n<script>[\s\S]*?<\/script>/,
        `<!-- ====================================================================== -->\n<!-- JAVASCRIPT – ALL DATA & LOGIC (OBFUSCATED) -->\n<!-- ====================================================================== -->\n<script>\n${obfuscatedJS}\n</script>`
    );

    // 6. Write back
    fs.writeFileSync(HTML_FILE, newHTML, 'utf-8');
    log('  ✓ HTML updated with obfuscated JavaScript\n', colors.green);

    // 7. Summary
    log('══════════════════════════════════════════', colors.cyan);
    log('  ✅ BUILD COMPLETE', colors.green);
    log('══════════════════════════════════════════', colors.cyan);
    log(`\n  📦 Original JS size:  ${(originalJS.length / 1024).toFixed(1)} KB`, colors.reset);
    log(`  🔒 Obfuscated size:   ${(obfuscatedJS.length / 1024).toFixed(1)} KB`, colors.reset);
    log(`  📁 HTML file:         ${HTML_FILE}`, colors.reset);
    log(`  💾 Backup:            ${BACKUP_FILE}\n`, colors.reset);
    log('  ⚠  Note: Obfuscation makes reverse-engineering', colors.yellow);
    log('  ⚠  significantly harder but not impossible.', colors.yellow);
    log('  ⚠  Client-side code can always be extracted.\n', colors.yellow);
}

main().catch(err => {
    log(`\n✖ Unexpected error: ${err.message}`, colors.red);
    console.error(err);
    process.exit(1);
});

