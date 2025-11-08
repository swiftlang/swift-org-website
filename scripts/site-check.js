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
 * Site Check Tool
 *
 * Crawls the local Swift.org development site to identify content issues:
 * - Broken internal links
 * - Broken images
 * - Isolated pages (no incoming links)
 * - Pages with no outgoing links
 *
 * The crawler attempts to load /sitemap.xml first to get a comprehensive list
 * of all pages. If the sitemap is not available, it falls back to crawling
 * from the homepage.
 *
 * Usage: npm run site-check
 *
 * Environment Variables:
 * - SITE_URL: Base URL to crawl (default: http://localhost:4000)
 * - MAX_PAGES: Maximum number of pages to crawl (default: 1000)
 * - CHECK_EXTERNAL: Whether to check external links (default: false)
 * - CRAWL_DELAY: Delay in milliseconds between page requests (default: 50)
 *               Increase this if your dev server is struggling (e.g., 250, 500, 1000)
 */

const { chromium } = require('playwright')
const fs = require('fs').promises

// Configuration - can be overridden via environment variables
const CONFIG = {
  baseUrl: process.env.SITE_URL || 'http://localhost:4000', // Target site URL
  maxPages: parseInt(process.env.MAX_PAGES, 10) || 1000, // Limit crawl to prevent runaway
  timeout: 10000, // Page load timeout in milliseconds
  checkExternalLinks: process.env.CHECK_EXTERNAL === 'true', // Currently unused, reserved for future
  concurrency: 3, // Currently unused, reserved for concurrent crawling
  outputFile: 'site-check-report.json', // Where to save the detailed JSON report
  delayBetweenRequests: parseInt(process.env.CRAWL_DELAY, 10) || 50, // Delay in ms between page requests (default 50ms)
}

// State tracking - shared across all crawl operations
// All URLs are stored as URIs (e.g., '/blog/post') for consistency
// URIs always start with '/' and represent paths from the site root
// Homepage is always represented as '/'
// External links are stored as full URLs on each page
const state = {
  visited: new Set(), // URIs already crawled
  toVisit: new Set(), // URIs to crawl next
  pages: new Map(), // uri -> { outgoingLinks: {header: [], footer: [], content: []}, images: [], incomingLinks: [], externalLinks: [] }
  brokenLinks: [], // Links that returned 404 (URIs)
  brokenImages: new Map(), // Map of broken image URI -> { pages: [], alt: string }
  redirects: new Map(), // Map of source URI -> target URI for all redirects discovered
  errors: [], // Pages that threw errors during crawl (URIs)
  canonicalUrls: new Map(), // Map of any URI variant -> canonical URI (resolved after redirects)
}

// Color codes for console output - ANSI escape sequences
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// Helper to log colored messages to console
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Helper to add delay between requests
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Normalize hostname to treat localhost and 0.0.0.0 as equivalent
function normalizeHost(hostname) {
  if (hostname === '0.0.0.0' || hostname === 'localhost') {
    return 'localhost'
  }
  return hostname
}

// Check if URL belongs to the same site being crawled (not external)
function isInternalUrl(url, baseUrl) {
  try {
    const urlObj = new URL(url, baseUrl)
    const baseObj = new URL(baseUrl)

    return (
      normalizeHost(urlObj.hostname) === normalizeHost(baseObj.hostname) &&
      urlObj.port === baseObj.port
    )
  } catch {
    return false
  }
}

// Normalize URLs for consistent comparison - removes hash only
// Keep trailing slashes and extensions as-is to preserve server behavior
function normalizeUrl(url, baseUrl) {
  try {
    const urlObj = new URL(url, baseUrl)
    // Only remove hash for consistency - keep everything else as-is
    urlObj.hash = ''
    return urlObj.href
  } catch {
    return null
  }
}

// Strip base URL from internal links - returns just the path/URI
function stripBaseUrl(url, baseUrl) {
  try {
    const urlObj = new URL(url)
    const baseObj = new URL(baseUrl)

    // Only strip if it's the same host (with normalization) and same port
    if (
      normalizeHost(urlObj.hostname) === normalizeHost(baseObj.hostname) &&
      urlObj.port === baseObj.port
    ) {
      return urlObj.pathname + urlObj.search + urlObj.hash
    }
    return url
  } catch {
    return url
  }
}

/**
 * Convert a full URL to a URI (path + search)
 * Store URLs as-is without transformation - canonicalization happens later
 * @param {string} url - Full URL to convert
 * @param {string} baseUrl - Base URL to strip
 * @returns {string|null} URI representation, always '/' for homepage, always starts with '/'
 */
function toUri(url, baseUrl) {
  const normalized = normalizeUrl(url, baseUrl)
  if (!normalized) return null

  let uri = stripBaseUrl(normalized, baseUrl)

  // Ensure URI always starts with '/' for consistency
  if (uri === '') return '/'
  if (!uri.startsWith('/')) {
    // This shouldn't happen, but handle it defensively
    uri = '/' + uri
  }

  // Return URI as-is without any transformation
  // This preserves the original URL structure (trailing slashes, extensions, etc.)
  return uri
}

/**
 * Convert a URI back to a full URL
 * @param {string} uri - URI to convert (e.g., '/blog/post')
 * @param {string} baseUrl - Base URL to prepend
 * @returns {string} Full URL
 */
function uriToUrl(uri, baseUrl) {
  if (uri === '/') {
    return baseUrl
  }
  return new URL(uri, baseUrl).href
}

/**
 * Create initial page data structure
 * @param {number|null} status - HTTP status code (optional)
 * @returns {object} Page data object
 */
function createPageData(status = null) {
  const data = {
    outgoingLinks: {
      header: [],
      footer: [],
      content: [],
    },
    images: [],
    incomingLinks: [],
    externalLinks: [], // Full URLs to external sites
  }

  if (status !== null) {
    data.status = status
  }

  return data
}

/**
 * Get list of pages that link to the given URI
 * @param {string} uri - URI to get referrers for
 * @returns {Array<string>} Array of URIs that link to this page
 */
function getReferrers(uri) {
  return state.pages.has(uri) ? state.pages.get(uri).incomingLinks : []
}

/**
 * Check if a redirect occurred and track it
 * @param {string} requestedUri - URI that was requested
 * @param {string} responseUrl - Full URL from browser response
 * @param {string} baseUrl - Base URL for conversion
 * @returns {string|null} Final URI if redirect occurred, null otherwise
 */
function trackRedirect(requestedUri, responseUrl, baseUrl) {
  const finalUri = toUri(responseUrl, baseUrl)

  // No redirect if same URI
  if (finalUri === requestedUri) return null

  // Track this redirect in our map
  state.redirects.set(requestedUri, finalUri)
  log(`  Redirect: ${requestedUri} -> ${finalUri}`, 'yellow')

  return finalUri
}

// Extract all links and images from the current page using browser context
// Links are categorized into header, footer, and content buckets
async function extractLinksAndImages(page) {
  return await page.evaluate(() => {
    const images = []

    // Helper to extract links from a container
    const extractLinks = (container) => {
      const links = []
      if (!container) return links

      container.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href')
        if (
          href &&
          !href.startsWith('javascript:') &&
          !href.startsWith('mailto:')
        ) {
          links.push({
            href: a.href, // Use fully resolved URL from browser, not raw attribute
            text: a.textContent.trim().substring(0, 100), // Truncate long link text
          })
        }
      })
      return links
    }

    // Extract header/navigation links
    const headerContainer = document.querySelector('header.site-navigation')
    const headerLinks = extractLinks(headerContainer)

    // Extract footer links
    const footerContainer = document.querySelector('footer.global-footer')
    const footerLinks = extractLinks(footerContainer)

    // Extract content links (defensive: all links minus header and footer)
    const allLinks = extractLinks(document)
    const headerHrefs = new Set(headerLinks.map((l) => l.href))
    const footerHrefs = new Set(footerLinks.map((l) => l.href))
    const contentLinks = allLinks.filter(
      (link) => !headerHrefs.has(link.href) && !footerHrefs.has(link.href),
    )

    // Extract all images with their src and alt text
    document.querySelectorAll('img[src]').forEach((img) => {
      images.push({
        src: img.src, // Use fully resolved URL from browser, not raw attribute
        alt: img.getAttribute('alt') || '(no alt text)',
      })
    })

    return { headerLinks, footerLinks, contentLinks, images }
  })
}

