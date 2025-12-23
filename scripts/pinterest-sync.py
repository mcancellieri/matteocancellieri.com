#!/usr/bin/env python3
# scripts/sync-pinterest.py

import os
import json
import re
from pinterest_dl import PinterestDL

# Your Pinterest profile or board URL
PINTEREST_URL = os.getenv('PINTEREST_URL', 'https://uk.pinterest.com/matteocancellie/_tpd_social/')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../social')

def extract_hashtags(description):
    """Extract hashtags from pin description"""
    if not description:
        return []
    hashtags = re.findall(r'#(\w+)', description)
    return [tag.lower() for tag in hashtags]

def organize_by_hashtag(pins_data):
    """Organize downloaded pins into folders by first hashtag"""
    metadata = []

    for pin in pins_data:
        # Get hashtags from description
        description = pin.get('description', '') or pin.get('alt_text', '')
        hashtags = extract_hashtags(description)

        # Use first hashtag as category, or 'uncategorized'
        category = hashtags[0] if hashtags else 'uncategorized'

        # Get the downloaded image path
        image_path = pin.get('path')
        if not image_path or not os.path.exists(image_path):
            continue

        # Create category folder
        category_dir = os.path.join(OUTPUT_DIR, category)
        os.makedirs(category_dir, exist_ok=True)

        # Move image to category folder
        filename = os.path.basename(image_path)
        new_path = os.path.join(category_dir, filename)

        # Move file if not already in the right place
        if image_path != new_path:
            os.rename(image_path, new_path)

        # Store metadata
        metadata.append({
            'id': pin.get('id'),
            'category': category,
            'hashtags': hashtags,
            'title': pin.get('title', ''),
            'description': description,
            'url': pin.get('url', ''),
            'localPath': f'photos/{category}/{filename}',
            'width': pin.get('width'),
            'height': pin.get('height'),
            'created_at': pin.get('created_at')
        })

    return metadata

def main():
    print('🔄 Fetching Pinterest pins...')

    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    temp_dir = os.path.join(OUTPUT_DIR, 'temp')

    # Download pins
    pins = PinterestDL.with_api(
        timeout=5,
        verbose=True,
        ensure_alt=True
    ).scrape_and_download(
        url=PINTEREST_URL,
        output_dir=temp_dir,
        num=100,  # Download last 100 pins
        min_resolution=(512, 512),  # Minimum resolution
        cache_path=os.path.join(OUTPUT_DIR, 'pinterest_cache.json'),
        caption='json',  # Save metadata as JSON
        delay=0.5  # Delay between requests
    )

    print(f'📸 Downloaded {len(pins)} pins')

    # Load the cached data with full metadata
    cache_path = os.path.join(OUTPUT_DIR, 'pinterest_cache.json')
    if os.path.exists(cache_path):
        with open(cache_path, 'r', encoding='utf-8') as f:
            pins_data = json.load(f)
    else:
        pins_data = []

    # Organize pins by hashtag
    print('📁 Organizing pins by hashtags...')
    metadata = organize_by_hashtag(pins_data)

    # Save metadata
    metadata_path = os.path.join(OUTPUT_DIR, 'metadata.json')
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    # Clean up temp directory
    if os.path.exists(temp_dir):
        import shutil
        shutil.rmtree(temp_dir)

    print('✅ Pinterest sync complete!')
    print(f'📁 Photos organized in: {OUTPUT_DIR}')
    print(f'📊 Metadata saved to: {metadata_path}')

if __name__ == '__main__':
    main()