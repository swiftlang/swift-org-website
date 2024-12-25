// 这个源文件是 Swift.org 开源项目的一部分
//
// 版权所有 (c) 2014 - 2024 Apple Inc. 和 Swift 项目作者
// 根据 Apache 许可证 v2.0 和运行时库例外进行许可
//
// 请参阅 http://swift.org/LICENSE.txt 获取许可证信息
// 请参阅 http://swift.org/CONTRIBUTORS.txt 获取 Swift 项目作者列表
//
// ===---------------------------------------------------------------------===//
'use strict'

const EVOLUTION_METADATA_URL = 'https://download.swift.org/swift-evolution/v1/evolution.json'
const GITHUB_BASE_URL = 'https://github.com/'
const REPO_PROPOSALS_BASE_URL = GITHUB_BASE_URL + 'swiftlang/swift-evolution/blob/main/proposals'
const UFF_INFO_URL = '/blog/using-upcoming-feature-flags/'

/** 保存此页面上使用的主要数据：关于 Swift 进化提案的元数据。 */
let proposals

/** 已实现提案的语言版本数组。 */
let languageVersions

/** 存储用户当前选择的过滤器，当过滤器关闭时。 */
let filterSelection = []

let upcomingFeatureFlagFilterEnabled = false

/** 提案状态字符串常量 */
const State = Object.freeze({
  awaitingReview: '等待审查',
  scheduledForReview: '计划审查',
  activeReview: '积极审查',
  returnedForRevision: '返回修订',
  withdrawn: '已撤回',
  accepted: '已接受',
  acceptedWithRevisions: '已接受并修订',
  rejected: '已拒绝',
  implemented: '已实现',
  previewing: '预览中',
  error: '错误',
})

/**
 * 属性名称：提案状态字符串常量
 *
 * `name`：将提案 JSON 中的状态映射为人类可读的名称。
 *
 * `shortName`：将提案 JSON 中的状态映射为简短的人类可读名称。
 * 用于提案状态的左侧列。
 *
 * `className`：将提案 JSON 中的状态映射为用于根据其状态操作和显示提案的 CSS 类名。
 *
 * `count`：具有该状态的提案数量。在加载提案后计算。
 */
const states = {
  [State.awaitingReview]: {
    name: '等待审查',
    shortName: '等待审查',
    className: 'awaiting-review',
    count: 0
  },
  [State.scheduledForReview]: {
    name: '计划审查',
    shortName: '计划',
    className: 'scheduled-for-review',
    count: 0
  },
  [State.activeReview]: {
    name: '积极审查',
    shortName: '积极审查',
    statusPrefix: '在 ',
    className: 'active-review',
    count: 0
  },
  [State.returnedForRevision]: {
    name: '返回修订',
    shortName: '返回',
    className: 'returned-for-revision',
    count: 0
  },
  [State.withdrawn]: {
    name: '已撤回',
    shortName: '已撤回',
    className: 'withdrawn',
    count: 0
  },
  [State.accepted]: {
    name: '已接受',
    shortName: '已接受',
    className: 'accepted',
    count: 0
  },
  [State.acceptedWithRevisions]: {
    name: '已接受并修订',
    shortName: '已接受',
    className: 'accepted-with-revisions',
    count: 0
  },
  [State.rejected]: {
    name: '已拒绝',
    shortName: '已拒绝',
    className: 'rejected',
    count: 0
  },
  [State.implemented]: {
    name: '已实现',
    shortName: '已实现',
    className: 'implemented',
    count: 0
  },
  [State.previewing]: {
    name: '预览中',
    shortName: '预览中',
    className: 'previewing',
    count: 0
  },
  [State.error]: {
    name: '错误',
    shortName: '错误',
    className: 'error',
    count: 0
  }
}

init()

/** 主要入口点 */
function init() {
  var req = new window.XMLHttpRequest()

  req.addEventListener('load', function() {
    let evolutionMetadata = JSON.parse(req.responseText)
    proposals = evolutionMetadata.proposals
    languageVersions = evolutionMetadata.implementationVersions
    
    // 不显示格式错误的提案
    proposals = proposals.filter(function (proposal) {
      return !proposal.errors
    })

    // 根据提案 ID 的 SE-nnnn 中的数字进行降序排序
    proposals.sort(function compareProposalIDs (p1, p2) {
      return parseInt(p1.id.match(/\d\d\d\d/)[0]) - parseInt(p2.id.match(/\d\d\d\d/)[0])
    })
    proposals = proposals.reverse()

    render()
    addEventListeners()

    // 当页面加载时应用过滤器，通常在浏览器历史记录中向后导航时发生。
    if (document.querySelector('#search-filter').value.trim()) {
      filterProposals()
    }

    // 应用当前页面的 URI 片段中的选择
    _applyFragment(document.location.hash)
  })

  req.addEventListener('error', function (e) {
    document.querySelector('#proposals-count-number').innerText = '提案数据加载失败。'
  })

  document.querySelector('#proposals-count-number').innerHTML = '加载中…'
  req.open('get', EVOLUTION_METADATA_URL)
  req.send()
}