// Main crawl function - visits a page, extracts links/images, checks validity
async function crawlPage(browser, uri) {
  // Skip if already visited or reached max page limit from CONFIG
  if (state.visited.has(uri) || state.visited.size >= CONFIG.maxPages) {
    return
  }

  // Mark as visited immediately to prevent duplicate crawls
  state.visited.add(uri)
  log(`[${state.visited.size}/${CONFIG.maxPages}] Crawling: ${uri}`, 'cyan')

  // Convert URI to full URL for browser
  const fullUrl = uriToUrl(uri, CONFIG.baseUrl)

  const page = await browser.newPage()
  const failedImages = new Set() // Track images that failed (store as URIs)

  // Listen for failed image requests - convert to URI
  page.on('requestfailed', (request) => {
    if (request.resourceType() === 'image') {
      const imageUri = toUri(request.url(), CONFIG.baseUrl)
      if (imageUri) {
        failedImages.add(imageUri)
      }
    }
  })

  try {
    // Load page with full URL
    const response = await page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    })

    // Track pages that fail to load
    if (!response || response.status() !== 200) {
      const referrers = getReferrers(uri)

      state.errors.push({
        url: uri,
        error: `HTTP ${response?.status() || 'unknown'}`,
        referrers,
      })
      await page.close()
      return
    }

    // Detect and track redirects
    const finalUri = trackRedirect(uri, response.url(), CONFIG.baseUrl)
    const actualUri = finalUri || uri // Use redirected URI if redirect occurred

    // If this page redirected, mark the target as visited to avoid crawling it again
    if (finalUri) {
      state.visited.add(finalUri)
      // Remove from toVisit queue if it's there
      state.toVisit.delete(finalUri)
    }

    // Store canonical URL mapping
    state.canonicalUrls.set(uri, actualUri)
    if (finalUri) {
      // Also map the final URI to itself
      state.canonicalUrls.set(finalUri, finalUri)
    }

    // Extract links and images
    const { headerLinks, footerLinks, contentLinks, images } =
      await extractLinksAndImages(page)

    // Initialize page data for the actual URI (after redirect resolution)
    if (!state.pages.has(actualUri)) {
      state.pages.set(actualUri, createPageData(response.status()))
    }

    const pageData = state.pages.get(actualUri)

    // Helper function to process links from a specific category
    const processLinks = (links, category) => {
      for (const link of links) {
        // link.href is now a fully resolved URL from the browser
        const linkFullUrl = normalizeUrl(link.href, CONFIG.baseUrl)
        if (!linkFullUrl) continue

        // Check if link is internal or external
        if (isInternalUrl(linkFullUrl, CONFIG.baseUrl)) {
          const linkUri = toUri(linkFullUrl, CONFIG.baseUrl)
          if (!linkUri) continue

          // Internal link - add to categorized outgoing links (as URI, not canonical yet)
          pageData.outgoingLinks[category].push(linkUri)

          // Track incoming links for orphan detection (using actualUri as source)
          if (!state.pages.has(linkUri)) {
            state.pages.set(linkUri, createPageData())
          }
          state.pages.get(linkUri).incomingLinks.push(actualUri)

          // Add to crawl queue if not yet visited
          if (!state.visited.has(linkUri)) {
            state.toVisit.add(linkUri)
          }
        } else {
          // External link - store full URL on this page
          pageData.externalLinks.push(linkFullUrl)
        }
      }
    }

    // Process links from each category
    processLinks(headerLinks, 'header')
    processLinks(footerLinks, 'footer')
    processLinks(contentLinks, 'content')

    // Process images and check against failed requests
    for (const image of images) {
      // image.src is now a fully resolved URL from the browser
      const imageFullUrl = normalizeUrl(image.src, CONFIG.baseUrl)
      if (!imageFullUrl) continue

      const imageUri = toUri(imageFullUrl, CONFIG.baseUrl)
      if (!imageUri) continue

      pageData.images.push(imageUri)

      // Check if image failed to load (compare URIs)
      if (failedImages.has(imageUri)) {
        if (!state.brokenImages.has(imageUri)) {
          state.brokenImages.set(imageUri, {
            pages: [uri],
            alt: image.alt,
          })
        } else {
          state.brokenImages.get(imageUri).pages.push(uri)
        }
      }
    }
  } catch (error) {
    const referrers = getReferrers(uri)

    state.errors.push({
      url: uri,
      error: error.message,
      referrers,
    })
    log(`  Error: ${error.message}`, 'red')
  } finally {
    await page.close()
  }
}

