#!/usr/bin/env node

/**
 * Simple Node.js script to create a placeholder icon
 * Uses sharp library (install with: npm install sharp)
 */

const fs = require('fs');
const path = require('path');

try {
    const sharp = require('sharp');
    
    const size = 192;
    const color = { r: 50, g: 184, b: 198 }; // #32B8C6 teal
    
    // Create assets directory
    const assetsDir = path.join(__dirname, '..', 'assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Create simple colored square with rounded corners
    const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" rx="40" fill="rgb(${color.r},${color.g},${color.b})"/>
            <circle cx="96" cy="96" r="50" fill="white" opacity="0.9"/>
            <path d="M 96 60 L 96 96 L 120 96" stroke="rgb(${color.r},${color.g},${color.b})" stroke-width="6" stroke-linecap="round" fill="none"/>
            <circle cx="96" cy="50" r="4" fill="white"/>
            <circle cx="96" cy="142" r="4" fill="white"/>
        </svg>
    `;
    
    const iconPath = path.join(assetsDir, 'icon.png');
    
    sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(iconPath)
        .then(() => {
            console.log('✅ Icon created: assets/icon.png');
            console.log('ℹ  This is a simple placeholder. Consider creating a custom icon.');
            console.log('');
            console.log('Next step: zeus build');
        })
        .catch(err => {
            console.error('❌ Failed to create icon:', err.message);
            console.log('');
            console.log('Install sharp: npm install sharp');
            console.log('Or create icon manually and save as assets/icon.png');
            process.exit(1);
        });
        
} catch (err) {
    console.log('❌ Sharp library not found.');
    console.log('');
    console.log('Quick fix - Install sharp:');
    console.log('  npm install sharp');
    console.log('  node scripts/create-icon.js');
    console.log('');
    console.log('Alternative - Use ImageMagick:');
    console.log('  chmod +x scripts/create-icon.sh');
    console.log('  ./scripts/create-icon.sh');
    console.log('');
    console.log('Manual - Create 192x192 PNG and save as:');
    console.log('  assets/icon.png');
    process.exit(1);
}
