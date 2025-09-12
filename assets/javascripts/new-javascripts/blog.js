const wrapper = document.querySelector('.blogs-and-filter-wrapper')
const postsWrapper = wrapper.querySelector('.blogs-wrapper')
const postData = JSON.parse(wrapper.querySelector('#post-data').textContent)
const filters = [...wrapper.querySelectorAll('.category-filter')]
const selectAllBox = document.querySelector('.select-all')
const dropdown = document.querySelector('.dropdown')
const allCheckboxes = [selectAllBox, ...filters]
const filterMenuToggle = document.querySelector('.dropdown-toggle')

// create post links
const createAnchor = (postData) => {
  const anchor = document.createElement('a')
  anchor.href = postData.url
  anchor.classList = 'post-link'
  anchor.innerHTML = `
    <h3 class="title">${postData.title}</h3>
    <time pubdate datetime="${postData.date}" class="blog-date">${postData.date}</time>
    <p class="body-copy">${postData.excerpt}</p>
    ${postData.categories.reduce((markup, category) => {
      return markup + ` <span class="category body-copy">${category}</span>`
    }, '')}
    `
  return anchor
}

// checks all filters
const selectAllCategories = (selectAllBox, checkboxes) => {
  if (selectAllBox.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true
    })

    updatePosts(filterPosts(elementsCache, checkboxes), postsWrapper)
  }
}

const filterPosts = (elementsCache, checkboxes) => {
  // If all categories are selected, bypass filter check
  if (selectAllBox.checked) return elementsCache

  const activeFilters = checkboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
  const filteredPosts = elementsCache.filter((post) => {
    return post.data.categories.some((category) => {
      return activeFilters.includes(category)
    })
  })

  return filteredPosts
}

const updatePosts = (posts, postsWrapper) => {
  postsWrapper.innerHTML = ''
  for (let post of posts) {
    postsWrapper.appendChild(post.elemenet)
  }
}

const elementsCache = postData.map((post) => {
  return {
    data: post,
    elemenet: createAnchor(post),
  }
})

updatePosts(filterPosts(elementsCache, filters), postsWrapper, postsWrapper)

filterMenuToggle.addEventListener('click', () => {
  dropdown.classList.toggle('active')

  const isExpanded = filterMenuToggle.getAttribute('aria-expanded') === 'true'
  filterMenuToggle.toggleAttribute('aria-expanded', !isExpanded)
})

// Close the dropdown if clicked outside
window.addEventListener('click', (evt) => {
  if (!dropdown.contains(evt.target)) {
    dropdown.classList.remove('active')
    filterMenuToggle.setAttribute('aria-expanded', 'false')
  }
})

// Select all category filters
selectAllBox.addEventListener('click', () =>
  selectAllCategories(selectAllBox, filters),
)

filters.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const enabledFilters = filters.filter((checkbox) => checkbox.checked)

    if (enabledFilters.length === 1) {
      enabledFilters[0].disabled = true
    } else {
      filters.forEach((checkbox) => (checkbox.disabled = false))
    }

    // If every box is checked, select all
    if (enabledFilters.length === filters.length) {
      selectAllBox.checked = true
      selectAllBox.disabled = true
      selectAllCategories()
      return
      // Uncheck all select all if filter was unchecked
    } else if (!checkbox.checked && selectAllBox.checked) {
      selectAllBox.checked = false
      selectAllBox.disabled = false
    }

    updatePosts(filterPosts(elementsCache, filters), postsWrapper)
  })
})
