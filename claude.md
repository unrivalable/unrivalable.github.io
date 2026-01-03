# Claude Development Documentation

This file documents the development process and technical decisions for the Unrivalable game website.

## Project Overview

A character and game mode selection website for "Unrivalable", part of the "Unemployables" franchise. Built with pure HTML/CSS/JavaScript with a distinctive comic book superhero aesthetic.

## Development Timeline

### Initial Setup
- Created opening screen with franchise name and game title
- Implemented home screen with menu navigation
- Started with cyberpunk/arcade aesthetic

### Visual Redesign
- Pivoted from cyberpunk to **comic book superhero aesthetic**
- Changed color scheme to bold comic colors (red, cyan, purple, yellow)
- Added comic book effects: halftone dots, text strokes, thick borders, drop shadows
- Implemented skewed/rotated elements for dynamic comic panel feel
- Changed fonts to Bangers, Bebas Neue, Permanent Marker, Bungee

### Game Mode Implementation
- Extracted 7 game modes from GameModes.pptx PowerPoint file
- Created carousel navigation system
- Implemented side-by-side layout with image and description
- Added mode selection functionality
- Fixed text cutoff issues at 100% zoom by reducing carousel sizes

### Hero Data Extraction
- Extracted 27 complete heroes from heroes.pptx PowerPoint file
- Parsed hero data including:
  - Names, images, abilities
  - 6 classes: Destroyer, Defender, Saboteur, Supporter, Controller, Hawktalker
  - Ability structure: Main Attack, Ability 1, Ability 2, Super
- Initially created individual carousel slides per hero
- Embedded data directly in script.js to avoid CORS issues with file:// protocol

### Asset Organization
- Renamed all images to human-readable names
- Organized into directories: /images/heroes/, /images/classes/, /images/
- Updated references across all files (index.html, script.js, heroes_data.json)
- Fixed special character filenames (shan't-dance.jpg, digeridon't.jpg, etc.)

### Character Selection Redesign
- Changed from plural to singular class names (Destroyers → Destroyer)
- **Restructured from individual hero slides to class-based grid layout**
- Created one carousel slide per class showing all heroes in a grid
- Implemented square hero card design with hover effects
- Reduced navigation from 27 indicators to 5 (one per class)

### Hero Details Modal (User Addition)
- User implemented modal popup for detailed hero view
- Shows large hero portrait, class badge, and structured abilities
- Added select/cancel functionality
- Integrated with grid card click events
- Added escape key support to close modal

### Structured Data Export
- Created heroes_abilities.json with parsed ability data
- Structure: Each ability has `name` and `description` fields
- Organized by class with metadata
- Separated ability names from descriptions using regex parsing

## Technical Decisions

### Why Embed Data in script.js?
Using `fetch('heroes_data.json')` doesn't work with `file://` protocol due to CORS restrictions. Embedding data directly in JavaScript ensures the page works when opened locally without a server.

### Why Padding-Bottom for Square Images?
CSS `aspect-ratio` has limited browser support. The `padding-bottom: 100%` technique with `height: 0` creates a reliable square aspect ratio by using percentage-based padding (which calculates from width).

### Why Class-Based Grid Instead of Individual Slides?
- Allows users to see all heroes in a class at once
- Reduces navigation complexity (5 classes vs 27 heroes)
- Enables comparison within a class
- Better UX for character selection

### Why Comic Book Aesthetic?
Matches the playful, superhero-themed nature of the game characters and game modes. The bold colors, thick borders, and skewed elements create a distinctive, memorable visual identity that avoids generic UI design.

## File Structure

```
unrivalable.github.io/
├── index.html                 # Main HTML structure
├── styles.css                 # All styling (~1,400 lines)
├── script.js                  # Logic + embedded data (~770 lines)
├── heroes_abilities.json      # Structured ability data
├── heroes_data.json          # Raw extracted data
├── README.md                 # User-facing documentation
├── claude.md                 # This file - development docs
└── images/
    ├── heroes/               # 27 hero portraits (.jpg/.png)
    ├── classes/              # 6 class icons (.png)
    └── *.png                 # 7 game mode images
```

