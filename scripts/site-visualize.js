#!/usr/bin/env node
//===----------------------------------------------------------------------===//
//
// This source file is part of the Swift.org open source project
//
// Copyright (c) 2025 Apple Inc. and the Swift.org project authors
// Licensed under Apache License v2.0
//
// See LICENSE.txt for license information
// See CONTRIBUTORS.txt for the list of Swift.org project authors
//
// SPDX-License-Identifier: Apache-2.0
//
//===----------------------------------------------------------------------===//

/**
 * Site Visualize Tool
 *
 * Generates an interactive visual sitemap from site-check-report.json
 * Shows page hierarchy, navigation difficulty, and content issues.
 *
 * Usage: npm run site-visualize
 *        node scripts/site-visualize.js
 *        node scripts/site-visualize.js --input custom-report.json --output custom.html
 *
 * Output: site-visualize-output.html (standalone HTML file)
 */

const fs = require('fs').promises
const path = require('path')

// Configuration
const CONFIG = {
  inputFile:
    process.argv.find((arg) => arg.startsWith('--input='))?.split('=')[1] ||
    'site-check-report.json',
  outputFile:
    process.argv.find((arg) => arg.startsWith('--output='))?.split('=')[1] ||
    'site-visualize-output.html',
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Load and parse the site check report
 */
async function loadReport(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    log(`Error loading report: ${error.message}`, 'red')
    throw error
  }
}

/**
 * Identify pages that appear in header or footer across the site
 * These are "globally available" navigation links
 */
function identifyHeaderFooterPages(pages) {
  const headerPages = new Set()
  const footerPages = new Set()

  // Collect all unique header and footer links across all pages
  for (const [uri, data] of Object.entries(pages)) {
    data.outgoingLinks.header.forEach((link) => headerPages.add(link))
    data.outgoingLinks.footer.forEach((link) => footerPages.add(link))
  }

  return {
    header: Array.from(headerPages),
    footer: Array.from(footerPages),
    all: Array.from(new Set([...headerPages, ...footerPages])),
  }
}

/**
 * Calculate page depth using BFS from homepage
 * Header and footer pages are both assigned to Layer 1 (navigation layer)
 * Other pages get depth based on shortest path via content links
 */
function calculateLayers(pages) {
  const layers = {}
  const pageMetadata = {}

  // Layer 0: Home page
  const homeUri = '/'
  layers[0] = [homeUri]
  pageMetadata[homeUri] = {
    layer: 0,
    type: 'home',
    ...getPageStatus(pages[homeUri]),
  }

  // Identify header/footer pages
  const navPages = identifyHeaderFooterPages(pages)

  // Layer 1: All navigation pages (header and footer together)
  layers[1] = []

  navPages.all.forEach((uri) => {
    const inHeader = navPages.header.includes(uri)
    const inFooter = navPages.footer.includes(uri)

    let type
    if (inHeader && inFooter) {
      type = 'header-footer'
    } else if (inHeader) {
      type = 'header'
    } else {
      type = 'footer'
    }

    layers[1].push(uri)
    pageMetadata[uri] = {
      layer: 1,
      type,
      ...getPageStatus(pages[uri] || {}),
    }
  })

  // BFS to calculate depths for remaining pages
  // Since header/footer links appear on EVERY page, we start BFS from:
  // 1. Home page (depth 0)
  // 2. All navigation pages (header/footer at depth 1)
  // This ensures pages linked from global navigation get correct shallow depth

  const visited = new Set([homeUri, ...navPages.all])
  const queue = [{ uri: homeUri, depth: 0 }]

  // Add all nav pages to queue at depth 1
  navPages.all.forEach((uri) => {
    queue.push({ uri, depth: 1 })
  })

  while (queue.length > 0) {
    const { uri, depth } = queue.shift()

    // Skip if page doesn't exist in report
    if (!pages[uri]) continue

    // Process ALL outgoing links (header, footer, and content)
    // Since header/footer appear on every page, all their links are globally accessible
    const allLinks = [
      ...(pages[uri].outgoingLinks.header || []),
      ...(pages[uri].outgoingLinks.footer || []),
      ...(pages[uri].outgoingLinks.content || []),
    ]

    for (const linkUri of allLinks) {
      if (!visited.has(linkUri)) {
        visited.add(linkUri)
        const newDepth = depth + 1
        // Content pages start at Layer 2 (after navigation=1)
        const newLayer = newDepth + 1

        // Initialize layer array if needed
        if (!layers[newLayer]) {
          layers[newLayer] = []
        }

        layers[newLayer].push(linkUri)

        pageMetadata[linkUri] = {
          layer: newLayer,
          type: 'content',
          ...getPageStatus(pages[linkUri] || {}),
        }

        queue.push({ uri: linkUri, depth: newDepth })
      }
    }
  }

  // Find isolated pages (not reached by BFS)
  const isolatedPages = []
  for (const uri of Object.keys(pages)) {
    if (!visited.has(uri)) {
      isolatedPages.push(uri)
      pageMetadata[uri] = {
        layer: 'isolated',
        type: 'isolated',
        ...getPageStatus(pages[uri]),
      }
    }
  }

  if (isolatedPages.length > 0) {
    layers['isolated'] = isolatedPages
  }

  return { layers, pageMetadata }
}