/**
 * 创建一个元素。`document.createElement` 的便利包装。
 *
 * @param {string} elementType - 标签名。'div'，'span' 等。
 * @param {string[]} attributes - 属性列表。使用 `className` 作为 `class`。
 * @param {(string | Element)[]} children - 要嵌套在此元素下的文本或其他元素的列表。
 * @returns {Element} 新节点。
 */
function html(elementType, attributes, children) {
  var element = document.createElement(elementType)

  if (attributes) {
    Object.keys(attributes).forEach(function (attributeName) {
      var value = attributes[attributeName]
      if (attributeName === 'className') attributeName = 'class'
      element.setAttribute(attributeName, value)
    })
  }

  if (!children) return element
  if (!Array.isArray(children)) children = [children]

  children.forEach(function (child) {
    if (!child) {
      console.warn('在创建 ' + elementType + ' 时忽略了空子节点')
      return
    }
    if (Object.getPrototypeOf(child) === String.prototype) {
      child = document.createTextNode(child)
    }

    element.appendChild(child)
  })

  return element
}

function determineNumberOfProposals(proposals) {
  // 重置计数
  Object.keys(states).forEach(function (state){
    states[state].count = 0
  })

  proposals.forEach(function (proposal) {
    states[proposal.status.state].count += 1
  })

  // .acceptedWithRevisions 提案在过滤 UI 中与 .accepted 提案合并。
  states[State.accepted].count += states[State.acceptedWithRevisions].count
}

/**
 * 将页面的动态部分添加到 DOM 中，主要是提案列表和用于过滤的状态列表。
 *
 * 这些 `render` 函数仅在页面加载时调用一次，其余交互基于切换 `display: none`。
 */
function render () {
  renderSearchBar()
  renderProposals()
}

/** 渲染搜索栏。 */
function renderSearchBar () {
  var searchBar = document.querySelector('.search-bar')

  // 此列表故意省略 .acceptedWithRevisions 和 .error；
  // .acceptedWithRevisions 提案在过滤 UI 中与 .accepted 提案合并。
  var checkboxes = [
    State.awaitingReview, State.scheduledForReview, State.activeReview, State.accepted,
    State.previewing, State.implemented, State.returnedForRevision, State.rejected, State.withdrawn
  ].map(function (state) {
    var className = states[state].className

    return html('li', null, [
      html('input', { type: 'checkbox', className: 'filtered-by-status', id: 'filter-by-' + className, value: className }),
      html('label', { className: className, tabindex: '0', role: 'button', 'for': 'filter-by-' + className, 'data-state-key': state }, [
        addNumberToState(states[state].name, states[state].count)
      ])
    ])
  })

  var expandableArea = html('div', { className: 'filter-options expandable' }, [
    html('h5', { id: 'filter-options-label' }, '状态'),
    html('ul', { id: 'status-options', className: 'filter-list' })
  ])

  searchBar.appendChild(expandableArea)

  checkboxes.forEach(function (box) {
    searchBar.querySelector('.filter-list').appendChild(box)
  })

  // 如果选择了“已实现”过滤器选择，则会添加额外的选项行。
  var implementedCheckboxIfPresent = checkboxes.filter(function (cb) {
    return cb.querySelector(`#filter-by-${states[State.implemented].className}`)
  })[0]

  if (implementedCheckboxIfPresent) {
    // 添加额外的选项行以按语言版本过滤
    var versionRowHeader = html('h5', { id: 'version-options-label', className: 'hidden' }, 'Swift 版本')
    var versionRow = html('ul', { id: 'version-options', className: 'filter-list hidden' })

    var versionOptions = languageVersions.map(function (version) {
      return html('li', null, [
        html('input', {
          type: 'checkbox',
          id: 'filter-by-swift-' + _idSafeName(version),
          className: 'filter-by-swift-version',
          value: 'swift-' + _idSafeName(version)
        }),
        html('label', {
          tabindex: '0',
          role: 'button',
          'for': 'filter-by-swift-' + _idSafeName(version)
        }, version)
      ])
    })

    versionOptions.forEach(function (version) {
      versionRow.appendChild(version)
    })

    expandableArea.appendChild(versionRowHeader)
    expandableArea.appendChild(versionRow)
  }

  return searchBar
}

