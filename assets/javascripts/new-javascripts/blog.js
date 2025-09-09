const wrapper = document.querySelector('.blogs-and-filter-wrapper')
const postsWrapper = wrapper.querySelector('.blogs-wrapper')
const postData = JSON.parse(wrapper.querySelector('#post-data').textContent)
const checkboxes = [...wrapper.querySelectorAll('.category-filter')]
const selectAllBox = document.querySelector('.select-all')
const dropdown = document.querySelector('.dropdown')
const allCheckboxes = [selectAllBox, ...checkboxes]
const filterMenuToggle = document.querySelector('.dropdown-toggle')
const dropdownCloseButton = document.querySelector('.dropdown-close')
// create post links
const createAnchor = (postData) => {
  const anchor = document.createElement('a')
  const imgEl = postData['image-url']
    ? `<img src="${postData['image-url']}" alt="${postData['image-alt']}" />`
    : ''
  anchor.href = postData.url
  anchor.classList = imgEl ? 'post-link post-link-with-image' : 'post-link'
  anchor.innerHTML = `
  ${imgEl}
  ${imgEl ? '<div>' : ''}
    <h3 class="title">${postData.title}</h3>
    <time pubdate datetime="${postData.date}" class="blog-date">${postData.date}</time>
    <p class="body-copy">${postData.excerpt}</p>
    ${postData.categories.reduce((markup, category) => {
      return markup + ` <span class="category body-copy">${category}</span>`
    }, '')}
  ${imgEl ? '</div>' : ''}
    `
  return anchor
}

// checks all filters
const selectAllCategories = () => {
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

updatePosts(filterPosts(elementsCache, checkboxes), postsWrapper, postsWrapper)

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
selectAllBox.addEventListener('click', selectAllCategories)

dropdownCloseButton.addEventListener('click', () => {
  dropdown.classList.remove('active')
  document
    .querySelector('.dropdown-toggle')
    .setAttribute('aria-expanded', 'false')
})

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    // If every box is either checked or none are, set all filter to checked
    if (
      checkboxes.every((checkbox) => checkbox.checked === checkboxes[0].checked)
    ) {
      selectAllBox.checked = true
      selectAllCategories()
      return
    } else if (!checkbox.checked && selectAllBox.checked) {
      selectAllBox.checked = false
    }
    updatePosts(filterPosts(elementsCache, checkboxes), postsWrapper)
  })
})