## Key CSS Classes

### Layout
- `.crt-container` - Main panel container with border and effects
- `.screen` - Base screen container (opening, home, character, gamemode)
- `.carousel-container` - Carousel wrapper with navigation
- `.carousel-slide` - Individual carousel slide

### Character Selection
- `.hero-grid` - CSS Grid container for hero cards
- `.hero-card` - Individual hero card with image and name
- `.hero-card-image` - Square image container (padding-bottom technique)
- `.class-header` - Class name and icon header
- `.modal-overlay` - Full-screen modal container
- `.modal-content` - Modal panel with hero details

### Game Mode Selection
- `.carousel-image` - Left side image container
- `.carousel-info` - Right side description container
- `.carousel-title` - Mode name with comic styling
- `.select-mode-btn` - Selection button with POW! effect

### Effects
- `.scanlines` - Halftone dot overlay
- `.class-badge` - Colored class indicator with pulse animation
- `.ability-item` - Styled ability description box

## JavaScript Functions

### Navigation
- `transitionToScreen(from, to)` - Handles screen transitions with comic zoom effect
- `showSlide(index)` - Updates carousel active slide
- `showHeroSlide(index)` - Updates hero carousel with class color theming

### Data Building
- `buildHeroCarousel()` - Generates hero grid HTML from heroesData
- `formatAbilities(text)` - Parses ability string into structured HTML
- `setupHeroCarouselNavigation()` - Attaches event listeners for navigation

### Modal (User Added)
- `openHeroModal(hero, className)` - Opens modal with hero details
- Modal close handlers for cancel button, select button, escape key

## Color Theming

Each class has a unique color gradient applied to badges, indicators, and UI elements:

```javascript
const classColors = {
    'Destroyer': { primary: '#FF3366', secondary: '#FF8833' },
    'Defender': { primary: '#00BFFF', secondary: '#00FFFF' },
    'Saboteur': { primary: '#AA66FF', secondary: '#FF00FF' },
    'Supporter': { primary: '#00FF88', secondary: '#FFD700' },
    'Controller': { primary: '#FFD700', secondary: '#FF8833' },
    'Hawktalker': { primary: '#00FFFF', secondary: '#AA66FF' }
};
```

## Known Issues / Future Improvements

- Hawktalker class has no heroes yet (0/6 slots filled)
- Some hero abilities have incomplete descriptions (e.g., Tickle Monster's Super)
- Responsive mobile layout could be further optimized
- Could add sound effects for button clicks and transitions
- Could add character voice lines or animations

## Asset Requirements

### Image Formats
- Hero portraits: .jpg or .png
- Class icons: .png
- Game modes: .png

### Special Characters in Filenames
Files with special characters (apostrophes, etc.) must match exactly:
- `shan't-dance.jpg` (not `shant-dance.jpg`)
- `digeridon't.jpg` (not `didgeridont.jpg`)
- `bees-knees.jpg` (not `bee's-knees.jpg`)

## PowerPoint Extraction Process

PowerPoint files (.pptx) are ZIP archives containing XML. Extraction process:
1. Unzip .pptx file
2. Parse `ppt/slides/*.xml` for slide content
3. Extract text from `<a:t>` tags
4. Match images from `ppt/media/` directory
5. Structure data into JSON format
6. Map slide numbers to hero/mode associations

## Development Commands

```bash
# Open in browser
open index.html

# List hero images
ls images/heroes/

# Search for code patterns
grep -r "pattern" *.js

# Validate JSON
python3 -m json.tool heroes_abilities.json
```

## Claude Code Session Notes

- Used Task tool with Explore agent for codebase navigation
- Avoided individual file reads when exploring multiple files
- Used parallel tool calls for independent operations (multiple reads, multiple bash commands)
- Used Edit tool for precise string replacements instead of regex when dealing with Unicode
- Embedded large data objects to avoid CORS issues
- Preferred dedicated tools (Read, Edit, Write) over bash commands for file operations