/** 显示提案的主要列表 */
function renderProposals() {
  var article = document.querySelector('article')

  var proposalAttachPoint = article.querySelector('.proposals-list')

  var proposalPresentationOrder = [
    State.awaitingReview, State.scheduledForReview, State.activeReview, State.accepted, State.acceptedWithRevisions,
    State.previewing, State.implemented, State.returnedForRevision, State.rejected, State.withdrawn
  ]

  proposalPresentationOrder.map(function (state) {
    var matchingProposals = proposals.filter(function (p) { return p.status && p.status.state === state })
    matchingProposals.map(function (proposal) {
      var proposalBody = html(
        "section",
        { id: proposal.id, className: "proposal " + proposal.id },
        [
          html("div", { className: "status-pill-container" }, [
            html(
              "span",
              { className: "status-pill color-" + states[state].className },
              [states[proposal.status.state].shortName]
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
                [proposal.title.trim()]
              ),
            ]),
          ]),
        ]
      );

      var detailNodes = []
      detailNodes.push(renderAuthors(proposal.authors))

      if (proposal.reviewManagers.length > 0) detailNodes.push(renderReviewManagers(proposal.reviewManagers))
      if (proposal.trackingBugs) detailNodes.push(renderTrackingBugs(proposal.trackingBugs))
      if (state === State.implemented) detailNodes.push(renderVersion(proposal.status.version))
      if (state === State.previewing) detailNodes.push(renderPreview())
      if (proposal.implementation) detailNodes.push(renderImplementation(proposal.implementation))
      if (proposal.upcomingFeatureFlag) detailNodes.push(renderUpcomingFeatureFlag(proposal.upcomingFeatureFlag.flag))
      if (state === State.acceptedWithRevisions) detailNodes.push(renderStatus(proposal.status))

      if (state === State.activeReview || state === State.scheduledForReview) {
        detailNodes.push(renderStatus(proposal.status))
        detailNodes.push(renderReviewPeriod(proposal.status))
      }

      if (state === State.returnedForRevision) {
        detailNodes.push(renderStatus(proposal.status))
      }

      var details = html('div', { className: 'proposal-details' }, detailNodes)

      proposalBody.querySelector('.proposal-content').appendChild(details)
      proposalAttachPoint.appendChild(proposalBody)
    })
  })

  // 更新“(n) 提案”文本
  updateProposalsCount(article.querySelectorAll('.proposal').length)

  return article
}

/** 作者有一个 `name` 和可选的 `link`。 */
function renderAuthors(authors) {
  return html('div', { className: 'authors proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' },
      authors.length > 1 ? '作者：' : '作者：'
    ),
    html('div', { className: 'proposal-detail-value' },
      personNodesForPersonArray(authors))
  ])
}

/** 审查经理有一个 `name` 和可选的 `link`。 */
function renderReviewManagers(reviewManagers) {
  return html('div', { className: 'review-managers proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' },
      reviewManagers.length > 1 ? '审查经理：' : '审查经理：'
    ),
    html('div', { className: 'proposal-detail-value' }, 
      personNodesForPersonArray(reviewManagers))
  ])
}

/** 为作者和审查经理数组创建节点。 */
function personNodesForPersonArray(personArray) {
  const personNodes = personArray.map(function (person) {
    if (person.link.length > 0) {
      return html('a', { href: person.link, target: '_blank' }, person.name)
    }
    return document.createTextNode(person.name)
  })
  
  return _joinNodes(personNodes, ', ')
}

/** 提案中链接的跟踪错误通过 GitHub 问题更新。 */
function renderTrackingBugs(bugs) {
  var bugNodes = bugs.map(function (bug) {
    return html('a', { href: bug.link, target: '_blank' }, bug.id)
  })

  bugNodes = _joinNodes(bugNodes, ', ')

  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [
      bugs.length > 1 ? '错误：' : '错误：'
    ]),
    html('div', { className: 'bug-list proposal-detail-value' },
      bugNodes
    )
  ])
}

/** 实现是提案所需的（在 Swift 4.0 之后）。 */
function renderImplementation(implementations) {
  var implNodes = implementations.map(function (impl) {
    return html('a', {
      href: GITHUB_BASE_URL + impl.account + '/' + impl.repository + '/' + impl.type + '/' + impl.id
    }, [
      impl.repository,
      impl.type === 'pull' ? '#' : '@',
      impl.id.substr(0, 7)
    ])
  })

  implNodes = _joinNodes(implNodes, ', ')

  var label = '实现：'

  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [label]),
    html('div', { className: 'implementation-list proposal-detail-value' },
      implNodes
    )
  ])
}

/** 对于包含即将推出的功能标志的提案。 */
function renderUpcomingFeatureFlag(upcomingFeatureFlag) {
  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [
      '即将推出的功能标志：'
    ]),
    html('div', { className: 'proposal-detail-value' }, [
      upcomingFeatureFlag
    ])
  ])
}

/** 对于 `.previewing` 提案，链接到 stdlib 预览包。 */
function renderPreview() {
  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [
      '预览：'
    ]),
    html('div', { className: 'proposal-detail-value' }, [
      html('a', { href: 'https://github.com/apple/swift-standard-library-preview', target: '_blank' },
        '标准库预览'
      )
    ])
  ])
}

/** 对于 `.implemented` 提案，显示它们首次出现的 Swift 版本。 */
function renderVersion(version) {
  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [
      '实现于：'
    ]),
    html('div', { className: 'proposal-detail-value' }, [
      'Swift ' + version
    ])
  ])
}

/** 对于某些提案状态，如 `.activeReview`，查看状态在同一详细信息列表中是有帮助的。 */
function renderStatus (status) {
  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [
      '状态：'
    ]),
    html('div', { className: 'proposal-detail-value' }, [
      states[status.state].name
    ])
  ])
}

/**
 * 审查期为 ISO-8601 风格的 'YYYY-MM-DD' 日期。
 */
