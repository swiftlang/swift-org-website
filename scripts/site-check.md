### Running site content checks

The site checker tool crawls the locally running development site to identify content issues like broken links, missing images, and isolated pages.

**Prerequisites:**

- Node.js v18.17.1 or higher
- Site running locally at http://localhost:4000

The [README](../README.md) has ways to spin up the site, and this script works with both hosting it up
with docker or running Jekyll locally. 

The easy path with docker:

```bash
docker compose run build
docker compose up website
```

Running Jekyll locally:

```bash
# Start the local development server in one terminal
LC_ALL=en_us.UTF-8 bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

**Running the checker:**

```bash
# Install dependencies (if not already done)
npm install

# In another terminal, run the site checker
npm run site-check
```

The tool will generate:

- Console output with detected issues
- `site-check-report.json` with detailed findings

**Configuration:**

You can customize the site check behavior using environment variables:

```bash
# Check up to 2000 pages (default: 1000)
MAX_PAGES=2000 npm run site-check

# Use a different base URL
SITE_URL=http://localhost:8080 npm run site-check

# Add delay between page requests in milliseconds (default: 50)
# Increase this if your dev server is struggling under load
CRAWL_DELAY=250 npm run site-check

# Enable external link checking (default: false, currently unused)
CHECK_EXTERNAL=true npm run site-check

# Combine multiple options
MAX_PAGES=500 CRAWL_DELAY=100 npm run site-check
```
