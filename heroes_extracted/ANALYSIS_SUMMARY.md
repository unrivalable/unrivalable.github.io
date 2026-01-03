# Heroes PowerPoint Analysis Summary

## Overview
Analyzed 52 slides from the heroes.pptx PowerPoint presentation to extract hero data organized by class.

## PowerPoint Structure

### Slide Organization
- **Slide 1**: Title slide ("Heroes")
- **Slides 2-52**: 6 class headers + 45 hero slides

### Classes Identified (6 total)

1. **Destroyers** (Slide 2)
   - Class Icon: `image2.png`
   - Hero Slides: 3-11 (9 heroes)
   - Complete Heroes: 5

2. **Defenders** (Slide 12)
   - Class Icon: `image12.jpg`
   - Hero Slides: 13-21 (9 heroes)
   - Complete Heroes: 7

3. **Saboteurs** (Slide 22)
   - Class Icon: `image22.jpg`
   - Hero Slides: 23-31 (9 heroes)
   - Complete Heroes: 5

4. **Supporters** (Slide 32)
   - Class Icon: `image32.jpg`
   - Hero Slides: 33-41 (9 heroes)
   - Complete Heroes: 6

5. **Controllers** (Slide 42)
   - Class Icon: `image42.png`
   - Hero Slides: 43-49 (7 heroes)
   - Complete Heroes: 4

6. **Hawktalkers** (Slide 50)
   - Class Icon: `image50.png`
   - Hero Slides: 51-52 (2 heroes)
   - Complete Heroes: 0

## Data Extraction Results

### Complete Heroes: 27 total

#### Destroyers (5/9 complete)
1. **Mr Unemployable** (Slide 3) - `image1.jpg`
2. **Porthole** (Slide 5) - `image4.jpg`
3. **The Triplets** (Slide 8) - `image7.png`
4. **Tickle Monster** (Slide 9) - `image8.jpg`
5. **Bee's Knees** (Slide 11) - `image10.jpg`

#### Defenders (7/9 complete)
1. **Handfoot** (Slide 13) - `image11.png`
2. **Floss** (Slide 14) - `image11.png`
3. **Man Guy** (Slide 15) - `image11.png`
4. **Ultraviolet** (Slide 17) - `image11.png`
5. **Guy Yacht** (Slide 18) - `image11.png`
6. **Captain Trumpet** (Slide 20) - `image11.png`
7. **Gym Shark** (Slide 21) - `image11.png`

#### Saboteurs (5/9 complete)
1. **Captain Crunch** (Slide 23) - `image21.png`
2. **Jonnakiss** (Slide 24) - `image23.jpg`
3. **Displeased Avian** (Slide 25) - `image21.png`
4. **MU†E-ÅNT** (Slide 27) - `image21.png`
5. **Machete Man** (Slide 29) - `image21.png`

#### Supporters (6/9 complete)
1. **Burger King** (Slide 33) - `image31.png`
2. **Brain Freeze** (Slide 35) - `image31.png`
3. **Didgeridon't** (Slide 37) - `image31.png`
4. **DishwasHER** (Slide 39) - `image31.png`
5. **PowerPoint** (Slide 40) - `image31.png`
6. **Shan't Dance** (Slide 41) - `image31.png`

#### Controllers (4/7 complete)
1. **Faceplant** (Slide 44) - `image42.png`
2. **Grom** (Slide 45) - `image42.png`
3. **Winter WonderGirl** (Slide 47) - `image42.png`
4. **Smurtle Gurltle Cheesecake Woman** (Slide 48) - `image47.jpg`

#### Hawktalkers (0/2 complete)
- All heroes in this class are incomplete (Moonhawk, They)

### Incomplete Heroes: 18 total

#### Destroyers (4 incomplete)
- James Madison (Slide 4)
- Bitey Whiteys (Slide 6)
- Iron Pan (Slide 7)
- Shoulder Blade (Slide 10)

#### Defenders (2 incomplete)
- Chair Beard (Slide 16)
- Yeast (Slide 19)

#### Saboteurs (4 incomplete)
- Voodude (Slide 26)
- Contortoise (Slide 28)
- Grup Scrooge (Slide 30)
- Captain Christingle (Seasonal) (Slide 31)

#### Supporters (3 incomplete)
- Defrilibatorator (Slide 34)
- Speedo (Slide 36)
- Corn Maiden (Slide 38)

#### Controllers (3 incomplete)
- Snow Angel (Slide 43)
- Jeanne Gris (Slide 46)
- Belt Tungus (Slide 49)

#### Hawktalkers (2 incomplete)
- Moonhawk (Slide 51)
- They (Slide 52)

## Hero Data Structure

Each complete hero slide contains:
- **Hero Name**: Title text at the top
- **Hero Image**: Main character image (typically rId3 in relationships)
- **Class Icon**: Small icon in top-right corner (typically rId4 in relationships)
- **Abilities**: Structured text containing:
  - Main Attack: Name and description
  - Ability 1: Name and description
  - Ability 2: Name and description
  - Super: Name and description

## Image Analysis

### Class Icons (6 unique)
- `image2.png` - Destroyers icon
- `image12.jpg` - Defenders icon
- `image22.jpg` - Saboteurs icon
- `image32.jpg` - Supporters icon
- `image42.png` - Controllers icon
- `image50.png` - Hawktalkers icon

### Hero Images
- Most heroes within a class share the same placeholder image
- Notable unique images:
  - Destroyers: Each hero has unique images (image1.jpg, image4.jpg, image7.png, image8.jpg, image10.jpg)
  - Defenders: All share image11.png
  - Saboteurs: Mostly share image21.png (except Jonnakiss with image23.jpg)
  - Supporters: All share image31.png
  - Controllers: Mostly share image42.png (except SGCW with image47.jpg)

## JSON Output Files

### `heroes_data.json`
Basic structure with raw ability text for each hero

### `heroes_data_structured.json`
Enhanced structure with attempted parsing of ability names/descriptions
(Note: Parsing is imperfect due to concatenated text without clear delimiters)

## Notes

1. **Completeness Criteria**: A hero is considered "complete" if it has all four ability labels (Main Attack, Ability 1, Ability 2, Super) AND at least the Main Attack has descriptive content beyond just the label.

2. **Image Reuse**: Many heroes within the same class share the same image file, suggesting these are placeholder images that haven't been replaced with unique hero art yet.

3. **Hawktalkers Class**: This class has no complete heroes - both Moonhawk and They slides are missing ability information entirely.

4. **Special Characters**: Some hero names contain special Unicode characters (e.g., MU†E-ÅNT)

5. **Text Concatenation**: The PowerPoint XML stores all text runs concatenated together without whitespace, making it challenging to parse ability names vs descriptions cleanly.

## File Locations

- PowerPoint extraction: `/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted/`
- Slide XML files: `/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted/ppt/slides/`
- Media files: `/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted/ppt/media/`
- JSON output: `/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted/heroes_data.json`
- Structured JSON: `/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted/heroes_data_structured.json`