/**
 * Determine page status based on issues
 */
function getPageStatus(pageData) {
  const hasError = pageData.issues?.error !== null
  const hasBrokenLinks =
    pageData.issues?.brokenLinks && pageData.issues.brokenLinks.length > 0
  const hasBrokenImages =
    pageData.issues?.brokenImages && pageData.issues.brokenImages.length > 0
  const isIsolated = pageData.isIsolated === true

  let status = 'healthy'
  if (hasError) status = 'error'
  else if (hasBrokenLinks) status = 'broken-links'
  else if (isIsolated) status = 'isolated'
  else if (hasBrokenImages) status = 'warning'

  return {
    status,
    hasError,
    hasBrokenLinks,
    hasBrokenImages,
    isIsolated,
    incomingCount: pageData.incomingLinks?.length || 0,
    outgoingCount:
      (pageData.outgoingLinks?.header?.length || 0) +
      (pageData.outgoingLinks?.footer?.length || 0) +
      (pageData.outgoingLinks?.content?.length || 0),
  }
}

/**
 * Generate statistics about the site structure
 */
function generateStatistics(layers, pageMetadata, report) {
  const stats = {
    totalPages: Object.keys(pageMetadata).length,
    layerCount: Object.keys(layers).filter((k) => k !== 'isolated').length,
    maxDepth: Math.max(
      ...Object.keys(layers)
        .filter((k) => k !== 'isolated')
        .map(Number),
    ),
    byLayer: {},
    byStatus: {
      healthy: 0,
      error: 0,
      'broken-links': 0,
      isolated: 0,
      warning: 0,
    },
  }

  // Count pages per layer
  for (const [layer, uris] of Object.entries(layers)) {
    stats.byLayer[layer] = uris.length
  }

  // Count pages by status
  for (const metadata of Object.values(pageMetadata)) {
    stats.byStatus[metadata.status]++
  }

  return stats
}

/**
 * Print summary to console
 */
function printSummary(stats, layers) {
  log('\n' + '='.repeat(60), 'cyan')
  log('Site Visualization - Layer Analysis', 'cyan')
  log('='.repeat(60), 'cyan')

  log(`\nTotal Pages: ${stats.totalPages}`, 'blue')
  log(`Layers: ${stats.layerCount} (max depth: ${stats.maxDepth})`, 'blue')

  log('\nPages per Layer:', 'cyan')
  for (const [layer, count] of Object.entries(stats.byLayer)) {
    const layerName =
      layer === '0'
        ? 'Home'
        : layer === '1'
          ? 'Navigation (Header + Footer)'
          : layer === 'isolated'
            ? 'Isolated'
            : `Layer ${layer} (${parseInt(layer) - 1} clicks)`
    log(`  ${layerName}: ${count} pages`, 'blue')
  }

  log('\nPages by Status:', 'cyan')
  if (stats.byStatus.healthy > 0)
    log(`  ✓ Healthy: ${stats.byStatus.healthy}`, 'green')
  if (stats.byStatus.error > 0)
    log(`  ✗ Errors: ${stats.byStatus.error}`, 'red')
  if (stats.byStatus['broken-links'] > 0)
    log(`  ✗ Broken Links: ${stats.byStatus['broken-links']}`, 'red')
  if (stats.byStatus.isolated > 0)
    log(`  ⚠ Isolated: ${stats.byStatus.isolated}`, 'yellow')
  if (stats.byStatus.warning > 0)
    log(`  ⚠ Warnings: ${stats.byStatus.warning}`, 'yellow')

  log('\n' + '='.repeat(60) + '\n', 'cyan')
}

/**
 * Generate HTML visualization with embedded D3.js
 */
