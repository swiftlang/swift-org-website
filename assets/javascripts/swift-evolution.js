// This source file is part of the Swift.org open source project
//
// Copyright (c) 2014 - 2024 Apple Inc. and the Swift project authors
// Licensed under Apache License v2.0 with Runtime Library Exception
//
// See http://swift.org/LICENSE.txt for license information
// See http://swift.org/CONTRIBUTORS.txt for the list of Swift project authors
//
// ===---------------------------------------------------------------------===//
"use strict";

const EVOLUTION_METADATA_URL =
  "https://download.swift.org/swift-evolution/v1/evolution.json";
const GITHUB_BASE_URL = "https://github.com/";
const REPO_PROPOSALS_BASE_URL =
  GITHUB_BASE_URL + "swiftlang/swift-evolution/blob/main/proposals";
const UFF_INFO_URL = "/blog/using-upcoming-feature-flags/";

/** Holds the primary data used on this page: metadata about Swift Evolution proposals. */
let proposals;

/** Array of language versions in which proposals have been implemented. */
let languageVersions;

/** Storage for the user's current selection of filters when filtering is toggled off. */
let filterSelection = [];

let upcomingFeatureFlagFilterEnabled = false;

/** Proposal state string constants */
const State = Object.freeze({
  awaitingReview: "awaitingReview",
  scheduledForReview: "scheduledForReview",
  activeReview: "activeReview",
  returnedForRevision: "returnedForRevision",
  withdrawn: "withdrawn",
  accepted: "accepted",
  acceptedWithRevisions: "acceptedWithRevisions",
  rejected: "rejected",
  implemented: "implemented",
  previewing: "previewing",
  error: "error",
});

/**
 * property names: Proposal state string constants
 *
 * `name`: Mapping of the states in the proposals JSON to human-readable names.
 *
 * `shortName`:  Mapping of the states in the proposals JSON to short human-readable names.
 *  Used for the left-hand column of proposal statuses.
 *
 * `className`: Mapping of states in the proposals JSON to the CSS class names used
 * to manipulate and display proposals based on their status.
 *
 * `count`: Number of proposals with that state. Calculated after proposals are loaded.
 */
const states = {
  [State.awaitingReview]: {
    name: "Awaiting Review",
    shortName: "Awaiting Review",
    className: "awaiting-review",
    count: 0,
  },
  [State.scheduledForReview]: {
    name: "Scheduled for Review",
    shortName: "Scheduled",
    className: "scheduled-for-review",
    count: 0,
  },
  [State.activeReview]: {
    name: "Active Review",
    shortName: "Active Review",
    statusPrefix: "In ",
    className: "active-review",
    count: 0,
  },
  [State.returnedForRevision]: {
    name: "Returned for Revision",
    shortName: "Returned",
    className: "returned-for-revision",
    count: 0,
  },
  [State.withdrawn]: {
    name: "Withdrawn",
    shortName: "Withdrawn",
    className: "withdrawn",
    count: 0,
  },
  [State.accepted]: {
    name: "Accepted",
    shortName: "Accepted",
    className: "accepted",
    count: 0,
  },
  [State.acceptedWithRevisions]: {
    name: "Accepted with revisions",
    shortName: "Accepted",
    className: "accepted-with-revisions",
    count: 0,
  },
  [State.rejected]: {
    name: "Rejected",
    shortName: "Rejected",
    className: "rejected",
    count: 0,
  },
  [State.implemented]: {
    name: "Implemented",
    shortName: "Implemented",
    className: "implemented",
    count: 0,
  },
  [State.previewing]: {
    name: "Previewing",
    shortName: "Previewing",
    className: "previewing",
    count: 0,
  },
  [State.error]: {
    name: "Error",
    shortName: "Error",
    className: "error",
    count: 0,
  },
};

init();

/** Primary entry point */
function init() {
  var req = new window.XMLHttpRequest();

  req.addEventListener("load", function () {
    let evolutionMetadata = JSON.parse(req.responseText);
    proposals = evolutionMetadata.proposals;
    languageVersions = evolutionMetadata.implementationVersions;

    // Don't display malformed proposals
    proposals = proposals.filter(function (proposal) {
      return !proposal.errors;
    });

    // Descending numeric sort based the numeric nnnn in a proposal ID's SE-nnnn
    proposals.sort(function compareProposalIDs(p1, p2) {
      return (
        parseInt(p1.id.match(/\d\d\d\d/)[0]) -
        parseInt(p2.id.match(/\d\d\d\d/)[0])
      );
    });
    proposals = proposals.reverse();

    render();
    addEventListeners();

    // apply filters when the page loads with a search already filled out.
    // typically this happens after navigating backwards in a tab's history.
    if (document.querySelector("#search-filter").value.trim()) {
      filterProposals();
    }

    // Apply selections from the current page's URI fragment
    _applyFragment(document.location.hash);
  });

  req.addEventListener("error", function (e) {
    document.querySelector("#proposals-count-number").innerText =
      "Proposal data failed to load.";
  });

  document.querySelector("#proposals-count-number").innerHTML = "Loading…";
  req.open("get", EVOLUTION_METADATA_URL);
  req.send();
}

