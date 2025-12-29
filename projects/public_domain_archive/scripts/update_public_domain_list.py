#!/usr/bin/env python3
"""
Public Domain Archive - Data Update Script
==========================================
Run this quarterly to fetch new works from public domain sources.

Usage:
    python update.py                    # Full update from all sources
    python update.py --source gutenberg # Update from specific source
    python update.py --dry-run          # Preview without saving
    python update.py --limit 10         # Limit items per source

Requirements:
    pip install requests beautifulsoup4 feedparser

Sources:
    - Project Gutenberg (literature)
    - Standard eBooks (literature)
    - Internet Archive (film)
    - IMSLP (music) - via RSS
    - Wikimedia Commons (art)
"""

import json
import csv
import requests
from datetime import datetime
from pathlib import Path
from io import StringIO
import argparse
import sys
import re
import time

try:
    import feedparser
    HAS_FEEDPARSER = True
except ImportError:
    HAS_FEEDPARSER = False
    print("Warning: feedparser not installed. Run: pip install feedparser")

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False
    print("Warning: beautifulsoup4 not installed. Run: pip install beautifulsoup4")

# ============================================
# CONFIGURATION
# ============================================

# Path to your index.html file (relative to repo root)
INDEX_HTML_PATH = Path(__file__).parent.parent / "index.html"

# Backup directory
BACKUP_DIR = Path(__file__).parent / "backups"

# API endpoints
GUTENBERG_CSV_URL = "https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv"
ARCHIVE_API_URL = "https://archive.org/advancedsearch.php"
STANDARD_EBOOKS_FEED = "https://standardebooks.org/feeds/rss/new-releases"
IMSLP_RECENT_URL = "https://imslp.org/wiki/Special:RecentChanges"
WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php"

# Subcategory mappings
LITERATURE_SUBCATEGORIES = {
    'novel': 'novels',
    'fiction': 'novels',
    'short story': 'short-stories',
    'short stories': 'short-stories',
    'poetry': 'poetry',
    'poem': 'poetry',
    'play': 'plays',
    'drama': 'plays',
    'essay': 'essays',
    'non-fiction': 'essays',
}

MUSIC_SUBCATEGORIES = {
    'symphony': 'symphonies',
    'concerto': 'concertos',
    'piano': 'piano',
    'sonata': 'piano',
    'opera': 'opera',
    'ballet': 'ballet',
    'chamber': 'chamber',
    'quartet': 'chamber',
}

FILM_SUBCATEGORIES = {
    'silent': 'silent',
    'comedy': 'comedy',
    'horror': 'horror',
    'drama': 'drama',
    'thriller': 'thriller',
    'documentary': 'documentary',
}

ART_SUBCATEGORIES = {
    'painting': 'paintings',
    'oil': 'paintings',
    'watercolor': 'paintings',
    'print': 'prints',
    'woodcut': 'prints',
    'engraving': 'prints',
    'fresco': 'murals',
    'mural': 'murals',
}

# ============================================
# UTILITY FUNCTIONS
# ============================================

