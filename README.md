# Unrivalable - Game Website

A comic book superhero-inspired website for the video game **Unrivalable**, part of the **Unemployables** franchise.

## Features

### Opening Screen
- Franchise name "UNEMPLOYABLES" displayed above main title
- Main title "UNRIVALABLE" with comic book glitch effects
- "START GAME" option with animated cursor brackets
- Comic panel aesthetic with halftone dot overlay

### Home Screen
- Character Selection menu option
- Game Mode menu option
- Start Game button
- Keyboard navigation support (Arrow keys + Enter)
- System status bar at bottom

### Character Selection
- **Class-based hero selection** with carousel navigation
- 5 hero classes: Destroyer, Defender, Saboteur, Supporter, Controller
- **Grid layout** showing all heroes in a class at once
- **Square hero portrait cards** with hover effects
- Click any hero card to open detailed modal view
- **Hero Details Modal** showing:
  - Large hero portrait
  - Class badge with color theming
  - Structured ability breakdown (Main Attack, Ability 1, Ability 2, Super)
  - Select or cancel options

### Game Mode Selection
- **7 unique game modes** with carousel navigation:
  - Dan Rhon Deathmatch (6v6)
  - Charge on Chexico (6v6)
  - Tessarune Turf War (6v6)
  - Squirt! (4v4)
  - Duo Hoedown (1v1)
  - Campaign (5 player FFA)
  - Story Mode (1-4 player co-op)
- Image and description for each mode
- Arrow navigation and keyboard support

## Visual Design

- **Comic book superhero aesthetic** with dark blue background
- **Bold color palette**: Red, cyan, purple, yellow, orange with black outlines
- **Comic typography**: Bangers, Bebas Neue, Permanent Marker, Bungee fonts
- **Dynamic effects**: Halftone dots, text strokes, drop shadows, skewed elements
- **Class color theming**: Each hero class has unique color gradient
- **Animated elements**: Badge pulses, title wiggles, button effects, carousel transitions

## Data Structure

### heroes_abilities.json
Structured JSON file containing all hero ability data:
- Each hero has 4 abilities: Main Attack, Ability 1, Ability 2, Super
- Each ability has a `name` and `description`
- Organized by class with metadata

## How to View

Simply open `index.html` in a web browser. For best experience:
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Desktop viewing recommended (responsive mobile support included)
- 100% zoom level for optimal layout

## Interactions

- **Click "START GAME"** on opening screen to proceed to home screen
- **Hover** over menu items and hero cards for visual effects
- **Character Selection**:
  - Use arrow buttons or arrow keys to navigate between classes
  - Click any hero card to view detailed abilities in modal
  - Click "SELECT CHARACTER" in modal to choose hero
- **Game Mode Selection**:
  - Use arrow buttons or arrow keys to navigate between modes
  - Click "JUICE IT UP?" to select game mode
- **Keyboard navigation**:
  - Arrow Left/Right to navigate carousels
  - Arrow Up/Down to navigate menu
  - Enter to select
  - Escape to close modal

## File Structure

```
├── index.html              # Main HTML structure
├── styles.css              # All styling and comic book effects
├── script.js               # Interaction logic and embedded hero data
├── heroes_abilities.json   # Structured ability data for all heroes
├── heroes_data.json        # Raw hero data from PowerPoint extraction
└── images/
    ├── heroes/             # 27 hero portrait images
    ├── classes/            # 6 class icon images
    └── *.png               # 7 game mode images
```

## Tech Stack

- Pure HTML/CSS/JavaScript
- Google Fonts (Bangers, Bebas Neue, Permanent Marker, Bungee)
- CSS Grid and Flexbox layouts
- CSS animations and transforms
- No external libraries required

## Hero Classes

- **Destroyer** (5 heroes) - Red/Orange theme
- **Defender** (7 heroes) - Blue/Cyan theme
- **Saboteur** (5 heroes) - Purple/Magenta theme
- **Supporter** (6 heroes) - Green/Gold theme
- **Controller** (4 heroes) - Gold/Orange theme
- **Hawktalker** (0 heroes) - Cyan/Purple theme (coming soon)
