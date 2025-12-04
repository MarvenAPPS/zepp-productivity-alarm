# Icon Setup Guide

## Error: "The icon in app.json is empty or the image does not exist"

Zeus CLI requires an `assets/icon.png` file (192x192 pixels).

---

## Quick Fix - 3 Options

### Option 1: Auto-Generate (Recommended)

**Using Node.js (cross-platform):**
```bash
# Install sharp
npm install sharp

# Generate icon
node scripts/create-icon.js

# Build
zeus build
```

**Using ImageMagick (macOS/Linux):**
```bash
# Install ImageMagick
brew install imagemagick  # macOS
# or
sudo apt install imagemagick  # Linux

# Generate icon
chmod +x scripts/create-icon.sh
./scripts/create-icon.sh

# Build
zeus build
```

---

### Option 2: Use Online Tool

1. Go to https://www.canva.com/ or https://www.photopea.com/
2. Create new design: **192 x 192 pixels**
3. Design your icon:
   - Background: `#32B8C6` (teal - app color)
   - Symbol: Alarm clock ⏰ or checkmark ✓
   - Keep it simple and recognizable
4. Export as **PNG**
5. Save to: `assets/icon.png`
6. Build: `zeus build`

---

### Option 3: Manual Creation

**macOS (Preview):**
```bash
# Create blank 192x192 image
open -a Preview
# File → New from Clipboard (after screenshot or copy)
# Tools → Adjust Size → 192x192
# Save as assets/icon.png
```

**Windows (Paint):**
```
1. Open Paint
2. Resize canvas: 192x192 pixels
3. Fill with color: #32B8C6
4. Add text/symbol
5. Save as: assets/icon.png
```

---

## Icon Requirements

- **Size**: Exactly **192 x 192 pixels**
- **Format**: PNG (supports transparency)
- **Location**: `assets/icon.png`
- **Design**: Simple, recognizable at small sizes
- **Colors**: Use app theme
  - Primary: `#32B8C6` (teal)
  - Secondary: `#FCFCF9` (cream/white)
  - Accent: `#21808D` (dark teal)

---

## Icon Design Ideas

### Simple Icons (Easy to Create)

1. **Alarm Clock** ⏰
   - Teal circle background
   - White clock face
   - Clock hands showing time

2. **Checkmark** ✓
   - Teal square with rounded corners
   - White checkmark in center
   - Minimal and clean

3. **Target/Bullseye** 🎯
   - Concentric circles
   - Teal and white alternating
   - Represents goals

4. **Trophy** 🏆
   - Teal background
   - White/gold trophy icon
   - Achievement theme

5. **Lightning Bolt** ⚡
   - Energy/productivity symbol
   - Teal background, white bolt
   - Dynamic feel

---

## Verify Icon

```bash
# Check if icon exists
ls -lh assets/icon.png

# Check dimensions (macOS)
sips -g pixelWidth -g pixelHeight assets/icon.png
# Should show: 192 x 192

# Check dimensions (Linux)
file assets/icon.png
identify assets/icon.png

# Build with icon
zeus build
```

---

## Common Issues

### "Icon does not exist"

**Solution:** Create `assets/` folder and add `icon.png`
```bash
mkdir -p assets
# Then add your 192x192 PNG to assets/icon.png
```

### "Icon is empty"

**Solution:** Make sure file is valid PNG, not corrupted
```bash
# Check file type
file assets/icon.png
# Should show: PNG image data, 192 x 192
```

### Wrong size

**Solution:** Resize to exactly 192x192
```bash
# Using ImageMagick
convert assets/icon.png -resize 192x192! assets/icon.png

# Using sips (macOS)
sips -z 192 192 assets/icon.png
```

---

## After Creating Icon

```bash
# 1. Verify icon exists
ls assets/icon.png

# 2. Build
zeus build

# 3. Should see:
# ✅ "Build package success!"

# 4. Install
zeus preview
```

---

## Professional Icon (Optional)

For a polished look, consider:

1. **Hire designer** on Fiverr/Upwork ($5-20)
2. **AI generation** with DALL-E, Midjourney, or Stable Diffusion
3. **Icon packs** like Flaticon, Icons8 (edit and export)
4. **Figma templates** for watch app icons

---

**TL;DR:**

```bash
# Quickest fix:
npm install sharp
node scripts/create-icon.js
zeus build
```