function renderReviewPeriod (status) {
  var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月',
    '八月', '九月', '十月', '十一月', '十二月'
  ]

  var start = new Date(status.start)
  var end = new Date(status.end)

  var startMonth = start.getUTCMonth()
  var endMonth = end.getUTCMonth()

  var detailNodes = [months[startMonth], ' ']

  if (startMonth === endMonth) {
    detailNodes.push(
      start.getUTCDate().toString(),
      '–',
      end.getUTCDate().toString()
    )
  } else {
    detailNodes.push(
      start.getUTCDate().toString(),
      ' – ',
      months[endMonth],
      ' ',
      end.getUTCDate().toString()
    )
  }

  return html('div', { className: 'proposal-detail' }, [
    html('div', { className: 'proposal-detail-label' }, [
      '计划：'
    ]),
    html('div', { className: 'proposal-detail-value' }, detailNodes)
  ])
}

/** 一些 `render*` 函数使用的实用程序，用于在 DOM 节点之间添加逗号文本节点。 */
function _joinNodes (nodeList, text) {
  return nodeList.map(function (node) {
    return [node, text]
  }).reduce(function (result, pair, index, pairs) {
    if (index === pairs.length - 1) pair.pop()
    return result.concat(pair)
  }, [])
}

/** 为页面添加 UI 交互性。主要激活过滤控件。 */
function addEventListeners() {
  var searchInput = document.querySelector('#search-filter')

  // 在搜索字段中输入时会重新应用过滤器。
  searchInput.addEventListener('input', filterProposals)

  // 每个单独的状态也需要触发过滤。
  ;[].forEach.call(document.querySelectorAll('.filter-list input'), function (element) {
    element.addEventListener('change', filterProposals)
  })

  var expandableArea = document.querySelector('.filter-options')
  var implementedToggle = document.querySelector('#filter-by-implemented')
  implementedToggle.addEventListener('change', function () {
    // 根据“已实现”选项的状态隐藏或显示版本选项行
    ;['#version-options', '#version-options-label'].forEach(function (selector) {
      expandableArea.querySelector(selector).classList.toggle('hidden')
    })

    // 当行隐藏时，不保留任何版本选择
    ;[].concat.apply([], expandableArea.querySelectorAll('.filter-by-swift-version')).forEach(function (versionCheckbox) {
      versionCheckbox.checked = false
    })
    
    // 更新“隐藏过滤器”/“显示过滤器”/“n 个过滤器”文本
    var allCheckedStateCheckboxes = document.querySelectorAll('.filter-list input:checked')
    updateStatusFilterToggleText(allCheckedStateCheckboxes.length)
  })

  document.querySelector('#status-filter-button').addEventListener('click', toggleStatusFiltering)

  document.querySelector('.filter-panel-toggle').addEventListener('click', toggleFilterPanel)
  
  document.querySelector('#flag-filter-button').addEventListener('click', toggleFlagFiltering)

  // 根据某些浏览器功能的行为
  var CSS = window.CSS
  if (CSS) {
    // 当不支持时模拟 position: sticky。
    if (!(CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky'))) {
      window.addEventListener('scroll', function () {
        var breakpoint = document.querySelector('header').getBoundingClientRect().bottom
        var nav = document.querySelector('nav')
        var position = window.getComputedStyle(nav).position
        var shadowNav // 在主 'nav' 从流中移除时保持主内容高度

        // 这在测量头部是否已滚动出屏幕
        if (breakpoint <= 0) {
          if (position !== 'fixed') {
            shadowNav = nav.cloneNode(true)
            shadowNav.classList.add('clone')
            shadowNav.style.visibility = 'hidden'
            nav.parentNode.insertBefore(shadowNav, document.querySelector('main'))
            nav.style.position = 'fixed'
          }
        } else if (position === 'fixed') {
          nav.style.position = 'static'
          shadowNav = document.querySelector('nav.clone')
          if (shadowNav) shadowNav.parentNode.removeChild(shadowNav)
        }
      })
    }
  }

  // 在较小的屏幕上，向下滚动时隐藏过滤面板
  if (window.matchMedia('(max-width: 414px)').matches) {
    window.addEventListener('scroll', function () {
      var breakpoint = document.querySelector('header').getBoundingClientRect().bottom
      if (breakpoint <= 0 && document.querySelector('.expandable').classList.contains('expanded')) {
        toggleFilterPanel()
      }
    })
  }
}

/**
 * 切换状态+版本过滤器是否处于活动状态。
 * 选定的过滤器不会被清除，而是保存以便稍后恢复。
 * 此外，切换“显示/隐藏过滤器”过滤器切换链接和状态描述子标题的外观。
 */
function toggleStatusFiltering() {
  var statusStringHeader = document.querySelector('#status-filter-subhead')
  statusStringHeader.classList.toggle('hidden')

  var filterPanelToggle = document.querySelector('.filter-panel-toggle')
  var shouldPreserveSelection = !filterPanelToggle.classList.contains('hidden')

  filterPanelToggle.classList.toggle('hidden')
  var selected = document.querySelectorAll('.filter-list input[type=checkbox]:checked')
  var filterButton = document.querySelector('#status-filter-button')

  if (shouldPreserveSelection) {
    filterSelection = [].map.call(selected, function (checkbox) { return checkbox.id })
    ;[].forEach.call(selected, function (checkbox) { checkbox.checked = false })

    filterButton.setAttribute('aria-pressed', 'false')
  } else { // 恢复它
    filterSelection.forEach(function (id) {
      var checkbox = document.getElementById(id)
      checkbox.checked = true
    })

    filterButton.setAttribute('aria-pressed', 'true')
  }

  document.querySelector('.expandable').classList.remove('expanded')
  filterButton.classList.toggle('active')

  filterProposals()
}

/**
 * 展开或收缩过滤面板，该面板包含允许用户根据其在 Swift 进化过程中的当前阶段过滤提案的按钮。
 */
function toggleFilterPanel() {
  var panel = document.querySelector('.expandable')
  var button = document.querySelector('.filter-panel-toggle')

  panel.classList.toggle('expanded')

  if (panel.classList.contains('expanded')) {
    button.setAttribute('aria-pressed', 'true')
  } else {
    button.setAttribute('aria-pressed', 'false')
  }
  
  // 更新过滤面板链接的“隐藏过滤器”/“显示过滤器”/“n 个过滤器”文本
  var allCheckedStateCheckboxes = document.querySelectorAll('.filter-list input:checked')
  updateStatusFilterToggleText(allCheckedStateCheckboxes.length)

}

function toggleFlagFiltering() {
  var filterButton = document.querySelector('#flag-filter-button')
  var newValue = !filterButton.classList.contains('active')
  filterButton.setAttribute('aria-pressed', newValue ? 'true' : 'false')
  filterButton.classList.toggle('active')
  upcomingFeatureFlagFilterEnabled = newValue
  
  filterProposals()
}

/**
 * 将基于状态和基于文本输入的过滤器应用于提案列表。
 */
function filterProposals() {
  var filterElement = document.querySelector('#search-filter')
  var filter = filterElement.value

  var matchingSets = [proposals.concat()]

  // 逗号分隔的提案 ID 列表被视为“或”搜索。
  if (filter.match(/(SE-\d\d\d\d)($|((,SE-\d\d\d\d)+))/i)) {
    var proposalIDs = filter.split(',').map(function (id) {
      return id.toUpperCase()
    })

    matchingSets[0] = matchingSets[0].filter(function (proposal) {
      return proposalIDs.indexOf(proposal.id) !== -1
    })
  } else if (filter.trim().length !== 0) {
    // 搜索输入将单词视为无序。
    matchingSets = filter.split(/\s/)
      .filter(function (s) { return s.length > 0 })
      .map(function (part) { return _searchProposals(part) })
  }

  var searchMatches = matchingSets.reduce(function (intersection, candidates) {
    return intersection.filter(function (alreadyIncluded) { return candidates.indexOf(alreadyIncluded) !== -1 })
  }, matchingSets[0] || [])
  
  var searchAndFlagMatches = _applyFlagFilter(searchMatches)
  var fullMatches = _applyStatusFilter(searchAndFlagMatches)
  _setProposalVisibility(fullMatches)
  _updateURIFragment()

 // 每个状态的计数仅考虑搜索字符串和标志过滤匹配
  determineNumberOfProposals(searchAndFlagMatches)
  updateFilterStatus()
}

/**
 * `filterProposals` 使用的实用程序。
 *
 * 挑选出提案中用户可能希望根据其文本过滤的各种字段。
 *
 * @param {string} filterText - 用户输入的原始文本。
 * @returns {Proposal[]} 匹配输入文本的提案，来自全局列表。
 */
function _searchProposals(filterText) {
  var filterExpression = filterText.toLowerCase()

  var searchableProperties = [
      ['id'],
      ['title'],
      ['reviewManagers', 'name'],
      ['status', 'state'],
      ['status', 'version'],
      ['authors', 'name'],
      ['authors', 'link'],
      ['implementation', 'account'],
      ['implementation', 'repository'],
      ['implementation', 'id'],
      ['trackingBugs', 'link'],
      ['trackingBugs', 'status'],
      ['trackingBugs', 'id'],
      ['trackingBugs', 'assignee'],
      ['upcomingFeatureFlag', 'flag']
  ]

  // 反映提案并找到具有匹配属性的提案
  var matchingProposals = proposals.filter(function (proposal) {
    var match = false
    searchableProperties.forEach(function (propertyList) {
      var value = proposal

      propertyList.forEach(function (propertyName, index) {
        if (!value) return
        value = value[propertyName]
        if (index < propertyList.length - 1) {
          // 对于数组，将属性检查应用于每个子元素。
          // 请注意，这仅查找一层属性。
          if (Array.isArray(value)) {
            var matchCondition = value.some(function (element) {
              return element[propertyList[index + 1]] && element[propertyList[index + 1]].toString().toLowerCase().indexOf(filterExpression) >= 0
            })

            if (matchCondition) {
              match = true
            }
          } else {
            return
          }
        } else if (value && value.toString().toLowerCase().indexOf(filterExpression) >= 0) {
          match = true
        }
      })
    })

    return match
  })

  return matchingProposals
}

/**
 * `filterProposals` 的助手，使即将推出的功能标志过滤器生效。
 *
 * @param {Proposal[]} matchingProposals - 通过文本过滤阶段的提案。
 * @returns {Proposal[]} 应用即将推出的功能标志过滤的结果。
 */
function _applyFlagFilter(matchingProposals) {
  if (upcomingFeatureFlagFilterEnabled) {
    matchingProposals = matchingProposals.filter(function (proposal) {
      return proposal.upcomingFeatureFlag ? true : false
    })
  }
  return matchingProposals
}

/**
 * `filterProposals` 的助手，使状态过滤器生效。
 *
 * @param {Proposal[]} matchingProposals - 通过文本和即将推出的功能标志过滤阶段的提案。
 * @returns {Proposal[]} 应用状态过滤的结果。
 */
function _applyStatusFilter(matchingProposals) {
  // 获取所有选中的状态复选框，状态和版本作为数组
  var allCheckedStateCheckboxes = Array.from(document.querySelectorAll('.filter-list input:checked'))
  
  // 获取所有选中状态复选框的值，状态和版本
  var selectedStates = allCheckedStateCheckboxes.map(function (checkbox) { return checkbox.value })

  updateStatusFilterToggleText(selectedStates.length)

  // 获取仅选中状态的键数组，以更新状态过滤子标题
  var selectedStatusNames = allCheckedStateCheckboxes.reduce(function(array, checkbox) {
    let value = checkbox.nextElementSibling.getAttribute("data-state-key")
    if (value) { array.push(value) }
    return array
  }, [])

  updateStatusFilterSubheading(selectedStatusNames)

  // 使用所有选中的状态，状态和版本根据分组复选框过滤提案
  if (selectedStates.length) {
    matchingProposals = matchingProposals
      .filter(function (proposal) {
        return selectedStates.some(function (state) {
          return proposal.status.state.toLowerCase().indexOf(state.split('-')[0]) >= 0
        })
      })

    // 处理特定版本的过滤选项
    if (selectedStates.some(function (state) { return state.match(/swift/i) })) {
      matchingProposals = matchingProposals
        .filter(function (proposal) {
          return selectedStates.some(function (state) {
            if (!(proposal.status.state === State.implemented)) return true // 仅在已实现（N.N.N）中过滤
            if (state === 'swift-swift-Next' && proposal.status.version === 'Next') return true // 特殊情况

            var version = state.split(/\D+/).filter(function (s) { return s.length }).join('.')

            if (!version.length) return false // 这不是表示版本号的状态
            if (proposal.status.version === version) return true
            return false
          })
        })
    }
  }
  return matchingProposals
}

/**
 * `filterProposals` 的助手，设置提案的可见性以仅显示匹配项。
 *
 * @param {Proposal[]} matchingProposals - 通过所有过滤测试的提案。
 * @returns {Void} 切换 `display: hidden` 以应用过滤器。
 */
function _setProposalVisibility(matchingProposals) {
  var filteredProposals = proposals.filter(function (proposal) {
    return matchingProposals.indexOf(proposal) === -1
  })

  matchingProposals.forEach(function (proposal) {
    var matchingElements = [].concat.apply([], document.querySelectorAll('.' + proposal.id))
    matchingElements.forEach(function (element) { element.classList.remove('hidden') })
  })

  filteredProposals.forEach(function (proposal) {
    var filteredElements = [].concat.apply([], document.querySelectorAll('.' + proposal.id))
    filteredElements.forEach(function (element) { element.classList.add('hidden') })
  })

  updateProposalsCount(matchingProposals.length)
}

/**
 * 解析 URI 片段并将搜索和过滤应用于页面。
 *
 * 语法（片段中的查询字符串）：
 *   fragment --> `#?` 参数值列表
 *   parameter-value-list --> 参数值对 | 参数值对 `&` 参数值列表
 *   parameter-value-pair --> 参数 `=` 值
 *   parameter --> `proposal` | `status` | `version` | `upcoming` | `search`
 *   value --> ** 任何 URL 编码文本。 **
 *
 * 例如：
 *   /#?proposal=SE-0180,SE-0123
 *   /#?status=rejected&version=3&search=access
 *
 * 支持五种类型的参数：
 * - proposal: 逗号分隔的提案 ID 列表。视为“或”搜索。
 * - status: 逗号分隔的提案状态列表，作为过滤器应用。
 * - version: 逗号分隔的 Swift 版本号列表，作为过滤器应用。
 * - upcoming: 值为 'true' 以应用即将推出的功能标志过滤。
 * - search: 原始的、 URL 编码的文本，用于按单个术语过滤。
 *
 * @param {string} fragment - 用作搜索基础的 URI 片段。
 */
function _applyFragment(fragment) {
  if (!fragment || fragment.substr(0, 2) !== '#?') return
  fragment = fragment.substring(2) // 移除 #?

  // 使用此字面量的键作为片段中键值对的真实来源
  var actions = { proposal: [], search: null, status: [], version: [], upcoming: false }

  // 将片段解析为查询字符串
  Object.keys(actions).forEach(function (action) {
    var pattern = new RegExp(action + '=([^=]+)(&|$)')
    var values = fragment.match(pattern)

    if (values) {
      var value = values[1] // 正则表达式的第一个捕获组
      if (action === 'search') {
        value = decodeURIComponent(value)
      } else if (action === 'upcoming') {
        value = value === 'true'
      } else {
        value = value.split(',')
      }

      if (action === 'proposal') {
        value = value.flatMap(function (id) {
          // 过滤掉无效标识符。
          const output = id.match(/^SE-([0-9]{1,4})$/i)
          if (!output) return []

          // 插入缺失的前导零，例如 'SE-2' → 'SE-0002'。
          return 'SE-' + output[1].padStart(4, '0')
        })
      }

      actions[action] = value
    }
  })

  // 执行特定键的解析和检查

  if (actions.proposal.length) {
    document.querySelector('#search-filter').value = actions.proposal.join(',')
  } else if (actions.search) {
    document.querySelector('#search-filter').value = actions.search
  }

  let hasVersionSelections = false
  if (actions.version.length) {
    var versionSelections = actions.version.map(function (version) {
      return document.querySelector('#filter-by-swift-' + _idSafeName(version))
    }).filter(function (version) {
      return !!version
    })
    hasVersionSelections = versionSelections.length > 0

    versionSelections.forEach(function (versionSelection) {
      versionSelection.checked = true
    })

    if (hasVersionSelections) {
      document.querySelector(
        '#filter-by-' + states[State.implemented].className
      ).checked = true
    }
  }

  // 特别跟踪此状态以激活版本面板
  var implementedSelected = false
  let hasStatusSelections = false

  // 更新导航中的过滤器选择
  if (actions.status.length) {
    var statusSelections = actions.status.map(function (status) {
      var stateName = Object.keys(states).filter(function (state) {
        return states[state].className === status
      })[0]

      if (!stateName) return // 片段包含一个不存在的状态
      var state = states[stateName]

      if (stateName === State.implemented) implementedSelected = true

      return document.querySelector('#filter-by-' + state.className)
    }).filter(function (status) {
      return !!status
    })
    hasStatusSelections = statusSelections.length > 0

    statusSelections.forEach(function (statusSelection) {
      statusSelection.checked = true
    })
  }

  // 如果指定了任何版本，则需要激活版本面板
  if (hasVersionSelections || implementedSelected) {
    ;['#version-options', '#version-options-label'].forEach(function (selector) {
      document.querySelector('.filter-options')
        .querySelector(selector).classList
        .toggle('hidden')
    })
  }

  // 在片段中指定任何过滤器应激活 UI 中的过滤器
  if (hasVersionSelections || hasStatusSelections) {
    toggleFilterPanel()
    toggleStatusFiltering()
  }
  
  // 如果需要，切换即将推出的功能标志过滤
  if (actions.upcoming && !upcomingFeatureFlagFilterEnabled) {
    toggleFlagFiltering()
  }

  filterProposals()
}

/**
 * 将当前搜索和过滤设置写入 document.location
 * 通过 window.replaceState。
 */
function _updateURIFragment() {
  var actions = { proposal: [], search: null, status: [], version: [] }

  var search = document.querySelector('#search-filter')

  if (search.value && search.value.match(/(SE-\d\d\d\d)($|((,SE-\d\d\d\d)+))/i)) {
    actions.proposal = search.value.toUpperCase().split(',')
  } else {
    actions.search = search.value
  }

  var selectedVersions = document.querySelectorAll('.filter-by-swift-version:checked')
  var versions = [].map.call(selectedVersions, function (checkbox) {
    return checkbox.value.split('swift-swift-')[1].split('-').join('.')
  })

  actions.version = versions

  var selectedStatuses = document.querySelectorAll('.filtered-by-status:checked')
  var statuses = [].map.call(selectedStatuses, function (checkbox) {
    var className = checkbox.value

    var correspondingStatus = Object.keys(states).filter(function (status) {
      if (states[status].className === className) return true
      return false
    })[0]

    return states[correspondingStatus].className
  })

  // 如果选择了任何特定实现版本，则 .implemented 是多余的。
  if (actions.version.length) {
    statuses = statuses.filter(function (status) {
      return status !== states[State.implemented].className
    })
  }

  actions.status = statuses

  // 构建实际的片段字符串。
  var fragments = []
  if (actions.proposal.length) fragments.push('proposal=' + actions.proposal.join(','))
  if (actions.status.length) fragments.push('status=' + actions.status.join(','))
  if (actions.version.length) fragments.push('version=' + actions.version.join(','))
  if (upcomingFeatureFlagFilterEnabled) fragments.push('upcoming=true')

  // 编码搜索让您可以搜索 `??` 和其他边缘情况。
  if (actions.search) fragments.push('search=' + encodeURIComponent(actions.search))

  if (!fragments.length) {
    window.history.replaceState(null, null, './')
    return
  }

  var fragment = '#?' + fragments.join('&')

  // 避免在每次搜索或过滤器更新时创建新的历史条目
  window.history.replaceState(null, null, fragment)
}

/** 帮助将版本如 3.0.1 转换为可在 DOM 元素中使用的 ID（swift-3-0-1） */
function _idSafeName (name) {
  return 'swift-' + name.replace(/\./g, '-')
}

/**
  * 更新状态过滤子标题
  *
  * @param {string[]} selectedStates - 每个元素是状态对象中的一个键。例如：'.accepted'。
  */
function updateStatusFilterSubheading(selectedStates) {
  var statusFilterSubheading = document.querySelector('#status-filter-description')
  statusFilterSubheading.innerText = descriptionForSelectedStatuses(selectedStates)
}

/**
* 更新状态过滤面板切换的链接文本
*
* @param {number} filterCount - 选定过滤器的数量。
*/
function updateStatusFilterToggleText(filterCount) {
  var container = document.querySelector('.filter-panel-toggle')

  if (filterCount === 0) {
    var panel = document.querySelector('.expandable')
    if (panel.classList.contains('expanded')) {
      container.innerText = '隐藏过滤器'
    } else {
      container.innerText = '显示过滤器'
    }
  } else {
    container.innerText = filterCount + ' 个过滤器' + ((filterCount !== 1) ? 's' : '')
  }
}

/** 
 * 更新提案列表上方的 `${n} 提案` 显示。
 * 指示显示即将推出的功能标志的提案，包括链接
 * 到即将推出的功能标志的说明。
 */
function updateProposalsCount (count) {
  // 计算并设置提案计数 span 的值
  var numberField = document.querySelector('#proposals-count-number')
  var baseString = (count.toString() + ' 提案' + (count !== 1 ? 's' : ''))
  numberField.innerHTML = baseString

  // 计算并设置标志过滤描述 span 的值
  var flagFilterDescription = document.querySelector('#flag-filter-description')
  if (upcomingFeatureFlagFilterEnabled) {
    var anchorTag = '<a href="' + UFF_INFO_URL + '">'
    var uffText = '即将推出的功能标志' + (count !== 1 ? 's' : '')
    flagFilterDescription.innerHTML = "与 "+ (count !== 1 ? '' : '一个 ') + anchorTag + uffText + '</a>'
  } else {
    flagFilterDescription.innerHTML = ""
  }
}

function updateFilterStatus () {
  var labels = [].concat.apply([], document.querySelectorAll('#status-options label'))
  labels.forEach(function (label) {
    var count = states[label.getAttribute('data-state-key')].count
    var cleanedLabel = cleanNumberFromState(label.innerText)
    label.innerText = addNumberToState(cleanedLabel, count)
  })
}

function cleanNumberFromState (state) {
  return state.replace(/ *\([^)]*\) */g, '')
}

