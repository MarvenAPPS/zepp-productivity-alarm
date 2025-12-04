#!/bin/bash

# Simple icon creator for Zepp OS apps
# Creates a 192x192 PNG icon with alarm clock emoji/symbol

echo "Creating placeholder icon for Zepp OS app..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found."
    echo ""
    echo "Install ImageMagick:"
    echo "  macOS:  brew install imagemagick"
    echo "  Linux:  sudo apt install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/"
    echo ""
    echo "Or create icon manually:"
    echo "  1. Create 192x192 PNG image"
    echo "  2. Save as assets/icon.png"
    echo "  3. Run: zeus build"
    exit 1
fi

# Create assets directory if it doesn't exist
mkdir -p assets

# Create a simple teal circle with alarm symbol
convert -size 192x192 xc:"#32B8C6" \
    -fill white \
    -draw "circle 96,96 96,40" \
    -fill "#32B8C6" \
    -draw "circle 96,96 96,50" \
    assets/icon.png

if [ -f "assets/icon.png" ]; then
    echo "✅ Icon created: assets/icon.png"
    echo "ℹ  This is a simple placeholder. Consider creating a custom icon."
    echo ""
    echo "Next step: zeus build"
else
    echo "❌ Failed to create icon"
    exit 1
fi