/**
 * Creates an Element. Convenience wrapper for `document.createElement`.
 *
 * @param {string} elementType - The tag name. 'div', 'span', etc.
 * @param {string[]} attributes - A list of attributes. Use `className` for `class`.
 * @param {(string | Element)[]} children - A list of either text or other Elements to be nested under this Element.
 * @returns {Element} The new node.
 */
function html(elementType, attributes, children) {
  var element = document.createElement(elementType);

  if (attributes) {
    Object.keys(attributes).forEach(function (attributeName) {
      var value = attributes[attributeName];
      if (attributeName === "className") attributeName = "class";
      element.setAttribute(attributeName, value);
    });
  }

  if (!children) return element;
  if (!Array.isArray(children)) children = [children];

  children.forEach(function (child) {
    if (!child) {
      console.warn("Null child ignored during creation of " + elementType);
      return;
    }
    if (Object.getPrototypeOf(child) === String.prototype) {
      child = document.createTextNode(child);
    }

    element.appendChild(child);
  });

  return element;
}

function determineNumberOfProposals(proposals) {
  // Reset count
  Object.keys(states).forEach(function (state) {
    states[state].count = 0;
  });

  proposals.forEach(function (proposal) {
    states[proposal.status.state].count += 1;
  });

  // .acceptedWithRevisions proposals are combined in the filtering UI
  // with .accepted proposals.
  states[State.accepted].count += states[State.acceptedWithRevisions].count;
}

/**
 * Adds the dynamic portions of the page to the DOM, primarily the list
 * of proposals and list of statuses used for filtering.
 *
 * These `render` functions are only called once when the page loads,
 * the rest of the interactivity is based on toggling `display: none`.
 */
function render() {
  renderSearchBar();
  renderProposals();
}

/** Renders the search bar. */
function renderSearchBar() {
  var searchBar = document.querySelector(".search-bar");

  // This list intentionally omits .acceptedWithRevisions and .error;
  // .acceptedWithRevisions proposals are combined in the filtering UI
  // with .accepted proposals.
  var checkboxes = [
    State.awaitingReview,
    State.scheduledForReview,
    State.activeReview,
    State.accepted,
    State.previewing,
    State.implemented,
    State.returnedForRevision,
    State.rejected,
    State.withdrawn,
  ].map(function (state) {
    var className = states[state].className;

    return html("li", null, [
      html("input", {
        type: "checkbox",
        className: "filtered-by-status",
        id: "filter-by-" + className,
        value: className,
      }),
      html(
        "label",
        {
          className: className,
          tabindex: "0",
          role: "button",
          for: "filter-by-" + className,
          "data-state-key": state,
        },
        [addNumberToState(states[state].name, states[state].count)],
      ),
    ]);
  });

  var expandableArea = html("div", { className: "filter-options expandable" }, [
    html("h5", { id: "filter-options-label" }, "Status"),
    html("ul", { id: "status-options", className: "filter-list" }),
  ]);

  searchBar.appendChild(expandableArea);

  checkboxes.forEach(function (box) {
    searchBar.querySelector(".filter-list").appendChild(box);
  });

  // The 'Implemented' filter selection gets an extra row of options if selected.
  var implementedCheckboxIfPresent = checkboxes.filter(function (cb) {
    return cb.querySelector(
      `#filter-by-${states[State.implemented].className}`,
    );
  })[0];

  if (implementedCheckboxIfPresent) {
    // Add an extra row of options to filter by language version
    var versionRowHeader = html(
      "h5",
      { id: "version-options-label", className: "hidden" },
      "Swift Version",
    );
    var versionRow = html("ul", {
      id: "version-options",
      className: "filter-list hidden",
    });

    var versionOptions = languageVersions.map(function (version) {
      return html("li", null, [
        html("input", {
          type: "checkbox",
          id: "filter-by-swift-" + _idSafeName(version),
          className: "filter-by-swift-version",
          value: "swift-" + _idSafeName(version),
        }),
        html(
          "label",
          {
            tabindex: "0",
            role: "button",
            for: "filter-by-swift-" + _idSafeName(version),
          },
          version,
        ),
      ]);
    });

    versionOptions.forEach(function (version) {
      versionRow.appendChild(version);
    });

    expandableArea.appendChild(versionRowHeader);
    expandableArea.appendChild(versionRow);
  }

  return searchBar;
}

