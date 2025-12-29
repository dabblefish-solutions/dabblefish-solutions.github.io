---
description: Updates the website's blog posts by fetching the latest content from the Substack RSS feed and converting it into a format that can be displayed on the website.
---

Update the website's blog posts by following these steps:

1. Run the Python script `scripts/update_posts.py` to fetch the latest posts from the Substack RSS feed (https://dabblefish.substack.com/feed) and update the `_data/posts.yml` file.

2. Review the changes to `_data/posts.yml` to ensure the posts were fetched correctly and no excluded posts (like those containing 'coming-soon' in the URL) were included.

3. If there are changes:
   - Show a summary of what posts were added or updated
   - Ask if the user wants to commit these changes

4. If the user confirms, create a git commit with the message "Update Substack posts" and optionally push to the remote repository if requested.

The script fetches posts from the Substack RSS feed, filters out excluded posts, and creates embed codes for each post that can be used on the website.