# Heroes PowerPoint Data Extraction

This directory contains the extracted and analyzed data from the `heroes.pptx` PowerPoint file.

## Quick Summary

- **Total Slides**: 52
- **Classes**: 6 (Destroyers, Defenders, Saboteurs, Supporters, Controllers, Hawktalkers)
- **Complete Heroes**: 27 out of 45 (60% completion rate)
- **Incomplete Heroes**: 18 (missing ability descriptions)

## Directory Structure

```
heroes_extracted/
├── ppt/
│   ├── slides/          # 52 slide XML files
│   │   ├── slide1.xml   # Title slide
│   │   ├── slide2.xml   # Destroyers class header
│   │   ├── slide3.xml   # Mr Unemployable hero
│   │   └── ...
│   ├── media/           # 50+ image files (hero images and class icons)
│   └── ...
├── heroes_data.json                  # Complete hero data (raw format)
├── heroes_data_structured.json       # Attempted structured parsing of abilities
├── heroes_summary.json               # Clean summary with metadata
├── parse_heroes.py                   # Python script to extract basic data
├── parse_heroes_structured.py        # Python script with ability parsing
├── ANALYSIS_SUMMARY.md               # Detailed analysis report
└── README.md                         # This file
```

## Generated Files

### JSON Data Files

1. **heroes_summary.json** (18KB) - RECOMMENDED
   - Clean, easy-to-use format
   - Includes metadata (total counts, completion rate)
   - Contains all complete heroes organized by class
   - Each hero has: name, image, abilities (raw text), slide number

2. **heroes_data.json** (17KB)
   - Basic extraction format
   - Raw abilities text for each hero
   - Organized by class with class icons

3. **heroes_data_structured.json** (41KB)
   - Attempted parsing of ability names/descriptions
   - Note: Parsing is imperfect due to concatenated text format
   - Includes both raw and structured ability data

### Documentation

4. **ANALYSIS_SUMMARY.md** (5.9KB)
   - Comprehensive analysis report
   - Lists all complete and incomplete heroes
   - Details about slide organization
   - Image mapping information

5. **README.md** (this file)
   - Overview and usage guide

### Python Scripts

6. **parse_heroes.py** (7.2KB)
   - Basic extraction script
   - Identifies complete vs incomplete heroes
   - Generates heroes_data.json

7. **parse_heroes_structured.py** (11KB)
   - Enhanced extraction with ability parsing
   - Generates heroes_data_structured.json

## Class Breakdown

### Destroyers (55.6% complete)
- **Icon**: image2.png
- **Complete**: 5/9 heroes
- Heroes: Mr Unemployable, Porthole, The Triplets, Tickle Monster, Bee's Knees

### Defenders (77.8% complete)
- **Icon**: image12.jpg
- **Complete**: 7/9 heroes
- Heroes: Handfoot, Floss, Man Guy, Ultraviolet, Guy Yacht, Captain Trumpet, Gym Shark

### Saboteurs (55.6% complete)
- **Icon**: image22.jpg
- **Complete**: 5/9 heroes
- Heroes: Captain Crunch, Jonnakiss, Displeased Avian, MU†E-ÅNT, Machete Man

### Supporters (66.7% complete)
- **Icon**: image32.jpg
- **Complete**: 6/9 heroes
- Heroes: Burger King, Brain Freeze, Didgeridon't, DishwasHER, PowerPoint, Shan't Dance

### Controllers (57.1% complete)
- **Icon**: image42.png
- **Complete**: 4/7 heroes
- Heroes: Faceplant, Grom, Winter WonderGirl, Smurtle Gurltle Cheesecake Woman

### Hawktalkers (0% complete)
- **Icon**: image50.png
- **Complete**: 0/2 heroes
- Both heroes (Moonhawk, They) are missing ability information

## Data Format Example

```json
{
  "name": "Mr Unemployable",
  "image": "image1.jpg",
  "abilities": "Main Attack: What goes forth...",
  "slide": 3
}
```

Each hero contains:
- `name`: Hero name
- `image`: Reference to hero image file in ppt/media/
- `abilities`: Raw text containing all ability descriptions
- `slide`: Slide number in the PowerPoint

## Ability Structure

Complete heroes have four abilities defined:
1. **Main Attack**: Primary attack ability
2. **Ability 1**: First special ability
3. **Ability 2**: Second special ability
4. **Super**: Ultimate/super ability

## Image Files

### Class Icons (6 files)
- image2.png (Destroyers)
- image12.jpg (Defenders)
- image22.jpg (Saboteurs)
- image32.jpg (Supporters)
- image42.png (Controllers)
- image50.png (Hawktalkers)

### Hero Images
- Most heroes within each class share placeholder images
- Some heroes have unique images (e.g., each Destroyer has a unique image)
- Images are stored in `/ppt/media/` directory

## Usage

### Load Hero Data (JavaScript/Node.js)

```javascript
const heroData = require('./heroes_summary.json');

// Get metadata
console.log(heroData.metadata.complete_heroes); // 27

// Iterate through classes
heroData.classes.forEach(heroClass => {
  console.log(`${heroClass.name}: ${heroClass.hero_count} heroes`);

  heroClass.heroes.forEach(hero => {
    console.log(`  - ${hero.name} (${hero.image})`);
  });
});
```

### Load Hero Data (Python)

```python
import json

with open('heroes_summary.json', 'r') as f:
    data = json.load(f)

# Get metadata
print(f"Total complete heroes: {data['metadata']['complete_heroes']}")

# Iterate through classes
for hero_class in data['classes']:
    print(f"{hero_class['name']}: {hero_class['hero_count']} heroes")

    for hero in hero_class['heroes']:
        print(f"  - {hero['name']} ({hero['image']})")
```

## Re-running the Extraction

To re-extract the data:

```bash
# Basic extraction
python3 parse_heroes.py

# Structured extraction (with ability parsing)
python3 parse_heroes_structured.py
```

## Notes

1. **Incomplete Heroes**: Heroes marked as incomplete have the ability structure (labels) but no descriptive content. These were intentionally skipped in the JSON output.

2. **Text Concatenation**: The PowerPoint XML format concatenates all text runs together without spaces, making it challenging to cleanly separate ability names from descriptions.

3. **Image Placeholders**: Many heroes share the same image file, suggesting they use placeholder art that hasn't been replaced with final character designs.

4. **Unicode Characters**: Some hero names contain special characters (e.g., MU†E-ÅNT).

## File Paths

All paths in this README are relative to:
```
/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted/
```

## Last Updated

January 2, 2026