/** Displays the main list of proposals */
function renderProposals() {
  var article = document.querySelector("article");

  var proposalAttachPoint = article.querySelector(".proposals-list");

  var proposalPresentationOrder = [
    State.awaitingReview,
    State.scheduledForReview,
    State.activeReview,
    State.accepted,
    State.acceptedWithRevisions,
    State.previewing,
    State.implemented,
    State.returnedForRevision,
    State.rejected,
    State.withdrawn,
  ];

  proposalPresentationOrder.map(function (state) {
    var matchingProposals = proposals.filter(function (p) {
      return p.status && p.status.state === state;
    });
    matchingProposals.map(function (proposal) {
      var proposalBody = html(
        "section",
        { id: proposal.id, className: "proposal " + proposal.id },
        [
          html("div", { className: "status-pill-container" }, [
            html(
              "span",
              { className: "status-pill color-" + states[state].className },
              [states[proposal.status.state].shortName],
            ),
          ]),
          html("div", { className: "proposal-content" }, [
            html("h4", { className: "proposal-header" }, [
              html("span", { className: "proposal-id" }, [proposal.id]),
              html(
                "a",
                {
                  href: REPO_PROPOSALS_BASE_URL + "/" + proposal.link,
                  target: "_blank",
                  className: "proposal-title",
                },
                [proposal.title.trim()],
              ),
            ]),
          ]),
        ],
      );

      var detailNodes = [];
      detailNodes.push(renderAuthors(proposal.authors));

      if (proposal.reviewManagers.length > 0)
        detailNodes.push(renderReviewManagers(proposal.reviewManagers));
      if (proposal.trackingBugs)
        detailNodes.push(renderTrackingBugs(proposal.trackingBugs));
      if (state === State.implemented)
        detailNodes.push(renderVersion(proposal.status.version));
      if (state === State.previewing) detailNodes.push(renderPreview());
      if (proposal.implementation)
        detailNodes.push(renderImplementation(proposal.implementation));
      if (proposal.upcomingFeatureFlag)
        detailNodes.push(
          renderUpcomingFeatureFlag(proposal.upcomingFeatureFlag.flag),
        );
      if (state === State.acceptedWithRevisions)
        detailNodes.push(renderStatus(proposal.status));

      if (state === State.activeReview || state === State.scheduledForReview) {
        detailNodes.push(renderStatus(proposal.status));
        detailNodes.push(renderReviewPeriod(proposal.status));
      }

      if (state === State.returnedForRevision) {
        detailNodes.push(renderStatus(proposal.status));
      }

      var details = html("div", { className: "proposal-details" }, detailNodes);

      proposalBody.querySelector(".proposal-content").appendChild(details);
      proposalAttachPoint.appendChild(proposalBody);
    });
  });

  // Update the "(n) proposals" text
  updateProposalsCount(article.querySelectorAll(".proposal").length);

  return article;
}

/** Authors have a `name` and optional `link`. */
function renderAuthors(authors) {
  return html("div", { className: "authors proposal-detail" }, [
    html(
      "div",
      { className: "proposal-detail-label" },
      authors.length > 1 ? "Authors: " : "Author: ",
    ),
    html(
      "div",
      { className: "proposal-detail-value" },
      personNodesForPersonArray(authors),
    ),
  ]);
}

/** Review managers have a `name` and optional `link`. */
function renderReviewManagers(reviewManagers) {
  return html("div", { className: "review-managers proposal-detail" }, [
    html(
      "div",
      { className: "proposal-detail-label" },
      reviewManagers.length > 1 ? "Review Managers: " : "Review Manager: ",
    ),
    html(
      "div",
      { className: "proposal-detail-value" },
      personNodesForPersonArray(reviewManagers),
    ),
  ]);
}

/** Create nodes for arrays of authors and review managers. */
function personNodesForPersonArray(personArray) {
  const personNodes = personArray.map(function (person) {
    if (person.link.length > 0) {
      return html("a", { href: person.link, target: "_blank" }, person.name);
    }
    return document.createTextNode(person.name);
  });

  return _joinNodes(personNodes, ", ");
}

/** Tracking bugs linked in a proposal are updated via GitHub Issues. */
function renderTrackingBugs(bugs) {
  var bugNodes = bugs.map(function (bug) {
    return html("a", { href: bug.link, target: "_blank" }, bug.id);
  });

  bugNodes = _joinNodes(bugNodes, ", ");

  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, [
      bugs.length > 1 ? "Bugs: " : "Bug: ",
    ]),
    html("div", { className: "bug-list proposal-detail-value" }, bugNodes),
  ]);
}

/** Implementations are required alongside proposals (after Swift 4.0). */
function renderImplementation(implementations) {
  var implNodes = implementations.map(function (impl) {
    return html(
      "a",
      {
        href:
          GITHUB_BASE_URL +
          impl.account +
          "/" +
          impl.repository +
          "/" +
          impl.type +
          "/" +
          impl.id,
      },
      [impl.repository, impl.type === "pull" ? "#" : "@", impl.id.substr(0, 7)],
    );
  });

  implNodes = _joinNodes(implNodes, ", ");

  var label = "Implementation: ";

  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, [label]),
    html(
      "div",
      { className: "implementation-list proposal-detail-value" },
      implNodes,
    ),
  ]);
}

/** For proposals that contain an upcoming feature flag. */
function renderUpcomingFeatureFlag(upcomingFeatureFlag) {
  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, [
      "Upcoming Feature Flag: ",
    ]),
    html("div", { className: "proposal-detail-value" }, [upcomingFeatureFlag]),
  ]);
}

/** For `.previewing` proposals, link to the stdlib preview package. */
function renderPreview() {
  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, ["Preview: "]),
    html("div", { className: "proposal-detail-value" }, [
      html(
        "a",
        {
          href: "https://github.com/apple/swift-standard-library-preview",
          target: "_blank",
        },
        "Standard Library Preview",
      ),
    ]),
  ]);
}

/** For `.implemented` proposals, display the version of Swift in which they first appeared. */
function renderVersion(version) {
  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, ["Implemented In: "]),
    html("div", { className: "proposal-detail-value" }, ["Swift " + version]),
  ]);
}

