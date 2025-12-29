# Claude Code Configuration

## Permissions
- Auto-approve package installations (pip, npm, etc.)
- Allow running Python scripts in the repository
- Allow reading and writing to data files (_data/*.yml)

## Project Context
This is a Jekyll-based website that syncs blog posts from Substack. The main automated task is updating posts from the Substack RSS feed.

## Common Tasks
- Run `scripts/update_posts.py` to fetch and update blog posts from Substack
- Update `_data/posts.yml` with the latest post data
- Install required Python packages: feedparser, pyyaml
