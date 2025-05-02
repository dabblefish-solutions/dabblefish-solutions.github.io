#!/usr/bin/env python3
import feedparser
import yaml
from datetime import datetime
import os
from pathlib import Path
import argparse

def should_exclude_post(link):
    # List of URL patterns to exclude
    exclude_patterns = [
        'coming-soon',
        # Add more patterns here if needed
    ]
    
    return any(pattern in link for pattern in exclude_patterns)

def fetch_substack_posts(feed_url):
    feed = feedparser.parse(feed_url)
    posts = []
    
    for entry in feed.entries:
        # Skip excluded posts
        if should_exclude_post(entry.link):
            print(f"Skipping excluded post: {entry.link}")
            continue
            
        # Extract the post slug from the link
        slug = entry.link.split('/')[-1]
        
        # Create the embed code
        embed_code = f'''<div class="substack-post-embed">
    <p lang="en">{entry.title}</p>
    <p>{entry.description}</p>
    <a data-post-link href="{entry.link}">Read on Substack</a>
</div>
<script async src="https://substack.com/embedjs/embed.js" charset="utf-8"></script>'''
        
        posts.append({
            'title': entry.title,
            'link': entry.link,
            'pubDate': entry.published,
            'description': entry.description,
            'slug': slug,
            'embed': embed_code
        })
    
    return posts

def update_posts_file(posts, output_file):
    data = {'posts': posts}
    with open(output_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False)

def main():
    parser = argparse.ArgumentParser(description='Update Substack posts data file')
    parser.add_argument('--feed-url', default='https://dabblefish.substack.com/feed',
                      help='Substack RSS feed URL')
    parser.add_argument('--output', default='_data/posts.yml',
                      help='Output YAML file path')
    args = parser.parse_args()

    # Get the repository root directory
    repo_root = Path(__file__).parent.parent
    
    # Ensure the output directory exists
    output_file = repo_root / args.output
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    posts = fetch_substack_posts(args.feed_url)
    update_posts_file(posts, output_file)
    print(f"Updated {len(posts)} posts in {output_file}")

if __name__ == '__main__':
    main() 