/** For some proposal states like `.activeReview`, it helps to see the status in the same details list. */
function renderStatus(status) {
  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, ["Status: "]),
    html("div", { className: "proposal-detail-value" }, [
      states[status.state].name,
    ]),
  ]);
}

/**
 * Review periods are ISO-8601-style 'YYYY-MM-DD' dates.
 */
function renderReviewPeriod(status) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var start = new Date(status.start);
  var end = new Date(status.end);

  var startMonth = start.getUTCMonth();
  var endMonth = end.getUTCMonth();

  var detailNodes = [months[startMonth], " "];

  if (startMonth === endMonth) {
    detailNodes.push(
      start.getUTCDate().toString(),
      "–",
      end.getUTCDate().toString(),
    );
  } else {
    detailNodes.push(
      start.getUTCDate().toString(),
      " – ",
      months[endMonth],
      " ",
      end.getUTCDate().toString(),
    );
  }

  return html("div", { className: "proposal-detail" }, [
    html("div", { className: "proposal-detail-label" }, ["Scheduled: "]),
    html("div", { className: "proposal-detail-value" }, detailNodes),
  ]);
}

/** Utility used by some of the `render*` functions to add comma text nodes between DOM nodes. */
function _joinNodes(nodeList, text) {
  return nodeList
    .map(function (node) {
      return [node, text];
    })
    .reduce(function (result, pair, index, pairs) {
      if (index === pairs.length - 1) pair.pop();
      return result.concat(pair);
    }, []);
}

/** Adds UI interactivity to the page. Primarily activates the filtering controls. */
function addEventListeners() {
  var searchInput = document.querySelector("#search-filter");

  // Typing in the search field causes the filter to be reapplied.
  searchInput.addEventListener("input", filterProposals);

  // Each of the individual statuses needs to trigger filtering as well
  [].forEach.call(
    document.querySelectorAll(".filter-list input"),
    function (element) {
      element.addEventListener("change", filterProposals);
    },
  );

  var expandableArea = document.querySelector(".filter-options");
  var implementedToggle = document.querySelector("#filter-by-implemented");
  implementedToggle.addEventListener("change", function () {
    // hide or show the row of version options depending on the status of the 'Implemented' option
    ["#version-options", "#version-options-label"].forEach(function (selector) {
      expandableArea.querySelector(selector).classList.toggle("hidden");
    });

    // Don't persist any version selections when the row is hidden
    [].concat
      .apply([], expandableArea.querySelectorAll(".filter-by-swift-version"))
      .forEach(function (versionCheckbox) {
        versionCheckbox.checked = false;
      });

    // Update the 'Hide Filters' / 'Show Filters' / 'n Filters' text
    var allCheckedStateCheckboxes = document.querySelectorAll(
      ".filter-list input:checked",
    );
    updateStatusFilterToggleText(allCheckedStateCheckboxes.length);
  });

  document
    .querySelector("#status-filter-button")
    .addEventListener("click", toggleStatusFiltering);

  document
    .querySelector(".filter-panel-toggle")
    .addEventListener("click", toggleFilterPanel);

  document
    .querySelector("#flag-filter-button")
    .addEventListener("click", toggleFlagFiltering);

  // Behavior conditional on certain browser features
  var CSS = window.CSS;
  if (CSS) {
    // Emulate position: sticky when it isn't available.
    if (
      !(
        CSS.supports("position", "sticky") ||
        CSS.supports("position", "-webkit-sticky")
      )
    ) {
      window.addEventListener("scroll", function () {
        var breakpoint = document
          .querySelector("header")
          .getBoundingClientRect().bottom;
        var nav = document.querySelector("nav");
        var position = window.getComputedStyle(nav).position;
        var shadowNav; // maintain the main content height when the main 'nav' is removed from the flow

        // This is measuring whether or not the header has scrolled offscreen
        if (breakpoint <= 0) {
          if (position !== "fixed") {
            shadowNav = nav.cloneNode(true);
            shadowNav.classList.add("clone");
            shadowNav.style.visibility = "hidden";
            nav.parentNode.insertBefore(
              shadowNav,
              document.querySelector("main"),
            );
            nav.style.position = "fixed";
          }
        } else if (position === "fixed") {
          nav.style.position = "static";
          shadowNav = document.querySelector("nav.clone");
          if (shadowNav) shadowNav.parentNode.removeChild(shadowNav);
        }
      });
    }
  }

  // On smaller screens, hide the filter panel when scrolling
  if (window.matchMedia("(max-width: 414px)").matches) {
    window.addEventListener("scroll", function () {
      var breakpoint = document
        .querySelector("header")
        .getBoundingClientRect().bottom;
      if (
        breakpoint <= 0 &&
        document.querySelector(".expandable").classList.contains("expanded")
      ) {
        toggleFilterPanel();
      }
    });
  }
}

/**
 * Toggles whether status+version filters are active.
 * Rather than being cleared, selected filters are saved to be restored later.
 * Additionally, toggles the appearance of the "Show/Hide Filters" filter toggle link and the
 * status description subheading.
 */