// Validate links that were discovered but not crawled (check for 404s)
// Only validates internal links - external links are not checked
// This also discovers redirects for unvisited links
async function validateLinks(browser) {
  log('\nValidating internal links...', 'blue')

  const page = await browser.newPage()
  const allLinks = new Set()

  // Collect all unique internal link URIs from crawled pages
  for (const [uri, data] of state.pages) {
    // Collect from all three categories
    for (const link of data.outgoingLinks.header) {
      allLinks.add(link)
    }
    for (const link of data.outgoingLinks.footer) {
      allLinks.add(link)
    }
    for (const link of data.outgoingLinks.content) {
      allLinks.add(link)
    }
  }

  // Check links that weren't visited during crawl
  for (const linkUri of allLinks) {
    if (!state.visited.has(linkUri)) {
      try {
        log(`  Checking unvisited link: ${linkUri}`, 'yellow')

        // Convert URI to full URL for request
        const fullUrl = uriToUrl(linkUri, CONFIG.baseUrl)

        // Use page.request.get() instead of page.goto() for faster validation
        // This follows redirects but doesn't render/parse the page
        const response = await page.request.get(fullUrl, {
          timeout: CONFIG.timeout,
          maxRedirects: 3, // Follow up to 3 redirects
        })

        if (!response) {
          const referrers = getReferrers(linkUri)
          state.errors.push({
            url: linkUri,
            error: 'No response received',
            referrers,
          })
          continue
        }

        // Track redirect if one occurred by checking final URL
        const responseUrl = response.url()
        const finalUri = trackRedirect(linkUri, responseUrl, CONFIG.baseUrl)
        const actualUri = finalUri || linkUri

        // Store canonical URL mapping
        state.canonicalUrls.set(linkUri, actualUri)
        if (finalUri) {
          state.canonicalUrls.set(finalUri, finalUri)
        }

        // Mark as broken if 404
        if (response.status() === 404) {
          const referrers = getReferrers(linkUri)

          state.brokenLinks.push({
            url: linkUri,
            referrers,
            status: 404,
          })
        } else {
          // Successful validation - ensure page data exists for actual URI
          if (!state.pages.has(actualUri)) {
            state.pages.set(actualUri, createPageData(response.status()))
          }
        }

        // Add delay between validation requests
        if (CONFIG.delayBetweenRequests > 0) {
          await sleep(CONFIG.delayBetweenRequests)
        }
      } catch (error) {
        const referrers = getReferrers(linkUri)

        state.errors.push({
          url: linkUri,
          error: `Validation failed: ${error.message}`,
          referrers,
        })
        log(`  Error checking ${linkUri}: ${error.message}`, 'red')
      }
    }
  }

  await page.close()
}