function generateHTML(report, layers, pageMetadata, stats) {
  // Prepare data for visualization
  const visualizationData = {
    stats,
    layers,
    pages: report.pages,
    metadata: pageMetadata,
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swift.org Site Map Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f9fafb;
      color: #111827;
    }

    #container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    #header {
      background: white;
      border-bottom: 2px solid #e5e7eb;
      padding: 1rem 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 1.5rem;
      color: #f05138;
      margin-bottom: 0.5rem;
    }

    #stats {
      display: flex;
      gap: 2rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .stat { display: flex; align-items: center; gap: 0.5rem; }
    .stat-value { font-weight: 600; color: #111827; }

    #controls {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      user-select: none;
    }

    .filter-label input[type="checkbox"] {
      cursor: pointer;
    }

    #search-box {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      min-width: 250px;
    }

    #search-box:focus {
      outline: none;
      border-color: #f05138;
      box-shadow: 0 0 0 3px rgba(240, 81, 56, 0.1);
    }

    .export-button {
      padding: 0.5rem 1rem;
      background: #f05138;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .export-button:hover {
      background: #d94028;
    }

    .export-button:active {
      transform: translateY(1px);
    }

    .export-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-left: auto;
    }

    .layer-toggle-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .layer-toggle-button {
      padding: 0.25rem 0.75rem;
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .layer-toggle-button:hover {
      border-color: #f05138;
      color: #f05138;
    }

    .layer-toggle-button.collapsed {
      background: #f3f4f6;
      color: #9ca3af;
      text-decoration: line-through;
    }

    .layer-toggle-button.collapsed:hover {
      border-color: #6b7280;
      color: #6b7280;
    }

    #viz-container {
      flex: 1;
      overflow: auto;
      position: relative;
      display: flex;
    }

    #detail-panel {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 350px;
      max-height: calc(100% - 2rem);
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow-y: auto;
      display: none;
      z-index: 100;
    }

    #detail-panel.visible {
      display: block;
    }

    .detail-header {
      padding: 1rem;
      border-bottom: 2px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .detail-title {
      font-weight: 600;
      font-size: 1rem;
      color: #111827;
      word-break: break-all;
      flex: 1;
    }

    .detail-close {
      cursor: pointer;
      color: #6b7280;
      font-size: 1.5rem;
      line-height: 1;
      padding: 0 0.5rem;
      margin: -0.25rem 0;
    }

    .detail-close:hover {
      color: #111827;
    }

    .detail-section {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-section:last-child {
      border-bottom: none;
    }

    .detail-section-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    .detail-item {
      margin: 0.5rem 0;
      font-size: 0.875rem;
    }

    .detail-label {
      font-weight: 600;
      color: #374151;
    }

    .detail-value {
      color: #6b7280;
    }

    .link-list {
      margin-top: 0.5rem;
    }

    .link-item {
      padding: 0.25rem 0.5rem;
      margin: 0.25rem 0;
      background: #f9fafb;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      word-break: break-all;
      color: #374151;
    }

    .issue-item {
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: #fef2f2;
      border-left: 3px solid #ef4444;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .node.dimmed circle {
      opacity: 0.2;
    }

    .node.dimmed text {
      opacity: 0.2;
    }

    .node.highlighted circle {
      stroke: #f05138;
      stroke-width: 4;
    }

    .link.dimmed {
      opacity: 0.1;
    }

    #visualization {
      min-width: 100%;
      min-height: 100%;
    }

    /* Node styles */
    .node circle {
      stroke: white;
      stroke-width: 2;
      cursor: pointer;
      transition: r 0.2s;
    }

    .node:hover circle {
      stroke-width: 3;
    }

    .node text {
      font-size: 11px;
      pointer-events: none;
      fill: #374151;
      font-weight: 500;
    }

    /* Link styles */
    .link {
      stroke: #d1d5db;
      stroke-width: 1;
      fill: none;
      opacity: 0.6;
    }

    .link-header { stroke: #3b82f6; stroke-dasharray: 2,2; }
    .link-footer { stroke: #14b8a6; stroke-dasharray: 2,2; }

    /* Legend */
    #legend {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-size: 0.75rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.25rem 0;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
    }
  </style>
</head>
<body>
  <div id="container">
    <div id="header">
      <h1>Swift.org Site Map - Layer Visualization</h1>
      <div id="stats">
        <div class="stat">
          <span>Total Pages:</span>
          <span class="stat-value">${stats.totalPages}</span>
        </div>
        <div class="stat">
          <span>Layers:</span>
          <span class="stat-value">${stats.layerCount}</span>
        </div>
        <div class="stat">
          <span>Max Depth:</span>
          <span class="stat-value">${stats.maxDepth} clicks</span>
        </div>
        <div class="stat">
          <span>Errors:</span>
          <span class="stat-value" style="color: #ef4444">${stats.byStatus.error}</span>
        </div>
        <div class="stat">
          <span>Isolated:</span>
          <span class="stat-value" style="color: #f97316">${stats.byStatus.isolated}</span>
        </div>
      </div>
    </div>

    <div id="controls">
      <div class="filter-group">
        <span style="font-weight: 600; font-size: 0.875rem;">Filters:</span>
        <label class="filter-label">
          <input type="checkbox" id="filter-errors" checked>
          <span>Show Errors</span>
        </label>
        <label class="filter-label">
          <input type="checkbox" id="filter-isolated" checked>
          <span>Show Isolated</span>
        </label>
        <label class="filter-label">
          <input type="checkbox" id="filter-healthy" checked>
          <span>Show Healthy</span>
        </label>
      </div>
      <div class="layer-toggle-group" id="layer-toggles">
        <span style="font-weight: 600; font-size: 0.875rem;">Layers:</span>
        <!-- Layer buttons will be dynamically added here -->
      </div>
      <input type="text" id="search-box" placeholder="Search pages by URL...">
      <div class="export-group">
        <button class="export-button" id="export-svg">Export SVG</button>
        <button class="export-button" id="export-png">Export PNG</button>
      </div>
    </div>

    <div id="viz-container">
      <svg id="visualization"></svg>
      <div id="detail-panel">
        <div class="detail-header">
          <div class="detail-title" id="detail-url"></div>
          <div class="detail-close" id="detail-close">&times;</div>
        </div>
        <div id="detail-content"></div>
      </div>
      <div id="legend">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">Status</div>
        <div class="legend-item">
          <div class="legend-color" style="background: #10b981"></div>
          <span>Healthy</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #ef4444"></div>
          <span>Error</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #f97316"></div>
          <span>Isolated</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #eab308"></div>
          <span>Warning</span>
        </div>
        <div style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">Navigation</div>
        <div class="legend-item">
          <div class="legend-color" style="background: #3b82f6"></div>
          <span>Header Links</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #14b8a6"></div>
          <span>Footer Links</span>
        </div>
        <div style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">Node Size</div>
        <div style="font-size: 0.7rem; color: #6b7280; line-height: 1.4;">
          Larger nodes = more incoming links (popular pages)
        </div>
        <div style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">Performance</div>
        <div style="font-size: 0.7rem; color: #6b7280; line-height: 1.4;">
          Optimized with Barnes-Hut approximation & link culling for smooth performance
        </div>
      </div>
    </div>
  </div>

  <script>
    // Embedded data
    const DATA = ${JSON.stringify(visualizationData)};

    // Color mapping
    const colors = {
      'home': '#f05138',
      'header': '#3b82f6',
      'footer': '#14b8a6',
      'header-footer': '#6366f1',
      'healthy': '#10b981',
      'error': '#ef4444',
      'isolated': '#f97316',
      'warning': '#eab308',
      'broken-links': '#dc2626'
    };

    function getNodeColor(uri, metadata) {
      if (metadata.type === 'home') return colors.home;
      if (metadata.type === 'header' || metadata.type === 'footer' || metadata.type === 'header-footer') {
        return colors[metadata.type];
      }
      return colors[metadata.status] || colors.healthy;
    }

    function getNodeSize(metadata) {
      // Size based on popularity (incoming links)
      const base = 5;
      const popularity = metadata.incomingCount || 0;
      return base + Math.min(popularity, 20);
    }

    // Build node and link data structures
    const nodes = [];
    const links = [];

    // Create nodes from all pages
    Object.keys(DATA.layers).forEach(layerNum => {
      const uris = DATA.layers[layerNum];
      uris.forEach(uri => {
        const metadata = DATA.metadata[uri];
        nodes.push({
          id: uri,
          layer: layerNum,
          ...metadata
        });
      });
    });

    // Create links from page relationships
    Object.entries(DATA.pages).forEach(([sourceUri, pageData]) => {
      const sourceNode = nodes.find(n => n.id === sourceUri);
      if (!sourceNode) return;

      // Add content links
      (pageData.outgoingLinks.content || []).forEach(targetUri => {
        const targetNode = nodes.find(n => n.id === targetUri);
        if (targetNode) {
          // Performance optimization: Link culling
          // Skip links between very distant layers to reduce rendering cost
          const layerDiff = Math.abs(
            (sourceNode.layer === 'isolated' ? 999 : sourceNode.layer) -
            (targetNode.layer === 'isolated' ? 999 : targetNode.layer)
          );

          // Only render links within 3 layers of each other
          // This reduces link count by ~50-70% with minimal visual impact
          if (layerDiff <= 3) {
            links.push({
              source: sourceUri,
              target: targetUri,
              type: 'content'
            });
          }
        }
      });
    });

    // Setup SVG for force-directed layout
    const width = 2400;
    const height = 2400;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select('#visualization')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', \`0 0 \${width} \${height}\`);

    const g = svg.append('g');

    // Calculate radial positions based on layer
    const layerNumbers = Object.keys(DATA.layers).filter(k => k !== 'isolated').map(Number).sort((a,b) => a-b);
    const maxLayer = Math.max(...layerNumbers);
    const radiusStep = Math.min(180, (Math.min(width, height) / 2 - 100) / (maxLayer + 2));

    // Assign target radius for each node based on layer
    nodes.forEach(node => {
      if (node.layer === 'isolated') {
        // Isolated pages go to outermost ring
        node.targetRadius = (maxLayer + 2) * radiusStep;
      } else if (node.layer === 0) {
        // Home at center
        node.targetRadius = 0;
      } else {
        // Other layers at increasing radii
        node.targetRadius = node.layer * radiusStep;
      }

      // Initialize position at target radius with random angle
      const angle = Math.random() * 2 * Math.PI;
      node.x = centerX + node.targetRadius * Math.cos(angle);
      node.y = centerY + node.targetRadius * Math.sin(angle);
    });

    // Fix header and footer nodes in circular arrangement on same layer
    // Headers on top arc, footers on bottom arc
    const headerNodes = nodes.filter(n => n.type === 'header' || n.type === 'header-footer');
    const footerNodes = nodes.filter(n => n.type === 'footer' && n.type !== 'header-footer');

    // Position header nodes evenly across top arc (from -π to 0)
    headerNodes.forEach((node, i) => {
      // Spread across top semicircle, starting from left going clockwise
      const arcStart = -Math.PI; // Left (9 o'clock)
      const arcEnd = 0; // Right (3 o'clock)
      const arcRange = arcEnd - arcStart;
      const angle = arcStart + (i / Math.max(headerNodes.length - 1, 1)) * arcRange;

      node.fx = centerX + node.targetRadius * Math.cos(angle);
      node.fy = centerY + node.targetRadius * Math.sin(angle);
    });

    // Position footer nodes evenly across bottom arc (from 0 to π)
    footerNodes.forEach((node, i) => {
      // Spread across bottom semicircle, starting from right going clockwise
      const arcStart = 0; // Right (3 o'clock)
      const arcEnd = Math.PI; // Left (9 o'clock)
      const arcRange = arcEnd - arcStart;
      const angle = arcStart + (i / Math.max(footerNodes.length - 1, 1)) * arcRange;

      node.fx = centerX + node.targetRadius * Math.cos(angle);
      node.fy = centerY + node.targetRadius * Math.sin(angle);
    });

    // Fix home page at center
    const homeNode = nodes.find(n => n.layer === 0);
    if (homeNode) {
      homeNode.fx = centerX;
      homeNode.fy = centerY;
    }

    // Draw concentric circles for layer guides
    const layerGuides = g.append('g').attr('class', 'layer-guides');

    layerNumbers.forEach((layerNum) => {
      const radius = layerNum * radiusStep;
      if (radius > 0) {
        // Make navigation layer (Layer 1) more prominent
        const isNavLayer = layerNum === 1;
        layerGuides.append('circle')
          .attr('cx', centerX)
          .attr('cy', centerY)
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', isNavLayer ? '#6366f1' : '#e5e7eb')
          .attr('stroke-width', isNavLayer ? 2 : 1)
          .attr('stroke-dasharray', isNavLayer ? '8,4' : '4,4')
          .attr('opacity', isNavLayer ? 0.5 : 0.3);
      }
    });

    // Isolated layer guide
    const isolatedCount = DATA.layers.isolated ? DATA.layers.isolated.length : 0;
    if (isolatedCount > 0) {
      const isolatedRadius = (maxLayer + 2) * radiusStep;
      layerGuides.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', isolatedRadius)
        .attr('fill', 'none')
        .attr('stroke', '#f97316')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4');
    }

    // Draw links
    const linkElements = g.selectAll('.link')
      .data(links)
      .join('line')
      .attr('class', d => \`link link-\${d.type}\`);

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node');

    nodeGroups.append('circle')
      .attr('r', d => getNodeSize(d))
      .attr('fill', d => getNodeColor(d.id, d))
      .on('click', (event, d) => {
        showDetailPanel(d);
        event.stopPropagation();
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    nodeGroups.append('text')
      .attr('dy', 20)
      .attr('text-anchor', 'middle')
      .text(d => {
        // Handle homepage specially
        if (d.id === '/') return 'Home';

        // Split path and filter out empty strings
        const parts = d.id.split('/').filter(p => p.length > 0);

        // Get the last meaningful part
        const lastPart = parts.length > 0 ? parts[parts.length - 1] : 'Home';

        // Truncate if too long (increased from 20 to 25 chars)
        return lastPart.length > 25 ? lastPart.substring(0, 22) + '...' : lastPart;
      });

    // Force simulation with D3's built-in radial force
    // Performance Optimization 1A: Barnes-Hut approximation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => {
          const source = nodes.find(n => n.id === d.source);
          const target = nodes.find(n => n.id === d.target);
          // Shorter links within same layer, longer across layers
          const layerDiff = Math.abs((source?.layer || 0) - (target?.layer || 0));
          // Much shorter base distance to keep things tighter
          return layerDiff * 30 + 20;
        })
        .strength(0.4))  // Reduced from 0.5 to 0.4 for looser attraction
      .force('charge', d3.forceManyBody()
        .strength(-100)     // Repulsion strength
        .theta(0.9)         // Barnes-Hut approximation threshold (0-1, higher = faster but less accurate)
        .distanceMax(500))  // Limit force calculation distance (improves performance)
      // Collision radius set to 20 for good spacing with text labels
      .force('collision', d3.forceCollide().radius(d => getNodeSize(d) + 20).strength(0.7))
      .force('radial', d3.forceRadial(d => d.targetRadius, centerX, centerY).strength(1.0))  // Reduced from 1.2 to 1.0
      // Speed up settling by increasing alpha decay
      .alphaDecay(0.05) // default is 0.0228, higher = faster settling
      .velocityDecay(0.6) // default is 0.4, higher = more friction, faster settling
      .on('tick', ticked);

    function ticked() {
      linkElements
        .attr('x1', d => {
          const source = nodes.find(n => n.id === d.source.id || n.id === d.source);
          return source ? source.x : 0;
        })
        .attr('y1', d => {
          const source = nodes.find(n => n.id === d.source.id || n.id === d.source);
          return source ? source.y : 0;
        })
        .attr('x2', d => {
          const target = nodes.find(n => n.id === d.target.id || n.id === d.target);
          return target ? target.x : 0;
        })
        .attr('y2', d => {
          const target = nodes.find(n => n.id === d.target.id || n.id === d.target);
          return target ? target.y : 0;
        });

      nodeGroups
        .attr('transform', d => \`translate(\${d.x},\${d.y})\`);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);

      // Keep header, footer, and home nodes fixed in their positions
      if (d.layer === 0 || d.type === 'header' || d.type === 'footer' || d.type === 'header-footer') {
        // Return to fixed position - recalculate based on type
        if (d.layer === 0) {
          d.fx = centerX;
          d.fy = centerY;
        } else {
          // Keep the fixed position (already set earlier)
          // Don't set fx/fy to null
        }
      } else {
        // Allow content nodes to move freely after drag
        d.fx = null;
        d.fy = null;
      }
    }

    // Detail panel functionality
    function showDetailPanel(nodeData) {
      const panel = document.getElementById('detail-panel');
      const urlEl = document.getElementById('detail-url');
      const contentEl = document.getElementById('detail-content');

      urlEl.textContent = nodeData.id;

      const pageData = DATA.pages[nodeData.id] || {};
      const depth = nodeData.layer === 0 ? '0 (Home)' :
                    nodeData.layer === 1 ? '1 (Navigation)' :
                    nodeData.layer === 'isolated' ? 'Isolated' :
                    \`\${nodeData.layer - 1} clicks\`;

      let html = \`
        <div class="detail-section">
          <div class="detail-section-title">Page Info</div>
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value">\${nodeData.status}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Layer:</span>
            <span class="detail-value">\${nodeData.layer}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Depth from home:</span>
            <span class="detail-value">\${depth}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">\${nodeData.type}</span>
          </div>
        </div>
      \`;

      // Incoming links
      if (pageData.incomingLinks && pageData.incomingLinks.length > 0) {
        html += \`
          <div class="detail-section">
            <div class="detail-section-title">Incoming Links (\${pageData.incomingLinks.length})</div>
            <div class="link-list">
        \`;
        pageData.incomingLinks.slice(0, 10).forEach(link => {
          html += \`<div class="link-item">\${link}</div>\`;
        });
        if (pageData.incomingLinks.length > 10) {
          html += \`<div class="link-item" style="font-style: italic;">... and \${pageData.incomingLinks.length - 10} more</div>\`;
        }
        html += \`</div></div>\`;
      }

      // Outgoing links
      const outgoing = pageData.outgoingLinks || {};
      const totalOutgoing = (outgoing.header?.length || 0) + (outgoing.footer?.length || 0) + (outgoing.content?.length || 0);
      if (totalOutgoing > 0) {
        html += \`
          <div class="detail-section">
            <div class="detail-section-title">Outgoing Links (\${totalOutgoing})</div>
        \`;

        if (outgoing.header && outgoing.header.length > 0) {
          html += \`<div style="margin-top: 0.5rem; font-weight: 600; font-size: 0.75rem; color: #3b82f6;">Header (\${outgoing.header.length})</div><div class="link-list">\`;
          outgoing.header.slice(0, 5).forEach(link => {
            html += \`<div class="link-item">\${link}</div>\`;
          });
          if (outgoing.header.length > 5) {
            html += \`<div class="link-item" style="font-style: italic;">... and \${outgoing.header.length - 5} more</div>\`;
          }
          html += \`</div>\`;
        }

        if (outgoing.footer && outgoing.footer.length > 0) {
          html += \`<div style="margin-top: 0.5rem; font-weight: 600; font-size: 0.75rem; color: #14b8a6;">Footer (\${outgoing.footer.length})</div><div class="link-list">\`;
          outgoing.footer.slice(0, 5).forEach(link => {
            html += \`<div class="link-item">\${link}</div>\`;
          });
          if (outgoing.footer.length > 5) {
            html += \`<div class="link-item" style="font-style: italic;">... and \${outgoing.footer.length - 5} more</div>\`;
          }
          html += \`</div>\`;
        }

        if (outgoing.content && outgoing.content.length > 0) {
          html += \`<div style="margin-top: 0.5rem; font-weight: 600; font-size: 0.75rem; color: #6b7280;">Content (\${outgoing.content.length})</div><div class="link-list">\`;
          outgoing.content.slice(0, 5).forEach(link => {
            html += \`<div class="link-item">\${link}</div>\`;
          });
          if (outgoing.content.length > 5) {
            html += \`<div class="link-item" style="font-style: italic;">... and \${outgoing.content.length - 5} more</div>\`;
          }
          html += \`</div>\`;
        }

        html += \`</div>\`;
      }

      // Issues
      const issues = pageData.issues || {};
      const hasIssues = issues.error || (issues.brokenLinks && issues.brokenLinks.length > 0) ||
                        (issues.brokenImages && issues.brokenImages.length > 0);

      if (hasIssues) {
        html += \`<div class="detail-section"><div class="detail-section-title">Issues</div>\`;

        if (issues.error) {
          html += \`<div class="issue-item"><strong>Error:</strong> \${issues.error}</div>\`;
        }

        if (issues.brokenLinks && issues.brokenLinks.length > 0) {
          html += \`<div class="issue-item"><strong>Broken Links (\${issues.brokenLinks.length}):</strong><div class="link-list">\`;
          issues.brokenLinks.forEach(link => {
            html += \`<div class="link-item">\${link}</div>\`;
          });
          html += \`</div></div>\`;
        }

        if (issues.brokenImages && issues.brokenImages.length > 0) {
          html += \`<div class="issue-item"><strong>Broken Images (\${issues.brokenImages.length}):</strong><div class="link-list">\`;
          issues.brokenImages.forEach(img => {
            html += \`<div class="link-item">\${img}</div>\`;
          });
          html += \`</div></div>\`;
        }

        html += \`</div>\`;
      }

      // Images
      if (pageData.imagesCount > 0) {
        html += \`
          <div class="detail-section">
            <div class="detail-section-title">Images</div>
            <div class="detail-item">
              <span class="detail-label">Total images:</span>
              <span class="detail-value">\${pageData.imagesCount}</span>
            </div>
          </div>
        \`;
      }

      contentEl.innerHTML = html;
      panel.classList.add('visible');
    }

    // Close detail panel
    document.getElementById('detail-close').addEventListener('click', () => {
      document.getElementById('detail-panel').classList.remove('visible');
    });

    // Close panel when clicking outside
    svg.on('click', () => {
      document.getElementById('detail-panel').classList.remove('visible');
    });

    // Filter functionality
    let activeFilters = {
      errors: true,
      isolated: true,
      healthy: true
    };

    function applyFilters() {
      nodeGroups.each(function(d) {
        const node = d3.select(this);
        let visible = true;

        // Check status filters
        if (d.status === 'error' && !activeFilters.errors) visible = false;
        if (d.status === 'isolated' && !activeFilters.isolated) visible = false;
        if (d.status === 'healthy' && !activeFilters.healthy) visible = false;

        // Apply visibility
        node.style('display', visible ? null : 'none');
      });

      // Update link visibility based on visible nodes
      linkElements.each(function(d) {
        const link = d3.select(this);
        const sourceNode = nodes.find(n => n.id === d.source.id || n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target.id || n.id === d.target);

        const sourceVisible = nodeGroups.filter(n => n.id === sourceNode?.id).style('display') !== 'none';
        const targetVisible = nodeGroups.filter(n => n.id === targetNode?.id).style('display') !== 'none';

        link.style('display', (sourceVisible && targetVisible) ? null : 'none');
      });
    }

    document.getElementById('filter-errors').addEventListener('change', (e) => {
      activeFilters.errors = e.target.checked;
      applyFilters();
    });

    document.getElementById('filter-isolated').addEventListener('change', (e) => {
      activeFilters.isolated = e.target.checked;
      applyFilters();
    });

    document.getElementById('filter-healthy').addEventListener('change', (e) => {
      activeFilters.healthy = e.target.checked;
      applyFilters();
    });

    // Search functionality
    let searchTimeout;
    document.getElementById('search-box').addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value.toLowerCase().trim();

        if (query === '') {
          // Clear search highlighting
          nodeGroups.classed('dimmed', false);
          nodeGroups.classed('highlighted', false);
          linkElements.classed('dimmed', false);
        } else {
          // Highlight matching nodes
          nodeGroups.each(function(d) {
            const node = d3.select(this);
            const matches = d.id.toLowerCase().includes(query);
            node.classed('dimmed', !matches);
            node.classed('highlighted', matches);
          });

          // Dim links that don't connect to highlighted nodes
          linkElements.each(function(d) {
            const link = d3.select(this);
            const sourceNode = nodes.find(n => n.id === d.source.id || n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target.id || n.id === d.target);

            const sourceMatches = sourceNode?.id.toLowerCase().includes(query);
            const targetMatches = targetNode?.id.toLowerCase().includes(query);

            link.classed('dimmed', !sourceMatches && !targetMatches);
          });
        }
      }, 300);
    });

    // Layer collapse/expand functionality
    const collapsedLayers = new Set();

    // Create layer toggle buttons in the controls bar
    const layerTogglesContainer = document.getElementById('layer-toggles');

    // Add navigation layer button
    const navButton = document.createElement('button');
    navButton.className = 'layer-toggle-button';
    navButton.dataset.layer = '1';
    navButton.textContent = 'Navigation';
    navButton.title = 'Toggle Layer 1 (Navigation)';
    layerTogglesContainer.appendChild(navButton);

    // Add content layer buttons
    layerNumbers.forEach((layerNum) => {
      if (layerNum > 1) {  // Skip 0 (home) and 1 (already added as Navigation)
        const button = document.createElement('button');
        button.className = 'layer-toggle-button';
        button.dataset.layer = layerNum;
        const pageCount = DATA.layers[layerNum]?.length || 0;
        button.textContent = \`L\${layerNum} (\${pageCount})\`;
        button.title = \`Toggle Layer \${layerNum} - \${layerNum - 1} clicks from home (\${pageCount} pages)\`;
        layerTogglesContainer.appendChild(button);
      }
    });

    // Add isolated layer button if it exists
    if (isolatedCount > 0) {
      const isolatedButton = document.createElement('button');
      isolatedButton.className = 'layer-toggle-button';
      isolatedButton.dataset.layer = 'isolated';
      isolatedButton.textContent = \`Isolated (\${isolatedCount})\`;
      isolatedButton.title = \`Toggle isolated pages (\${isolatedCount} pages)\`;
      layerTogglesContainer.appendChild(isolatedButton);
    }

    function toggleLayer(layer) {
      const layerStr = String(layer);

      if (collapsedLayers.has(layerStr)) {
        collapsedLayers.delete(layerStr);
      } else {
        collapsedLayers.add(layerStr);
      }

      // Update node visibility
      nodeGroups.each(function(d) {
        const node = d3.select(this);
        const isCollapsed = collapsedLayers.has(String(d.layer));

        if (isCollapsed) {
          node.style('display', 'none');
        } else {
          // Check if already hidden by filters
          const currentDisplay = node.style('display');
          if (currentDisplay === 'none' && !isCollapsed) {
            // Don't show if hidden by filters - reapply filters
            applyFilters();
          }
        }
      });

      // Update button styling
      document.querySelectorAll('.layer-toggle-button').forEach(button => {
        if (button.dataset.layer === layerStr) {
          button.classList.toggle('collapsed', collapsedLayers.has(layerStr));
        }
      });

      // Update link visibility
      linkElements.each(function(d) {
        const link = d3.select(this);
        const sourceNode = nodes.find(n => n.id === d.source.id || n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target.id || n.id === d.target);

        const sourceCollapsed = collapsedLayers.has(String(sourceNode?.layer));
        const targetCollapsed = collapsedLayers.has(String(targetNode?.layer));

        if (sourceCollapsed || targetCollapsed) {
          link.style('display', 'none');
        } else {
          // Check if visible by filters
          const sourceVisible = nodeGroups.filter(n => n.id === sourceNode?.id).style('display') !== 'none';
          const targetVisible = nodeGroups.filter(n => n.id === targetNode?.id).style('display') !== 'none';
          link.style('display', (sourceVisible && targetVisible) ? null : 'none');
        }
      });
    }

    // Add click handlers to layer toggle buttons
    document.querySelectorAll('.layer-toggle-button').forEach(button => {
      button.addEventListener('click', () => {
        toggleLayer(button.dataset.layer);
      });
    });

    // Export functionality
    function exportSVG() {
      // Clone the SVG element
      const svgElement = document.getElementById('visualization');
      const svgClone = svgElement.cloneNode(true);

      // Get the current viewBox or calculate bounds
      const bbox = svgElement.getBBox();
      svgClone.setAttribute('viewBox', \`0 0 \${bbox.width + bbox.x} \${bbox.height + bbox.y}\`);

      // Add XML namespace
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      // Serialize SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);

      // Create blob and download
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'swift-org-sitemap.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function exportPNG() {
      const svgElement = document.getElementById('visualization');
      const svgClone = svgElement.cloneNode(true);

      // Get dimensions
      const bbox = svgElement.getBBox();
      const width = bbox.width + bbox.x;
      const height = bbox.height + bbox.y;

      // Set viewBox
      svgClone.setAttribute('viewBox', \`0 0 \${width} \${height}\`);
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Serialize to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);

      // Create canvas
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x for better quality
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      // Create image from SVG
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = function() {
        // Fill white background
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, width, height);

        // Draw SVG onto canvas
        ctx.drawImage(img, 0, 0);

        // Convert to PNG and download
        canvas.toBlob(function(blob) {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'swift-org-sitemap.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      img.src = url;
    }

    // Export button handlers
    document.getElementById('export-svg').addEventListener('click', exportSVG);
    document.getElementById('export-png').addEventListener('click', exportPNG);

    // Performance metrics
    const perfEnd = performance.now();
    const renderTime = perfEnd - performance.timing.navigationStart;

    console.log('Visualization rendered:', {
      nodes: nodes.length,
      links: links.length,
      layers: layerNumbers.length,
      renderTimeMs: Math.round(renderTime),
      optimizations: ['Barnes-Hut approximation (theta=0.9)', 'Link culling (maxDiff=3 layers)', 'Distance limiting (500px)']
    });
  </script>
</body>
</html>`;
}

/**
 * Main entry point
 */
async function main() {
  log('Starting Site Visualization Tool', 'blue')
  log(`Input: ${CONFIG.inputFile}`, 'blue')
  log(`Output: ${CONFIG.outputFile}\n`, 'blue')

  // Load report
  log('Loading site check report...', 'cyan')
  const report = await loadReport(CONFIG.inputFile)
  log(`  Loaded ${Object.keys(report.pages).length} pages\n`, 'green')

  // Calculate layers
  log('Calculating page layers and depths...', 'cyan')
  const { layers, pageMetadata } = calculateLayers(report.pages)
  log(`  Organized into ${Object.keys(layers).length} layers\n`, 'green')

  // Generate statistics
  const stats = generateStatistics(layers, pageMetadata, report)
  printSummary(stats, layers)

  // Generate HTML visualization
  log('Generating HTML visualization...', 'cyan')
  const html = generateHTML(report, layers, pageMetadata, stats)
  await fs.writeFile(CONFIG.outputFile, html, 'utf8')
  log(`✓ Visualization saved to: ${CONFIG.outputFile}\n`, 'green')

  log('Open the file in your browser to view the interactive sitemap!', 'cyan')
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    log(`Fatal error: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  })
}

module.exports = { main, calculateLayers, identifyHeaderFooterPages }