def log(msg, level="INFO"):
    """Simple logging."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {level}: {msg}")

def backup_current_data(html_content):
    """Create a backup before modifying."""
    BACKUP_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = BACKUP_DIR / f"index_backup_{timestamp}.html"
    backup_path.write_text(html_content)
    log(f"Backup saved to {backup_path}")
    return backup_path

def extract_works_from_html(html_content):
    """Extract the WORKS_DATA array from index.html."""
    start_marker = "const WORKS_DATA = ["

    start_idx = html_content.find(start_marker)
    if start_idx == -1:
        raise ValueError("Could not find WORKS_DATA in index.html")

    # Find the matching closing bracket
    bracket_count = 0
    end_idx = start_idx + len(start_marker) - 1

    for i, char in enumerate(html_content[start_idx + len(start_marker) - 1:], start=start_idx + len(start_marker) - 1):
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_idx = i + 1
                break

    json_str = html_content[start_idx + len("const WORKS_DATA = "):end_idx]

    # Remove JavaScript comments (// style) that aren't valid JSON
    lines = json_str.split('\n')
    cleaned_lines = []
    for line in lines:
        # Remove // comments (but not inside strings)
        if '//' in line:
            # Simple approach: if line is mostly a comment, skip it
            stripped = line.strip()
            if stripped.startswith('//'):
                continue
            # Otherwise remove trailing comment
            comment_idx = line.find('//')
            # Check if it's inside a string by counting quotes before it
            before_comment = line[:comment_idx]
            if before_comment.count('"') % 2 == 0:
                line = before_comment.rstrip()
                if line.rstrip().endswith(','):
                    cleaned_lines.append(line)
                    continue
        cleaned_lines.append(line)
    json_str = '\n'.join(cleaned_lines)

    # Convert JavaScript object syntax to JSON (quote unquoted keys)
    # Match patterns like { id: or , id: and convert to { "id": or , "id":
    json_str = re.sub(r'([{,]\s*)(\w+)(\s*:)', r'\1"\2"\3', json_str)

    # Parse JSON (JavaScript arrays are valid JSON)
    try:
        works = json.loads(json_str)
        return works, start_idx, end_idx
    except json.JSONDecodeError as e:
        log(f"Error parsing WORKS_DATA: {e}", "ERROR")
        raise

def save_works_to_html(html_content, works, start_idx, end_idx):
    """Replace the WORKS_DATA array in index.html."""
    # Format the works array nicely
    works_json = json.dumps(works, indent=12, ensure_ascii=False)

    # Reconstruct the HTML
    new_content = (
        html_content[:start_idx] +
        "const WORKS_DATA = " +
        works_json +
        html_content[end_idx:]
    )

    return new_content

def get_next_id(works, category):
    """Get the next available ID for a category."""
    category_ids = {
        'literature': 1,
        'music': 101,
        'film': 201,
        'art': 301,
        'software': 401
    }

    base = category_ids.get(category, 1)
    existing = [w['id'] for w in works if w['category'] == category]

    if not existing:
        return base

    return max(existing) + 1

def guess_subcategory(title, description, category):
    """Guess the subcategory based on title and description."""
    text = f"{title} {description}".lower()

    if category == 'literature':
        for keyword, subcat in LITERATURE_SUBCATEGORIES.items():
            if keyword in text:
                return subcat
        return 'novels'  # Default

    elif category == 'music':
        for keyword, subcat in MUSIC_SUBCATEGORIES.items():
            if keyword in text:
                return subcat
        return 'chamber'  # Default

    elif category == 'film':
        for keyword, subcat in FILM_SUBCATEGORIES.items():
            if keyword in text:
                return subcat
        return 'drama'  # Default

    elif category == 'art':
        for keyword, subcat in ART_SUBCATEGORIES.items():
            if keyword in text:
                return subcat
        return 'paintings'  # Default

    return None

# ============================================
# PROJECT GUTENBERG FETCHER
# ============================================

def fetch_gutenberg_works(existing_works, limit=30):
    """Fetch popular works from Project Gutenberg."""
    log("Fetching from Project Gutenberg...")

    try:
        response = requests.get(GUTENBERG_CSV_URL, timeout=60)
        response.raise_for_status()
    except requests.RequestException as e:
        log(f"Failed to fetch Gutenberg catalog: {e}", "ERROR")
        return []

    # Parse CSV
    csv_content = StringIO(response.text)
    reader = csv.DictReader(csv_content)

    # Get existing titles to avoid duplicates
    existing_titles = {w['title'].lower() for w in existing_works}

    new_works = []
    count = 0

    for row in reader:
        if count >= limit:
            break

        title = row.get('Title', '').strip()
        author = row.get('Authors', '').strip()
        language = row.get('Language', '').strip()
        subjects = row.get('Subjects', '').lower()

        # Skip non-English or empty entries
        if language != 'en' or not title or not author:
            continue

        # Skip if already exists
        if title.lower() in existing_titles:
            continue

        # Clean up author name (remove dates, etc.)
        if ',' in author:
            parts = author.split(',')
            author = f"{parts[1].strip()} {parts[0].strip()}".strip()
        # Remove birth/death years
        author = re.sub(r'\d{4}-\d{4}', '', author).strip()

        # Extract year from title if present
        year = 1900  # Default

        ebook_id = row.get('Text#', '')

        # Determine format/subcategory
        format_type = 'Novel'
        subcategory = 'novels'
        if 'poetry' in subjects or 'poems' in subjects:
            format_type = 'Poetry'
            subcategory = 'poetry'
        elif 'short stor' in subjects:
            format_type = 'Short Stories'
            subcategory = 'short-stories'
        elif 'drama' in subjects or 'plays' in subjects:
            format_type = 'Play'
            subcategory = 'plays'

        new_work = {
            'id': 0,  # Will be assigned later
            'title': title,
            'creator': author,
            'year': year,
            'category': 'literature',
            'subcategory': subcategory,
            'source': 'Project Gutenberg',
            'sourceUrl': f"https://www.gutenberg.org/ebooks/{ebook_id}",
            'description': f"Classic literature available in multiple formats.",
            'country': 'Various',
            'format': format_type
        }

        new_works.append(new_work)
        existing_titles.add(title.lower())
        count += 1

    log(f"Found {len(new_works)} new works from Gutenberg")
    return new_works

# ============================================
# STANDARD EBOOKS FETCHER
# ============================================

def fetch_standard_ebooks(existing_works, limit=20):
    """Fetch from Standard eBooks RSS feed."""
    if not HAS_FEEDPARSER:
        log("Skipping Standard eBooks (feedparser not installed)", "WARN")
        return []

    log("Fetching from Standard eBooks...")

    try:
        feed = feedparser.parse(STANDARD_EBOOKS_FEED)
    except Exception as e:
        log(f"Failed to fetch Standard eBooks: {e}", "ERROR")
        return []

    existing_titles = {w['title'].lower() for w in existing_works}
    new_works = []

    for entry in feed.entries[:limit * 2]:
        if len(new_works) >= limit:
            break

        title = entry.get('title', '').strip()
        if not title or title.lower() in existing_titles:
            continue

        # Extract author from title (format: "Title, by Author")
        author = 'Unknown'
        if ', by ' in title:
            parts = title.rsplit(', by ', 1)
            title = parts[0]
            author = parts[1]

        link = entry.get('link', '')
        description = entry.get('summary', '')[:200]

        # Try to get year from description
        year = 1900
        year_match = re.search(r'\b(1[0-9]{3})\b', description)
        if year_match:
            year = int(year_match.group(1))

        subcategory = guess_subcategory(title, description, 'literature')

        new_work = {
            'id': 0,
            'title': title,
            'creator': author,
            'year': year,
            'category': 'literature',
            'subcategory': subcategory,
            'source': 'Standard eBooks',
            'sourceUrl': link,
            'description': description or 'Beautifully formatted public domain ebook.',
            'country': 'Various',
            'format': 'Novel'
        }

        new_works.append(new_work)
        existing_titles.add(title.lower())

    log(f"Found {len(new_works)} new works from Standard eBooks")
    return new_works

# ============================================
# INTERNET ARCHIVE FETCHER
# ============================================

def fetch_archive_films(existing_works, limit=20):
    """Fetch public domain films from Internet Archive."""
    log("Fetching from Internet Archive...")

    params = {
        'q': 'collection:feature_films AND mediatype:movies',
        'fl[]': ['identifier', 'title', 'creator', 'year', 'description'],
        'sort[]': 'downloads desc',
        'rows': limit * 2,
        'page': 1,
        'output': 'json'
    }

    try:
        response = requests.get(ARCHIVE_API_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        log(f"Failed to fetch from Internet Archive: {e}", "ERROR")
        return []

    existing_titles = {w['title'].lower() for w in existing_works}
    new_works = []

    for doc in data.get('response', {}).get('docs', []):
        if len(new_works) >= limit:
            break

        title = doc.get('title', '').strip()
        if not title or title.lower() in existing_titles:
            continue

        creator = doc.get('creator', ['Unknown'])
        if isinstance(creator, list):
            creator = creator[0] if creator else 'Unknown'

        year = doc.get('year', 1920)
        try:
            year = int(year)
        except (ValueError, TypeError):
            year = 1920

        description = doc.get('description', '')
        if isinstance(description, list):
            description = description[0] if description else ''
        description = description[:200] + '...' if len(description) > 200 else description

        identifier = doc.get('identifier', '')

        subcategory = guess_subcategory(title, description, 'film')

        new_work = {
            'id': 0,
            'title': title,
            'creator': creator,
            'year': year,
            'category': 'film',
            'subcategory': subcategory,
            'source': 'Internet Archive',
            'sourceUrl': f"https://archive.org/details/{identifier}",
            'description': description or 'Public domain film available for streaming and download.',
            'country': 'USA',
            'format': 'Film'
        }

        new_works.append(new_work)
        existing_titles.add(title.lower())

    log(f"Found {len(new_works)} new films from Internet Archive")
    return new_works

# ============================================
# WIKIMEDIA COMMONS FETCHER (ART)
# ============================================

def fetch_wikimedia_art(existing_works, limit=20):
    """Fetch featured public domain artwork from Wikimedia Commons."""
    log("Fetching from Wikimedia Commons...")

    # Search for featured pictures of paintings
    params = {
        'action': 'query',
        'format': 'json',
        'generator': 'categorymembers',
        'gcmtitle': 'Category:Featured pictures of paintings',
        'gcmtype': 'file',
        'gcmlimit': limit * 2,
        'prop': 'imageinfo|categories',
        'iiprop': 'url|extmetadata',
    }

    headers = {
        'User-Agent': 'PublicDomainArchive/1.0 (https://dabblefish.com; contact@dabblefish.com)'
    }

    try:
        response = requests.get(WIKIMEDIA_API_URL, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        log(f"Failed to fetch from Wikimedia Commons: {e}", "ERROR")
        return []

    existing_titles = {w['title'].lower() for w in existing_works}
    new_works = []

    pages = data.get('query', {}).get('pages', {})

    for page_id, page in pages.items():
        if len(new_works) >= limit:
            break

        # Get image info
        imageinfo = page.get('imageinfo', [{}])[0]
        metadata = imageinfo.get('extmetadata', {})

        title = metadata.get('ObjectName', {}).get('value', '')
        if not title:
            title = page.get('title', '').replace('File:', '').replace('.jpg', '').replace('.png', '')

        if not title or title.lower() in existing_titles:
            continue

        creator = metadata.get('Artist', {}).get('value', 'Unknown')
        # Clean HTML from creator
        if HAS_BS4:
            creator = BeautifulSoup(creator, 'html.parser').get_text()
        creator = creator[:100]  # Limit length

        description = metadata.get('ImageDescription', {}).get('value', '')
        if HAS_BS4:
            description = BeautifulSoup(description, 'html.parser').get_text()
        description = description[:200]

        # Get year
        date_str = metadata.get('DateTimeOriginal', {}).get('value', '')
        year = 1800
        year_match = re.search(r'\b(1[0-9]{3})\b', date_str)
        if year_match:
            year = int(year_match.group(1))

        url = imageinfo.get('descriptionurl', '')

        subcategory = guess_subcategory(title, description, 'art')

        new_work = {
            'id': 0,
            'title': title[:100],  # Limit title length
            'creator': creator,
            'year': year,
            'category': 'art',
            'subcategory': subcategory,
            'source': 'Wikimedia Commons',
            'sourceUrl': url,
            'description': description or 'Public domain artwork.',
            'country': 'Various',
            'format': 'Painting'
        }

        new_works.append(new_work)
        existing_titles.add(title.lower())

    log(f"Found {len(new_works)} new artworks from Wikimedia Commons")
    return new_works

# ============================================
# IMSLP FETCHER (MUSIC)
# ============================================

def fetch_imslp_music(existing_works, limit=20):
    """Fetch popular works from IMSLP via their API."""
    log("Fetching from IMSLP...")

    # IMSLP uses MediaWiki API
    api_url = "https://imslp.org/api.php"

    headers = {
        'User-Agent': 'PublicDomainArchive/1.0 (https://dabblefish.com; contact@dabblefish.com)'
    }

    # Try different category for popular composers
    params = {
        'action': 'query',
        'format': 'json',
        'list': 'categorymembers',
        'cmtitle': 'Category:Beethoven, Ludwig van',
        'cmlimit': limit * 3,
        'cmtype': 'page'
    }

    try:
        response = requests.get(api_url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        log(f"Failed to fetch from IMSLP: {e}", "ERROR")
        return []

    existing_titles = {w['title'].lower() for w in existing_works}
    new_works = []

    members = data.get('query', {}).get('categorymembers', [])

    for member in members:
        if len(new_works) >= limit:
            break

        title = member.get('title', '')
        if not title or title.lower() in existing_titles:
            continue

        # Skip category pages
        if title.startswith('Category:'):
            continue

        # Parse IMSLP title format: "Work Title (Composer, First)"
        creator = 'Unknown'
        work_title = title

        match = re.match(r'^(.+?)\s*\(([^)]+)\)$', title)
        if match:
            work_title = match.group(1).strip()
            creator = match.group(2).strip()
            # Reverse "Last, First" to "First Last"
            if ',' in creator:
                parts = creator.split(',', 1)
                creator = f"{parts[1].strip()} {parts[0].strip()}"

        # Default year (will need manual correction)
        year = 1800

        url = f"https://imslp.org/wiki/{title.replace(' ', '_')}"

        subcategory = guess_subcategory(work_title, '', 'music')

        # Determine format from title
        format_type = 'Sheet Music'
        if 'symphony' in work_title.lower():
            format_type = 'Symphony'
        elif 'concerto' in work_title.lower():
            format_type = 'Concerto'
        elif 'sonata' in work_title.lower():
            format_type = 'Sonata'
        elif 'opera' in work_title.lower():
            format_type = 'Opera'

        new_work = {
            'id': 0,
            'title': work_title[:100],
            'creator': creator,
            'year': year,
            'category': 'music',
            'subcategory': subcategory,
            'source': 'IMSLP',
            'sourceUrl': url,
            'description': 'Public domain sheet music and scores.',
            'country': 'Various',
            'format': format_type
        }

        new_works.append(new_work)
        existing_titles.add(title.lower())

    log(f"Found {len(new_works)} new works from IMSLP")
    return new_works

# ============================================
# MAIN UPDATE FUNCTION
# ============================================

def update_archive(sources=None, dry_run=False, limit=20):
    """Main update function."""
    all_sources = ['gutenberg', 'standard', 'archive', 'wikimedia', 'imslp']
    sources = sources or all_sources

    log("=" * 50)
    log("Public Domain Archive - Data Update")
    log(f"Sources: {', '.join(sources)}")
    log(f"Limit per source: {limit}")
    log("=" * 50)

    # Check if index.html exists
    if not INDEX_HTML_PATH.exists():
        log(f"index.html not found at {INDEX_HTML_PATH}", "ERROR")
        log("Please check the path configuration")
        return False

    # Read current HTML
    html_content = INDEX_HTML_PATH.read_text(encoding='utf-8')

    # Extract current works
    try:
        works, start_idx, end_idx = extract_works_from_html(html_content)
        log(f"Current catalog: {len(works)} works")
    except Exception as e:
        log(f"Failed to parse current data: {e}", "ERROR")
        return False

    # Create backup
    if not dry_run:
        backup_current_data(html_content)

    # Fetch new works from each source
    new_works = []

    if 'gutenberg' in sources:
        new_works.extend(fetch_gutenberg_works(works + new_works, limit=limit))
        time.sleep(1)  # Be nice to servers

    if 'standard' in sources:
        new_works.extend(fetch_standard_ebooks(works + new_works, limit=limit))
        time.sleep(1)

    if 'archive' in sources:
        new_works.extend(fetch_archive_films(works + new_works, limit=limit))
        time.sleep(1)

    if 'wikimedia' in sources:
        new_works.extend(fetch_wikimedia_art(works + new_works, limit=limit))
        time.sleep(1)

    if 'imslp' in sources:
        new_works.extend(fetch_imslp_music(works + new_works, limit=limit))

    if not new_works:
        log("No new works found. Catalog is up to date!")
        return True

    # Assign IDs to new works
    for work in new_works:
        work['id'] = get_next_id(works + [w for w in new_works if w['id'] != 0], work['category'])

    log(f"\nAdding {len(new_works)} new works...")

    if dry_run:
        log("\nDRY RUN - No changes saved")
        log("\nNew works that would be added:")
        for w in new_works:
            log(f"  [{w['category']}] {w['title']} by {w['creator']}")
        return True

    # Merge works
    works.extend(new_works)

    # Sort by category then by title
    works.sort(key=lambda w: (w['category'], w['title']))

    # Save updated HTML
    new_html = save_works_to_html(html_content, works, start_idx, end_idx)
    INDEX_HTML_PATH.write_text(new_html, encoding='utf-8')

    log(f"\nUpdated catalog: {len(works)} total works")
    log(f"Saved to {INDEX_HTML_PATH}")
    log("\n" + "=" * 50)
    log("Next steps:")
    log("  1. Review changes: git diff")
    log("  2. Test locally: bundle exec jekyll serve")
    log("  3. Commit: git add . && git commit -m 'Quarterly data update'")
    log("  4. Push: git push")
    log("=" * 50)

    return True

# ============================================
# CLI
# ============================================

def main():
    parser = argparse.ArgumentParser(
        description="Update the Public Domain Archive with new works",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python update.py                         # Full update from all sources
  python update.py --dry-run               # Preview without saving
  python update.py --source wikimedia      # Only fetch art
  python update.py --source imslp --limit 5  # Fetch 5 music works
        """
    )
    parser.add_argument(
        '--source',
        choices=['gutenberg', 'standard', 'archive', 'wikimedia', 'imslp', 'all'],
        default='all',
        help='Data source to fetch from (default: all)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without saving'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=20,
        help='Maximum items to fetch per source (default: 20)'
    )

    args = parser.parse_args()

    if args.source == 'all':
        sources = ['gutenberg', 'standard', 'archive', 'wikimedia', 'imslp']
    else:
        sources = [args.source]

    success = update_archive(sources=sources, dry_run=args.dry_run, limit=args.limit)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