// Find pages with no incoming links (orphaned/isolated pages)
function analyzeIsolatedPages() {
  const isolated = []

  for (const [uri, data] of state.pages) {
    // Skip homepage from isolation check
    if (uri === '/') continue

    // Check if page has incoming links (excluding self-references)
    const incomingLinks = data.incomingLinks.filter((link) => link !== uri)
    if (incomingLinks.length === 0) {
      // Count total outgoing links across all categories
      const totalOutgoingLinks =
        data.outgoingLinks.header.length +
        data.outgoingLinks.footer.length +
        data.outgoingLinks.content.length

      isolated.push({
        url: uri,
        outgoingLinks: totalOutgoingLinks,
      })
    }
  }

  return isolated
}

/**
 * Canonicalize all URIs in the state to their final destinations
 * This resolves redirect chains and updates all references
 */
function canonicalizeUrls() {
  log('\nCanonicalizing URLs...', 'blue')

  // Helper to resolve a URI through the redirect chain
  const resolveUri = (uri) => {
    const visited = new Set()
    let current = uri

    // Follow redirect chain until we reach the end or detect a loop
    while (state.redirects.has(current)) {
      if (visited.has(current)) {
        log(`  Warning: Redirect loop detected for ${uri}`, 'yellow')
        break
      }
      visited.add(current)
      current = state.redirects.get(current)
    }

    return current
  }

  // Build complete canonical mapping by resolving all redirect chains
  for (const uri of state.canonicalUrls.keys()) {
    const canonical = resolveUri(uri)
    state.canonicalUrls.set(uri, canonical)
  }

  // Also ensure all pages are in the canonical map
  for (const uri of state.pages.keys()) {
    if (!state.canonicalUrls.has(uri)) {
      state.canonicalUrls.set(uri, resolveUri(uri))
    }
  }

  // Canonicalize all links in page data
  const newPages = new Map()

  for (const [uri, data] of state.pages) {
    const canonicalUri = state.canonicalUrls.get(uri) || uri

    // Canonicalize outgoing links
    const canonicalOutgoing = {
      header: data.outgoingLinks.header.map(
        (link) => state.canonicalUrls.get(link) || link
      ),
      footer: data.outgoingLinks.footer.map(
        (link) => state.canonicalUrls.get(link) || link
      ),
      content: data.outgoingLinks.content.map(
        (link) => state.canonicalUrls.get(link) || link
      ),
    }

    // Canonicalize incoming links
    const canonicalIncoming = data.incomingLinks.map(
      (link) => state.canonicalUrls.get(link) || link
    )

    // Get or create target page data
    if (!newPages.has(canonicalUri)) {
      newPages.set(canonicalUri, {
        outgoingLinks: { header: [], footer: [], content: [] },
        images: [],
        incomingLinks: [],
        externalLinks: [],
        status: data.status,
      })
    }

    const targetData = newPages.get(canonicalUri)

    // Always merge the data (whether redirect or not)
    // This handles both the case where a page redirects AND where the redirect target exists
    targetData.outgoingLinks.header.push(...canonicalOutgoing.header)
    targetData.outgoingLinks.footer.push(...canonicalOutgoing.footer)
    targetData.outgoingLinks.content.push(...canonicalOutgoing.content)
    targetData.incomingLinks.push(...canonicalIncoming)
    targetData.images.push(...data.images)
    targetData.externalLinks.push(...data.externalLinks)

    // Preserve status from the canonical URI (if this IS the canonical)
    if (canonicalUri === uri) {
      targetData.status = data.status
    }
  }

  // Deduplicate all arrays in the new pages map
  for (const [uri, data] of newPages) {
    data.outgoingLinks.header = [...new Set(data.outgoingLinks.header)]
    data.outgoingLinks.footer = [...new Set(data.outgoingLinks.footer)]
    data.outgoingLinks.content = [...new Set(data.outgoingLinks.content)]
    data.incomingLinks = [...new Set(data.incomingLinks)]
    data.externalLinks = [...new Set(data.externalLinks)]
    data.images = [...new Set(data.images)]
  }

  // Replace state.pages with canonicalized version
  state.pages = newPages

  log(`  Canonicalized ${state.pages.size} pages`, 'green')
}