function addNumberToState (state, count) {
  return state + ' (' + count + ')'
}

/**
* 生成用户可呈现的选定选项数组的描述。 
* 为了防止列出超过五个状态，当选择超过五个时
* 生成的字符串使用“所有状态，除了”后跟未选中的状态。
*
* @param {string[]} selectedOptions - 每个元素是状态对象中的一个键。例如：'.accepted'。
*/
function descriptionForSelectedStatuses(selectedOptions) {
  let allStateOptions = [
    State.awaitingReview, State.scheduledForReview, State.activeReview, State.accepted,
    State.previewing, State.implemented, State.returnedForRevision, State.rejected, State.withdrawn
  ]
  let selectedCount = selectedOptions.length
  let totalCount = allStateOptions.length
  let ALL_EXCEPT_MAX_COUNT = 3
  let allExceptThreshold = totalCount - ALL_EXCEPT_MAX_COUNT

  if (selectedCount === 0 || selectedCount === totalCount) {
    return "所有状态"
  } else if (selectedCount >= allExceptThreshold) {
    let unselectedOptions = allStateOptions.filter(function (option) {
      return selectedOptions.indexOf(option) === -1
    })
    return "所有状态，除了 " + listStringForStatuses(unselectedOptions, "和", false)
  } else {
    return listStringForStatuses(selectedOptions, "或", true)
  }
}

/**
* 生成用户可呈现的状态列表，供选定选项数组使用。 
* 使用一个连接字符串来连接最后一个元素，如果数组中有两个或更多元素。
* statusPrefix 将状态从名词短语（例如 '积极审查'）转换为
* 动词短语（例如 '在积极审查中'）。
*
* 对于确切状态名称的列表，使用 false 作为 useStatusPrefix。
* 对于像句子一样读取的状态名称列表，使用 true 作为 useStatusPrefix。 
*
* @param {string[]} options - 每个元素是状态对象中的一个键。例如：'.accepted'。
* @param {string} conjunction - 用于连接最后一个元素，如果有两个或更多元素。
* @param {boolean} useStatusPrefix - 如果定义，则在状态名称前添加前缀。
*/
function listStringForStatuses(options, conjunction, useStatusPrefix) {
  let optionNames = options.map( function (option) {
    let state = states[option]
    let prefix = useStatusPrefix ? (state.statusPrefix ?? '') : ''
     return prefix + state.shortName
  })
  if (optionNames.length === 1){
    return optionNames[0]
  } else {
    return optionNames.slice(0, -1).join(", ") + " " + conjunction + " " + optionNames.slice(-1)[0]
  }
}
