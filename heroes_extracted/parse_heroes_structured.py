#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import json
import os
import re

# Define namespaces
NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def get_text_from_shape(shape):
    """Extract all text from a shape element."""
    texts = []
    for t in shape.findall('.//a:t', NS):
        if t.text:
            texts.append(t.text)
    return ''.join(texts).strip()

def get_image_refs(slide_num, base_path):
    """Get image references from the relationships file."""
    rels_path = os.path.join(base_path, f'ppt/slides/_rels/slide{slide_num}.xml.rels')
    if not os.path.exists(rels_path):
        return {}

    tree = ET.parse(rels_path)
    root = tree.getroot()

    images = {}
    for rel in root.findall('.//Relationship', {'': 'http://schemas.openxmlformats.org/package/2006/relationships'}):
        rel_type = rel.get('Type')
        if 'image' in rel_type:
            rel_id = rel.get('Id')
            target = rel.get('Target')
            # Extract just the filename
            image_name = os.path.basename(target)
            images[rel_id] = image_name

    return images

def parse_abilities(abilities_text):
    """Parse the abilities text into structured format."""
    abilities = {
        'main_attack': {'name': '', 'description': ''},
        'ability_1': {'name': '', 'description': ''},
        'ability_2': {'name': '', 'description': ''},
        'super': {'name': '', 'description': ''}
    }

    # Try to extract Main Attack
    if 'Main Attack:' in abilities_text:
        main_part = abilities_text.split('Main Attack:')[1]
        if 'Ability 1:' in main_part:
            main_content = main_part.split('Ability 1:')[0].strip()
        else:
            main_content = main_part.strip()

        # Try to separate name from description
        # Often format is "Name: Description" or just "Description"
        if main_content:
            # Check if there's a name followed by description
            lines = main_content.split('\n')
            first_line = lines[0] if lines else main_content

            # If first line ends with a word and next starts lowercase, it's likely name + description
            parts = re.split(r'([A-Z][a-z\s\'-]+(?:[A-Z][a-z\s\'-]+)*)', first_line, maxsplit=1)
            if len(parts) > 1 and parts[1]:
                abilities['main_attack']['name'] = parts[1].strip()
                abilities['main_attack']['description'] = ''.join(parts[2:]).strip()
            else:
                abilities['main_attack']['description'] = main_content

    # Extract Ability 1
    if 'Ability 1:' in abilities_text:
        ability1_part = abilities_text.split('Ability 1:')[1]
        if 'Ability 2:' in ability1_part:
            ability1_content = ability1_part.split('Ability 2:')[0].strip()
        else:
            ability1_content = ability1_part.strip()

        if ability1_content:
            lines = ability1_content.split('\n')
            first_line = lines[0] if lines else ability1_content
            parts = re.split(r'([A-Z][a-z\s\'-]+(?:[A-Z][a-z\s\'-]+)*)', first_line, maxsplit=1)
            if len(parts) > 1 and parts[1]:
                abilities['ability_1']['name'] = parts[1].strip()
                abilities['ability_1']['description'] = ''.join(parts[2:]).strip()
            else:
                abilities['ability_1']['description'] = ability1_content

    # Extract Ability 2
    if 'Ability 2:' in abilities_text:
        ability2_part = abilities_text.split('Ability 2:')[1]
        if 'Super:' in ability2_part:
            ability2_content = ability2_part.split('Super:')[0].strip()
        else:
            ability2_content = ability2_part.strip()

        if ability2_content:
            lines = ability2_content.split('\n')
            first_line = lines[0] if lines else ability2_content
            parts = re.split(r'([A-Z][a-z\s\'-]+(?:[A-Z][a-z\s\'-]+)*)', first_line, maxsplit=1)
            if len(parts) > 1 and parts[1]:
                abilities['ability_2']['name'] = parts[1].strip()
                abilities['ability_2']['description'] = ''.join(parts[2:]).strip()
            else:
                abilities['ability_2']['description'] = ability2_content

    # Extract Super
    if 'Super:' in abilities_text:
        super_content = abilities_text.split('Super:')[1].strip()
        if super_content:
            lines = super_content.split('\n')
            first_line = lines[0] if lines else super_content
            parts = re.split(r'([A-Z][a-z\s\'-]+(?:[A-Z][a-z\s\'-]+)*)', first_line, maxsplit=1)
            if len(parts) > 1 and parts[1]:
                abilities['super']['name'] = parts[1].strip()
                abilities['super']['description'] = ''.join(parts[2:]).strip()
            else:
                abilities['super']['description'] = super_content

    return abilities

def is_class_header_slide(slide_path):
    """Check if this is a class header slide (no images, just class name)."""
    tree = ET.parse(slide_path)
    root = tree.getroot()

    # Check if there are any images
    pics = root.findall('.//p:pic', NS)

    # Get the text content
    shapes = root.findall('.//p:sp', NS)
    texts = []
    for shape in shapes:
        text = get_text_from_shape(shape)
        if text:
            texts.append(text)

    # Class header has no images and contains class name
    return len(pics) == 0 and len(texts) > 0 and texts[0] != "Heroes  "