// Load and parse sitemap.xml to get initial list of URLs to crawl
async function loadSitemap(browser) {
  const sitemapUrl = `${CONFIG.baseUrl}/sitemap.xml`
  log(`Attempting to load sitemap from: ${sitemapUrl}`, 'blue')

  const page = await browser.newPage()
  const uris = []

  try {
    const response = await page.goto(sitemapUrl, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    })

    if (!response || response.status() !== 200) {
      log(
        `  Sitemap not found (HTTP ${response?.status() || 'unknown'})`,
        'yellow',
      )
      return null
    }

    // Get the sitemap content
    const content = await page.content()

    // Parse XML to extract <loc> tags using regex
    // This handles both <loc>URL</loc> and <loc><![CDATA[URL]]></loc> formats
    const locRegex = /<loc>\s*(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?\s*<\/loc>/gi
    let match

    while ((match = locRegex.exec(content)) !== null) {
      const url = match[1].trim()
      if (url && isInternalUrl(url, CONFIG.baseUrl)) {
        const uri = toUri(url, CONFIG.baseUrl)
        if (uri) {
          uris.push(uri)
        }
      }
    }

    if (uris.length === 0) {
      log(`  Sitemap found but contains no valid URLs`, 'yellow')
      return null
    }

    log(`  Found ${uris.length} URLs in sitemap`, 'green')
    return uris
  } catch (error) {
    log(`  Error loading sitemap: ${error.message}`, 'yellow')
    return null
  } finally {
    await page.close()
  }
}

