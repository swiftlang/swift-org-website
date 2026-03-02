# Site Visualization Tool - Usage Guide

The Site Visualize tool creates an interactive visual sitemap from the site-check report, making it easy to understand site structure, navigation paths, and identify content issues.

## Quick Start

### 1. Generate a Site Check Report

First, run the site-check tool to crawl your site:

```bash
# Start your local Jekyll site
bundle exec jekyll serve --config _config.yml,_config_dev.yml

# In another terminal, run site-check
node scripts/site-check.js
```

This creates `site-check-report.json` with data about all pages, links, and issues.

### 2. Generate the Visualization

```bash
# Generate visualization from the report
node scripts/site-visualize.js

# Opens site-visualize-output.html in your browser
open site-visualize-output.html
```

### 3. Explore Your Site

The visualization shows your entire site as an interactive radial graph. See the [Features](#features) section below for details.

## Command-Line Options

```bash
# Basic usage (uses defaults)
node scripts/site-visualize.js

# Specify custom input file
node scripts/site-visualize.js --input=custom-report.json

# Specify custom output file
node scripts/site-visualize.js --output=my-visualization.html

# Both custom input and output
node scripts/site-visualize.js --input=old-report.json --output=old-site.html
```

## Features

### Visual Layout

**Radial Graph Design**
- **Home page** at the center
- **Concentric circles** represent "layers" (click distance from home)
- **Navigation ring** (Layer 1) shows header and footer links
  - Header links on top arc (blue)
  - Footer links on bottom arc (teal)
- **Content pages** arranged in outer layers based on navigation depth
- **Isolated pages** in outermost ring (orange)

**Color Coding**
- 🟢 **Green**: Healthy page (no issues)
- 🔴 **Red**: Error or broken links
- 🟠 **Orange**: Isolated page (no incoming links)
- 🟡 **Yellow**: Warning (broken images)
- 🔵 **Blue**: Header navigation links
- 🩵 **Teal**: Footer navigation links

**Node Size**
- Larger nodes = more incoming links (popular pages)
- Home page is largest (most connected)

### Interactive Features

#### 1. Detail Panel (Click Any Node)

Click any page node to open a detail panel showing:
- **Page Info**: Status, layer, depth from home, type
- **Incoming Links**: List of pages linking to this page (first 10 shown)
- **Outgoing Links**: Links by type (header, footer, content) with counts
- **Issues**: Errors, broken links, broken images (if any)
- **Images**: Total image count

Close the panel by:
- Clicking the × button
- Clicking anywhere on the visualization
- Clicking another node

#### 2. Filter Controls

Use checkboxes to show/hide pages by status:
- ☑️ **Show Errors**: Toggle pages with errors
- ☑️ **Show Isolated**: Toggle isolated pages
- ☑️ **Show Healthy**: Toggle healthy pages

Filters work together - uncheck multiple to focus on specific issues.

#### 3. Search

**Real-time URL Search**
- Type in the search box to find pages
- Matching pages are **highlighted** (thick red border)
- Non-matching pages are **dimmed** (low opacity)
- Case-insensitive partial matching
- Clear the search box to restore normal view

**Example searches:**
- `server` - finds all /server/ pages
- `guides` - finds all guide pages
- `gsoc` - finds Google Summer of Code pages

#### 4. Layer Collapse/Expand

Click any layer label to toggle that layer's visibility:
- **Layer 2**, **Layer 3**, etc. - content at different depths
- **Navigation** - header and footer links
- **Isolated** - pages with no incoming links

Collapsed layers show with strikethrough text. Click again to expand.

#### 5. Export

**Export SVG**
- Vector format, infinite zoom quality
- Editable in tools like Adobe Illustrator, Inkscape
- Small file size
- Best for: presentations, documentation, further editing

**Export PNG**
- Raster image at 2x resolution
- Ready to embed in documents
- Larger file size
- Best for: quick sharing, embedding in reports

Both exports capture the current visualization state (including filters).

### Drag & Drop

**Interactive Node Positioning**
- **Drag content nodes** to reposition them
- **Navigation and home nodes** snap back to fixed positions
- Use drag to untangle overlapping nodes
- Changes don't persist (reload to reset)

## Understanding Your Site

### Navigation Analysis

**Good Signs:**
- Most pages in **Layers 2-3** (1-2 clicks from home)
- Small number of isolated pages
- Navigation nodes (blue/teal) link to major sections

**Warning Signs:**
- Many pages in **Layer 6+** (5+ clicks from home)
- Large isolated page count
- Important content in deep layers

### Common Issues

**Isolated Pages**
Pages with no incoming links from reachable content:
- **Search for them**: Type part of the URL to find
- **Check details**: Click to see outgoing links
- **Fix**: Add links from relevant pages, or redirect if obsolete

**Duplicate Hierarchies**
Multiple URL paths to similar content:
- Example: `/server/*` vs `/documentation/server/*`
- Shows as separate clusters in visualization
- Fix: Choose canonical path, redirect duplicates

**Deep Navigation Paths**
Pages requiring 5+ clicks to reach:
- Check if they should be linked from navigation
- Add intermediate index pages
- Consider promoting to header/footer

## Performance Notes

### Current Capabilities
- **Tested with**: 442 pages, 10,000+ links
- **Performance**: Smooth rendering, responsive interactions
- **Force simulation**: Settles in ~1-2 seconds
- **Optimizations**: Barnes-Hut approximation and link culling active

### Optimizations Active

**Phase 1 Performance Optimizations (Implemented 2025-11-10):**

1. **Barnes-Hut Approximation**
   - Reduces force simulation from O(N²) to O(N log N)
   - 3-5x faster for larger sites
   - Groups distant nodes for approximate force calculations

2. **Link Culling**
   - Only renders links within 3 layers of each other
   - 50-70% fewer DOM elements
   - Cleaner visualization with less clutter

**Result**: Excellent performance for sites up to 700 pages, good performance up to 1000 pages.

### Large Sites (1000+ pages)
If you have a very large site:
- Current optimizations handle up to ~1000 pages well
- Beyond 1000 pages, additional optimizations may be needed

## Advanced Usage

### Comparing Reports Over Time

```bash
# Generate reports with dates
node scripts/site-check.js
mv site-check-report.json reports/site-check-2025-01-10.json

# Later, generate new report
node scripts/site-check.js
mv site-check-report.json reports/site-check-2025-01-15.json

# Visualize old report
node scripts/site-visualize.js --input=reports/site-check-2025-01-10.json --output=viz-old.html

# Visualize new report
node scripts/site-visualize.js --input=reports/site-check-2025-01-15.json --output=viz-new.html

# Compare side-by-side in browser
```

## Tips & Tricks

### Best Practices

1. **Run site-check first**: Always generate a fresh report before visualizing
2. **Use filters strategically**: Hide what you're not interested in
3. **Export early**: Save visualizations to track site evolution
4. **Search for patterns**: Use search to find URL patterns (e.g., `/blog/`, `/docs/`)
5. **Fix high-impact issues first**: Focus on isolated pages linked from navigation

### Keyboard Shortcuts

Currently none, but future versions may add:
- `Esc` - Close detail panel
- `Ctrl+F` - Focus search box
- `Ctrl+E` - Export SVG

### Understanding Statistics

The top bar shows:
- **Total Pages**: All pages found during crawl
- **Layers**: Depth levels (0 = home, max = deepest page)
- **Max Depth**: Furthest click distance from home
- **Errors**: Pages with HTTP errors or broken links
- **Isolated**: Pages with no incoming links

## Credits

Built with:
- [D3.js](https://d3js.org/) - Data visualization library
- Force-directed graph layout
- Breadth-first search for navigation depth calculation

---

**Last Updated**: 2025-11-10
**Version**: 0.5.0 (Phase 3 Complete)