function toggleStatusFiltering() {
  var statusStringHeader = document.querySelector("#status-filter-subhead");
  statusStringHeader.classList.toggle("hidden");

  var filterPanelToggle = document.querySelector(".filter-panel-toggle");
  var shouldPreserveSelection = !filterPanelToggle.classList.contains("hidden");

  filterPanelToggle.classList.toggle("hidden");
  var selected = document.querySelectorAll(
    ".filter-list input[type=checkbox]:checked",
  );
  var filterButton = document.querySelector("#status-filter-button");

  if (shouldPreserveSelection) {
    filterSelection = [].map.call(selected, function (checkbox) {
      return checkbox.id;
    });
    [].forEach.call(selected, function (checkbox) {
      checkbox.checked = false;
    });

    filterButton.setAttribute("aria-pressed", "false");
  } else {
    // restore it
    filterSelection.forEach(function (id) {
      var checkbox = document.getElementById(id);
      checkbox.checked = true;
    });

    filterButton.setAttribute("aria-pressed", "true");
  }

  document.querySelector(".expandable").classList.remove("expanded");
  filterButton.classList.toggle("active");

  filterProposals();
}

/**
 * Expands or contracts the filter panel, which contains buttons that
 * let users filter proposals based on their current stage in the
 * Swift Evolution process.
 */
function toggleFilterPanel() {
  var panel = document.querySelector(".expandable");
  var button = document.querySelector(".filter-panel-toggle");

  panel.classList.toggle("expanded");

  if (panel.classList.contains("expanded")) {
    button.setAttribute("aria-pressed", "true");
  } else {
    button.setAttribute("aria-pressed", "false");
  }

  // Update the 'Hide Filters' / 'Show Filters' / 'n Filters' text of the filter panel link
  var allCheckedStateCheckboxes = document.querySelectorAll(
    ".filter-list input:checked",
  );
  updateStatusFilterToggleText(allCheckedStateCheckboxes.length);
}

function toggleFlagFiltering() {
  var filterButton = document.querySelector("#flag-filter-button");
  var newValue = !filterButton.classList.contains("active");
  filterButton.setAttribute("aria-pressed", newValue ? "true" : "false");
  filterButton.classList.toggle("active");
  upcomingFeatureFlagFilterEnabled = newValue;

  filterProposals();
}

/**
 * Applies both the status-based and text-input based filters to the proposals list.
 */
function filterProposals() {
  var filterElement = document.querySelector("#search-filter");
  var filter = filterElement.value;

  var matchingSets = [proposals.concat()];

  // Comma-separated lists of proposal IDs are treated as an "or" search.
  if (filter.match(/(SE-\d\d\d\d)($|((,SE-\d\d\d\d)+))/i)) {
    var proposalIDs = filter.split(",").map(function (id) {
      return id.toUpperCase();
    });

    matchingSets[0] = matchingSets[0].filter(function (proposal) {
      return proposalIDs.indexOf(proposal.id) !== -1;
    });
  } else if (filter.trim().length !== 0) {
    // The search input treats words as order-independent.
    matchingSets = filter
      .split(/\s/)
      .filter(function (s) {
        return s.length > 0;
      })
      .map(function (part) {
        return _searchProposals(part);
      });
  }

  var searchMatches = matchingSets.reduce(function (intersection, candidates) {
    return intersection.filter(function (alreadyIncluded) {
      return candidates.indexOf(alreadyIncluded) !== -1;
    });
  }, matchingSets[0] || []);

  var searchAndFlagMatches = _applyFlagFilter(searchMatches);
  var fullMatches = _applyStatusFilter(searchAndFlagMatches);
  _setProposalVisibility(fullMatches);
  _updateURIFragment();

  // The per-status counts take only search string and flag filter matches into account
  determineNumberOfProposals(searchAndFlagMatches);
  updateFilterStatus();
}

/**
 * Utility used by `filterProposals`.
 *
 * Picks out various fields in a proposal which users may want to key
 * off of in their text-based filtering.
 *
 * @param {string} filterText - A raw word of text as entered by the user.
 * @returns {Proposal[]} The proposals that match the entered text, taken from the global list.
 */
function _searchProposals(filterText) {
  var filterExpression = filterText.toLowerCase();

  var searchableProperties = [
    ["id"],
    ["title"],
    ["reviewManagers", "name"],
    ["status", "state"],
    ["status", "version"],
    ["authors", "name"],
    ["authors", "link"],
    ["implementation", "account"],
    ["implementation", "repository"],
    ["implementation", "id"],
    ["trackingBugs", "link"],
    ["trackingBugs", "status"],
    ["trackingBugs", "id"],
    ["trackingBugs", "assignee"],
    ["upcomingFeatureFlag", "flag"],
  ];

  // Reflect over the proposals and find ones with matching properties
  var matchingProposals = proposals.filter(function (proposal) {
    var match = false;
    searchableProperties.forEach(function (propertyList) {
      var value = proposal;

      propertyList.forEach(function (propertyName, index) {
        if (!value) return;
        value = value[propertyName];
        if (index < propertyList.length - 1) {
          // For arrays, apply the property check to each child element.
          // Note that this only looks to a depth of one property.
          if (Array.isArray(value)) {
            var matchCondition = value.some(function (element) {
              return (
                element[propertyList[index + 1]] &&
                element[propertyList[index + 1]]
                  .toString()
                  .toLowerCase()
                  .indexOf(filterExpression) >= 0
              );
            });

            if (matchCondition) {
              match = true;
            }
          } else {
            return;
          }
        } else if (
          value &&
          value.toString().toLowerCase().indexOf(filterExpression) >= 0
        ) {
          match = true;
        }
      });
    });

    return match;
  });

  return matchingProposals;
}