def parse_hero_slide(slide_num, base_path):
    """Parse a hero slide and extract information."""
    slide_path = os.path.join(base_path, f'ppt/slides/slide{slide_num}.xml')

    tree = ET.parse(slide_path)
    root = tree.getroot()

    # Get image references
    images = get_image_refs(slide_num, base_path)

    # Extract text from all shapes
    shapes = root.findall('.//p:sp', NS)
    texts = []
    for shape in shapes:
        text = get_text_from_shape(shape)
        if text:
            texts.append(text)

    # Extract hero name (first text element)
    hero_name = texts[0] if texts else None

    # Extract abilities text (second text element typically contains abilities)
    abilities_text = texts[1] if len(texts) > 1 else ""

    # Get image references from pics
    pics = root.findall('.//p:pic', NS)
    hero_image = None
    class_icon = None

    for pic in pics:
        blip = pic.find('.//a:blip', NS)
        if blip is not None:
            embed_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            if embed_id in images:
                image_name = images[embed_id]
                # First image (rId3) is usually the hero image
                # Second image (rId4) is usually the class icon
                if hero_image is None:
                    hero_image = image_name
                else:
                    class_icon = image_name

    # Check if hero has meaningful content
    has_main_attack = "Main Attack:" in abilities_text
    has_ability_1 = "Ability 1:" in abilities_text
    has_ability_2 = "Ability 2:" in abilities_text
    has_super = "Super:" in abilities_text

    # Check if abilities have actual content (not just labels)
    # Look for content after "Main Attack:" label
    if "Main Attack:" in abilities_text:
        main_attack_section = abilities_text.split("Main Attack:")[1].split("Ability")[0] if "Ability" in abilities_text.split("Main Attack:")[1] else abilities_text.split("Main Attack:")[1]
        has_main_attack_content = len(main_attack_section.strip()) > 0
    else:
        has_main_attack_content = False

    # Hero is complete if it has all labels AND at least the main attack has content
    is_complete = (has_main_attack and has_ability_1 and has_ability_2 and
                   has_super and has_main_attack_content)

    # Parse abilities into structured format
    parsed_abilities = parse_abilities(abilities_text) if is_complete else None

    return {
        'hero_name': hero_name,
        'hero_image': hero_image,
        'class_icon': class_icon,
        'abilities_raw': abilities_text,
        'abilities': parsed_abilities,
        'is_complete': is_complete,
        'slide_num': slide_num
    }

def main():
    base_path = '/Users/nicholas/GitHub/unrivalable.github.io/heroes_extracted'

    # Structure to hold all data
    heroes_data = {
        'classes': {}
    }

    current_class = None
    current_class_icon = None

    # Process all slides
    for i in range(1, 53):
        slide_path = os.path.join(base_path, f'ppt/slides/slide{i}.xml')

        # Skip slide 1 (title slide)
        if i == 1:
            continue

        # Check if this is a class header
        if is_class_header_slide(slide_path):
            tree = ET.parse(slide_path)
            root = tree.getroot()
            shapes = root.findall('.//p:sp', NS)
            class_name = None
            for shape in shapes:
                text = get_text_from_shape(shape)
                if text:
                    class_name = text.strip()
                    break

            if class_name:
                current_class = class_name
                heroes_data['classes'][current_class] = {
                    'heroes': [],
                    'class_icon': None
                }
                print(f"Found class header: {class_name} (Slide {i})")
        else:
            # Parse hero slide
            hero_data = parse_hero_slide(i, base_path)

            if hero_data['hero_name'] and current_class:
                # Store the class icon if we haven't yet
                if heroes_data['classes'][current_class]['class_icon'] is None and hero_data['class_icon']:
                    heroes_data['classes'][current_class]['class_icon'] = hero_data['class_icon']

                # Only add complete heroes
                if hero_data['is_complete']:
                    heroes_data['classes'][current_class]['heroes'].append({
                        'name': hero_data['hero_name'],
                        'image': hero_data['hero_image'],
                        'abilities': hero_data['abilities'],
                        'abilities_raw': hero_data['abilities_raw'],
                        'slide': hero_data['slide_num']
                    })
                    print(f"  ✓ Added hero: {hero_data['hero_name']} (Slide {i})")
                else:
                    print(f"  ✗ Skipped incomplete hero: {hero_data['hero_name']} (Slide {i})")

    # Save to JSON
    output_path = os.path.join(base_path, 'heroes_data_structured.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(heroes_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Saved hero data to {output_path}")

    # Print summary
    print("\n=== SUMMARY ===")
    total_complete = 0
    for class_name, class_data in heroes_data['classes'].items():
        print(f"\n{class_name}:")
        print(f"  Class Icon: {class_data['class_icon']}")
        print(f"  Complete Heroes: {len(class_data['heroes'])}")
        total_complete += len(class_data['heroes'])
        for hero in class_data['heroes']:
            print(f"    - {hero['name']} (slide {hero['slide']})")

    print(f"\n📊 Total: {total_complete} complete heroes across 6 classes")
    print(f"📊 Total slides: 52 (1 title + 6 class headers + 45 hero slides)")

if __name__ == '__main__':
    main()