// Generate JSON report with all findings - saved to CONFIG.outputFile
function generateReport() {
  const isolated = analyzeIsolatedPages()

  // Count total links across all categories
  const totalLinks = Array.from(state.pages.values()).reduce((sum, p) => {
    return (
      sum +
      p.outgoingLinks.header.length +
      p.outgoingLinks.footer.length +
      p.outgoingLinks.content.length
    )
  }, 0)

  // Create a Set of isolated page URIs for quick lookup
  const isolatedSet = new Set(isolated.map((p) => p.url))

  // Build redirect list from the redirect map
  const redirectList = Array.from(state.redirects.entries()).map(
    ([from, to]) => ({
      from,
      to,
      status: 301, // Most redirects are 301 or 302, but we don't track the exact code anymore
    })
  )

  // Build page-centric report structure
  const pages = {}
  for (const [uri, data] of state.pages.entries()) {
    // Find any error that occurred on this page
    const error = state.errors.find((e) => e.url === uri)

    // Find broken links that this page links to
    const brokenLinksFromThisPage = state.brokenLinks
      .filter(
        (bl) =>
          data.outgoingLinks.header.includes(bl.url) ||
          data.outgoingLinks.footer.includes(bl.url) ||
          data.outgoingLinks.content.includes(bl.url),
      )
      .map((bl) => ({
        url: bl.url, // Already a URI
        status: bl.status,
      }))

    // Find broken images on this page
    const brokenImagesOnPage = Array.from(state.brokenImages.entries())
      .filter(([, imageData]) => imageData.pages.includes(uri))
      .map(([imageUri, imageData]) => ({
        url: imageUri, // Already a URI
        alt: imageData.alt,
      }))

    // Deduplicate incoming links (already URIs)
    const uniqueIncomingLinks = [...new Set(data.incomingLinks)]

    // Deduplicate external links (full URLs)
    const uniqueExternalLinks = [...new Set(data.externalLinks)]

    // Find all URIs that redirect to this page
    const redirectsToHere = Array.from(state.redirects.entries())
      .filter(([, target]) => target === uri)
      .map(([source]) => source)

    pages[uri] = {
      incomingLinks: uniqueIncomingLinks,
      isIsolated: isolatedSet.has(uri),
      outgoingLinks: {
        header: data.outgoingLinks.header, // Already canonical URIs
        footer: data.outgoingLinks.footer, // Already canonical URIs
        content: data.outgoingLinks.content, // Already canonical URIs
      },
      externalLinks: uniqueExternalLinks, // Full URLs
      imagesCount: data.images.length,
      issues: {
        redirect: redirectsToHere.length > 0 ? { from: redirectsToHere } : null,
        error: error ? error.error : null,
        brokenLinks: brokenLinksFromThisPage,
        brokenImages: brokenImagesOnPage,
      },
    }
  }

  // Count unique external domains across all pages
  const allExternalDomains = new Set()
  for (const pageData of state.pages.values()) {
    for (const externalUrl of pageData.externalLinks) {
      try {
        const domain = new URL(externalUrl).hostname
        allExternalDomains.add(domain)
      } catch (e) {
        // Invalid URL, skip
      }
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    summary: {
      totalPages: state.visited.size,
      totalLinks: totalLinks,
      brokenLinks: state.brokenLinks.length,
      brokenImages: state.brokenImages.size,
      redirects: redirectList.length,
      isolatedPages: isolated.length,
      errors: state.errors.length,
      externalDomains: allExternalDomains.size,
    },
    pages: pages,
  }

  return report
}

// Print colorized summary to console - truncates long lists
function printSummary(report) {
  log('\n' + '='.repeat(60), 'cyan')
  log('Site Check Summary', 'cyan')
  log('='.repeat(60), 'cyan')

  log(`\nPages Crawled: ${report.summary.totalPages}`, 'blue')
  log(`Total Links: ${report.summary.totalLinks}`, 'blue')

  // Collect issues from page-centric structure
  const brokenLinks = []
  const brokenImages = []
  const redirects = []
  const isolatedPages = []

  for (const [pageUrl, pageData] of Object.entries(report.pages)) {
    if (pageData.issues.brokenLinks.length > 0) {
      pageData.issues.brokenLinks.forEach((bl) => {
        brokenLinks.push({
          url: bl.url,
          referrer: pageUrl,
        })
      })
    }
    if (pageData.issues.brokenImages.length > 0) {
      pageData.issues.brokenImages.forEach((bi) => {
        brokenImages.push({
          url: bi.url,
          alt: bi.alt,
          page: pageUrl,
        })
      })
    }
    if (pageData.issues.redirect) {
      redirects.push({
        from: pageUrl,
        to: pageData.issues.redirect.to,
      })
    }
    if (pageData.isIsolated) {
      isolatedPages.push(pageUrl)
    }
    if (pageData.issues.error) {
      // Add to broken links list so they appear in the broken links report
      // Include error pages even if they have no referrers
      if (pageData.incomingLinks.length > 0) {
        pageData.incomingLinks.forEach((referrer) => {
          brokenLinks.push({
            url: pageUrl,
            referrer: referrer,
            error: pageData.issues.error,
          })
        })
      } else {
        // Error page with no incoming links - still report it
        brokenLinks.push({
          url: pageUrl,
          referrer: '(no referrers)',
          error: pageData.issues.error,
        })
      }
    }
  }

  if (brokenLinks.length > 0) {
    log(`\n❌ Broken Links: ${brokenLinks.length}`, 'red')
    brokenLinks.forEach((link) => {
      log(`  ${link.url}`, 'red')
      if (link.error) {
        log(`    Error: ${link.error}`, 'red')
      }
      log(`    Referenced by: ${link.referrer}`, 'yellow')
    })
  } else {
    log(`\n✅ No broken links found`, 'green')
  }

  if (brokenImages.length > 0) {
    log(`\n❌ Broken Images: ${brokenImages.length}`, 'red')
    brokenImages.slice(0, 10).forEach((img) => {
      log(`  ${img.url}`, 'red')
      log(`    Alt text: ${img.alt}`, 'yellow')
      log(`    Found on: ${img.page}`, 'yellow')
    })
    if (brokenImages.length > 10) {
      log(
        `  ... and ${brokenImages.length - 10} more (see report file)`,
        'yellow',
      )
    }
  } else {
    log(`\n✅ No broken images found`, 'green')
  }

  if (redirects.length > 0) {
    log(`\n⚠️  Redirects: ${redirects.length}`, 'yellow')
    log('  (Pages that redirect to another URL)', 'yellow')
    redirects.slice(0, 10).forEach((redirect) => {
      log(`  ${redirect.from}`, 'yellow')
      log(`    -> ${redirect.to}`, 'cyan')
    })
    if (redirects.length > 10) {
      log(`  ... and ${redirects.length - 10} more (see report file)`, 'yellow')
    }
  } else {
    log(`\n✅ No redirects found`, 'green')
  }

  if (isolatedPages.length > 0) {
    log(`\n⚠️  Isolated Pages: ${isolatedPages.length}`, 'yellow')
    log('  (Pages with no incoming links from the site)', 'yellow')
    isolatedPages.forEach((page) => {
      log(`  ${page}`, 'yellow')
    })
  } else {
    log(`\n✅ No isolated pages found`, 'green')
  }

  if (report.summary.externalDomains > 0) {
    log(
      `\n🔗 External Domains Linked: ${report.summary.externalDomains}`,
      'blue',
    )
    log('  (See individual pages in report for details)', 'blue')
  }

  log(`\n📄 Full report saved to: ${CONFIG.outputFile}`, 'green')
  log('='.repeat(60) + '\n', 'cyan')
}

// Main entry point - orchestrates crawl, validation, and reporting
async function main() {
  log('Starting Swift.org Site Check Tool', 'blue')
  log(`Base URL: ${CONFIG.baseUrl}`, 'blue')
  log(`Max Pages: ${CONFIG.maxPages}\n`, 'blue')

  // Launch headless browser via Playwright
  const browser = await chromium.launch({ headless: true })

  try {
    // Try to load sitemap.xml to get initial list of URIs
    const sitemapUris = await loadSitemap(browser)

    if (sitemapUris && sitemapUris.length > 0) {
      // Use sitemap URIs as starting point
      log(`Using sitemap URLs as crawl queue`, 'green')
      for (const uri of sitemapUris) {
        state.toVisit.add(uri)
      }
    } else {
      // Fall back to starting from homepage
      log(`⚠️  Sitemap not available, starting from homepage only`, 'yellow')
      log(
        `   This may miss pages not linked from the site navigation\n`,
        'yellow',
      )
      state.toVisit.add('/') // Always use '/' for homepage
    }

    log('') // Empty line before crawl starts

    // Crawl pages until queue empty or hit CONFIG.maxPages
    while (state.toVisit.size > 0 && state.visited.size < CONFIG.maxPages) {
      // Get and remove first URI from Set
      const uri = state.toVisit.values().next().value
      state.toVisit.delete(uri)
      await crawlPage(browser, uri)

      // Add delay between requests to avoid overwhelming the server
      if (state.toVisit.size > 0 && CONFIG.delayBetweenRequests > 0) {
        await sleep(CONFIG.delayBetweenRequests)
      }
    }

    // Validate all discovered links that weren't crawled
    await validateLinks(browser)

    // Canonicalize all URIs to their final destinations
    canonicalizeUrls()

    // Generate report
    const report = generateReport()

    // Save to file specified in CONFIG.outputFile
    await fs.writeFile(
      CONFIG.outputFile,
      JSON.stringify(report, null, 2),
      'utf8',
    )

    // Print summary
    printSummary(report)

    // Exit with error code if issues found (for CI integration)
    const hasIssues =
      report.summary.brokenLinks > 0 ||
      report.summary.brokenImages > 0 ||
      report.summary.errors > 0

    process.exit(hasIssues ? 1 : 0)
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

// Run if called directly (not imported as module)
if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { main }