/**
 * Helper for `filterProposals` that makes the upcoming feature flag filter take effect.
 *
 * @param {Proposal[]} matchingProposals - The proposals that have passed the text filtering phase.
 * @returns {Proposal[]} The results of applying the upcoming feature flag filter.
 */
function _applyFlagFilter(matchingProposals) {
  if (upcomingFeatureFlagFilterEnabled) {
    matchingProposals = matchingProposals.filter(function (proposal) {
      return proposal.upcomingFeatureFlag ? true : false;
    });
  }
  return matchingProposals;
}

/**
 * Helper for `filterProposals` that makes the status filter take effect.
 *
 * @param {Proposal[]} matchingProposals - The proposals that have passed the text and upcoming feature flag filtering phase.
 * @returns {Proposal[]} The results of applying the status filter.
 */
function _applyStatusFilter(matchingProposals) {
  // Get all checked state checkboxes, both status and version as an array
  var allCheckedStateCheckboxes = Array.from(
    document.querySelectorAll(".filter-list input:checked"),
  );

  // Get checkbox values for all checked state checkboxes, both status and version
  var selectedStates = allCheckedStateCheckboxes.map(function (checkbox) {
    return checkbox.value;
  });

  updateStatusFilterToggleText(selectedStates.length);

  // Get array of keys for only selected *statuses* to update the status filter subheading
  var selectedStatusNames = allCheckedStateCheckboxes.reduce(function (
    array,
    checkbox,
  ) {
    let value = checkbox.nextElementSibling.getAttribute("data-state-key");
    if (value) {
      array.push(value);
    }
    return array;
  }, []);

  updateStatusFilterSubheading(selectedStatusNames);

  // Use all selected states, status and version to filter out proposals based on the grouping checkboxes
  if (selectedStates.length) {
    matchingProposals = matchingProposals.filter(function (proposal) {
      return selectedStates.some(function (state) {
        return (
          proposal.status.state.toLowerCase().indexOf(state.split("-")[0]) >= 0
        );
      });
    });

    // Handle version-specific filtering options
    if (
      selectedStates.some(function (state) {
        return state.match(/swift/i);
      })
    ) {
      matchingProposals = matchingProposals.filter(function (proposal) {
        return selectedStates.some(function (state) {
          if (!(proposal.status.state === State.implemented)) return true; // only filter among Implemented (N.N.N)
          if (
            state === "swift-swift-Next" &&
            proposal.status.version === "Next"
          )
            return true; // special case

          var version = state
            .split(/\D+/)
            .filter(function (s) {
              return s.length;
            })
            .join(".");

          if (!version.length) return false; // it's not a state that represents a version number
          if (proposal.status.version === version) return true;
          return false;
        });
      });
    }
  }
  return matchingProposals;
}

/**
 * Helper for `filterProposals` that sets the visibility of proposals to display only matching items.
 *
 * @param {Proposal[]} matchingProposals - The proposals that have passed all filtering tests.
 * @returns {Void} Toggles `display: hidden` to apply the filter.
 */
function _setProposalVisibility(matchingProposals) {
  var filteredProposals = proposals.filter(function (proposal) {
    return matchingProposals.indexOf(proposal) === -1;
  });

  matchingProposals.forEach(function (proposal) {
    var matchingElements = [].concat.apply(
      [],
      document.querySelectorAll("." + proposal.id),
    );
    matchingElements.forEach(function (element) {
      element.classList.remove("hidden");
    });
  });

  filteredProposals.forEach(function (proposal) {
    var filteredElements = [].concat.apply(
      [],
      document.querySelectorAll("." + proposal.id),
    );
    filteredElements.forEach(function (element) {
      element.classList.add("hidden");
    });
  });

  updateProposalsCount(matchingProposals.length);
}

/**
 * Parses a URI fragment and applies a search and filters to the page.
 *
 * Syntax (a query string within a fragment):
 *   fragment --> `#?` parameter-value-list
 *   parameter-value-list --> parameter-value-pair | parameter-value-pair `&` parameter-value-list
 *   parameter-value-pair --> parameter `=` value
 *   parameter --> `proposal` | `status` | `version` | `upcoming` | `search`
 *   value --> ** Any URL-encoded text. **
 *
 * For example:
 *   /#?proposal=SE-0180,SE-0123
 *   /#?status=rejected&version=3&search=access
 *
 * Five types of parameters are supported:
 * - proposal: A comma-separated list of proposal IDs. Treated as an 'or' search.
 * - status: A comma-separated list of proposal statuses to apply as a filter.
 * - version: A comma-separated list of Swift version numbers to apply as a filter.
 * - upcoming: A value of 'true' to apply the Upcoming Feature Flag filter.
 * - search: Raw, URL-encoded text used to filter by individual term.
 *
 * @param {string} fragment - A URI fragment to use as the basis for a search.
 */
function _applyFragment(fragment) {
  if (!fragment || fragment.substr(0, 2) !== "#?") return;
  fragment = fragment.substring(2); // remove the #?

  // Use this literal's keys as the source of truth for key-value pairs in the fragment
  var actions = {
    proposal: [],
    search: null,
    status: [],
    version: [],
    upcoming: false,
  };

  // Parse the fragment as a query string
  Object.keys(actions).forEach(function (action) {
    var pattern = new RegExp(action + "=([^=]+)(&|$)");
    var values = fragment.match(pattern);

    if (values) {
      var value = values[1]; // 1st capture group from the RegExp
      if (action === "search") {
        value = decodeURIComponent(value);
      } else if (action === "upcoming") {
        value = value === "true";
      } else {
        value = value.split(",");
      }

      if (action === "proposal") {
        value = value.flatMap(function (id) {
          // Filter out invalid identifiers.
          const output = id.match(/^SE-([0-9]{1,4})$/i);
          if (!output) return [];

          // Insert missing leading zeros, e.g., 'SE-2' → 'SE-0002'.
          return "SE-" + output[1].padStart(4, "0");
        });
      }

      actions[action] = value;
    }
  });

  // Perform key-specific parsing and checks

  if (actions.proposal.length) {
    document.querySelector("#search-filter").value = actions.proposal.join(",");
  } else if (actions.search) {
    document.querySelector("#search-filter").value = actions.search;
  }

  let hasVersionSelections = false;
  if (actions.version.length) {
    var versionSelections = actions.version
      .map(function (version) {
        return document.querySelector(
          "#filter-by-swift-" + _idSafeName(version),
        );
      })
      .filter(function (version) {
        return !!version;
      });
    hasVersionSelections = versionSelections.length > 0;

    versionSelections.forEach(function (versionSelection) {
      versionSelection.checked = true;
    });

    if (hasVersionSelections) {
      document.querySelector(
        "#filter-by-" + states[State.implemented].className,
      ).checked = true;
    }
  }

  // Track this state specifically for toggling the version panel
  var implementedSelected = false;
  let hasStatusSelections = false;

  // Update the filter selections in the nav
  if (actions.status.length) {
    var statusSelections = actions.status
      .map(function (status) {
        var stateName = Object.keys(states).filter(function (state) {
          return states[state].className === status;
        })[0];

        if (!stateName) return; // fragment contains a nonexistent state
        var state = states[stateName];

        if (stateName === State.implemented) implementedSelected = true;

        return document.querySelector("#filter-by-" + state.className);
      })
      .filter(function (status) {
        return !!status;
      });
    hasStatusSelections = statusSelections.length > 0;

    statusSelections.forEach(function (statusSelection) {
      statusSelection.checked = true;
    });
  }

  // The version panel needs to be activated if any are specified
  if (hasVersionSelections || implementedSelected) {
    ["#version-options", "#version-options-label"].forEach(function (selector) {
      document
        .querySelector(".filter-options")
        .querySelector(selector)
        .classList.toggle("hidden");
    });
  }

  // Specifying any filter in the fragment should activate the filters in the UI
  if (hasVersionSelections || hasStatusSelections) {
    toggleFilterPanel();
    toggleStatusFiltering();
  }

  // Toggle upcoming feature flag filter if needed
  if (actions.upcoming && !upcomingFeatureFlagFilterEnabled) {
    toggleFlagFiltering();
  }

  filterProposals();
}

/**
 * Writes out the current search and filter settings to document.location
 * via window.replaceState.
 */
function _updateURIFragment() {
  var actions = { proposal: [], search: null, status: [], version: [] };

  var search = document.querySelector("#search-filter");

  if (
    search.value &&
    search.value.match(/(SE-\d\d\d\d)($|((,SE-\d\d\d\d)+))/i)
  ) {
    actions.proposal = search.value.toUpperCase().split(",");
  } else {
    actions.search = search.value;
  }

  var selectedVersions = document.querySelectorAll(
    ".filter-by-swift-version:checked",
  );
  var versions = [].map.call(selectedVersions, function (checkbox) {
    return checkbox.value.split("swift-swift-")[1].split("-").join(".");
  });

  actions.version = versions;

  var selectedStatuses = document.querySelectorAll(
    ".filtered-by-status:checked",
  );
  var statuses = [].map.call(selectedStatuses, function (checkbox) {
    var className = checkbox.value;

    var correspondingStatus = Object.keys(states).filter(function (status) {
      if (states[status].className === className) return true;
      return false;
    })[0];

    return states[correspondingStatus].className;
  });

  // .implemented is redundant if any specific implementation versions are selected.
  if (actions.version.length) {
    statuses = statuses.filter(function (status) {
      return status !== states[State.implemented].className;
    });
  }

  actions.status = statuses;

  // Build the actual fragment string.
  var fragments = [];
  if (actions.proposal.length)
    fragments.push("proposal=" + actions.proposal.join(","));
  if (actions.status.length)
    fragments.push("status=" + actions.status.join(","));
  if (actions.version.length)
    fragments.push("version=" + actions.version.join(","));
  if (upcomingFeatureFlagFilterEnabled) fragments.push("upcoming=true");

  // encoding the search lets you search for `??` and other edge cases.
  if (actions.search)
    fragments.push("search=" + encodeURIComponent(actions.search));

  if (!fragments.length) {
    window.history.replaceState(null, null, "./");
    return;
  }

  var fragment = "#?" + fragments.join("&");

  // Avoid creating new history entries each time a search or filter updates
  window.history.replaceState(null, null, fragment);
}

/** Helper to give versions like 3.0.1 an okay ID to use in a DOM element. (swift-3-0-1) */
function _idSafeName(name) {
  return "swift-" + name.replace(/\./g, "-");
}

/**
 * Updates the status filter subheading
 *
 * @param {string[]} selectedStates - each element is a key in the states objects. For example: '.accepted'.
 */
function updateStatusFilterSubheading(selectedStates) {
  var statusFilterSubheading = document.querySelector(
    "#status-filter-description",
  );
  statusFilterSubheading.innerText =
    descriptionForSelectedStatuses(selectedStates);
}

/**
 * Updates the link text of the status filter panel toggle
 *
 * @param {number} filterCount - The number of selected filters.
 */
function updateStatusFilterToggleText(filterCount) {
  var container = document.querySelector(".filter-panel-toggle");

  if (filterCount === 0) {
    var panel = document.querySelector(".expandable");
    if (panel.classList.contains("expanded")) {
      container.innerText = "Hide Filters";
    } else {
      container.innerText = "Show Filters";
    }
  } else {
    container.innerText =
      filterCount + " Filter" + (filterCount !== 1 ? "s" : "");
  }
}

/**
 * Updates the `${n} Proposals` display just above the proposals list.
 * Indicates when proposals with upcoming feature flags are shown including link
 * to explanation of what upcoming feature flags are.
 */
function updateProposalsCount(count) {
  // Calculate and set value of proposal count span
  var numberField = document.querySelector("#proposals-count-number");
  var baseString = count.toString() + " proposal" + (count !== 1 ? "s" : "");
  numberField.innerHTML = baseString;

  // Calculate and set value of flag filter description span
  var flagFilterDescription = document.querySelector(
    "#flag-filter-description",
  );
  if (upcomingFeatureFlagFilterEnabled) {
    var anchorTag = '<a href="' + UFF_INFO_URL + '">';
    var uffText = "upcoming feature flag" + (count !== 1 ? "s" : "");
    flagFilterDescription.innerHTML =
      " with " + (count !== 1 ? "" : "an ") + anchorTag + uffText + "</a>";
  } else {
    flagFilterDescription.innerHTML = "";
  }
}

function updateFilterStatus() {
  var labels = [].concat.apply(
    [],
    document.querySelectorAll("#status-options label"),
  );
  labels.forEach(function (label) {
    var count = states[label.getAttribute("data-state-key")].count;
    var cleanedLabel = cleanNumberFromState(label.innerText);
    label.innerText = addNumberToState(cleanedLabel, count);
  });
}

function cleanNumberFromState(state) {
  return state.replace(/ *\([^)]*\) */g, "");
}

function addNumberToState(state, count) {
  return state + " (" + count + ")";
}

/**
 * Generates the user-presentable description for an array of selected options.
 * To prevent listing more than five statuses, when more than five are selected
 * the generated string uses the form "All Statuses Except" followed by unselected statuses.
 *
 * @param {string[]} selectedOptions - each element is a key in the states objects. For example: '.accepted'.
 */
function descriptionForSelectedStatuses(selectedOptions) {
  let allStateOptions = [
    State.awaitingReview,
    State.scheduledForReview,
    State.activeReview,
    State.accepted,
    State.previewing,
    State.implemented,
    State.returnedForRevision,
    State.rejected,
    State.withdrawn,
  ];
  let selectedCount = selectedOptions.length;
  let totalCount = allStateOptions.length;
  let ALL_EXCEPT_MAX_COUNT = 3;
  let allExceptThreshold = totalCount - ALL_EXCEPT_MAX_COUNT;

  if (selectedCount === 0 || selectedCount === totalCount) {
    return "All Statuses";
  } else if (selectedCount >= allExceptThreshold) {
    let unselectedOptions = allStateOptions.filter(function (option) {
      return selectedOptions.indexOf(option) === -1;
    });
    return (
      "All Statuses Except " +
      listStringForStatuses(unselectedOptions, "and", false)
    );
  } else {
    return listStringForStatuses(selectedOptions, "or", true);
  }
}

/**
 * Generates a user-presentable list of statuses for an array of selected options.
 * Takes a conjunction string to join the last element for arrays of two or more elements.
 * The statusPrefix turns a status that is a noun phrase e.g. 'Active Review' into a
 * verb phrase e.g. 'In Active Review'.
 *
 * For a list of exact status names, Use false for useStatusPrefix.
 * For a list of status names that reads like a sentence, Use true for useStatusPrefix.
 *
 * @param {string[]} options - each element is a key in the states objects. For example: '.accepted'.
 * @param {string} conjunction - Used to join the last element if two or more elements are present.
 * @param {boolean} useStatusPrefix - Uses prepends statusPrefix, if defined, on the status name.
 */
function listStringForStatuses(options, conjunction, useStatusPrefix) {
  let optionNames = options.map(function (option) {
    let state = states[option];
    let prefix = useStatusPrefix ? (state.statusPrefix ?? "") : "";
    return prefix + state.shortName;
  });
  if (optionNames.length === 1) {
    return optionNames[0];
  } else {
    return (
      optionNames.slice(0, -1).join(", ") +
      " " +
      conjunction +
      " " +
      optionNames.slice(-1)[0]
    );
  }
}
