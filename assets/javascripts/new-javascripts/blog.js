const wrapper = document.querySelector('.blogs-and-filter-wrapper')
const postsWrapper = wrapper.querySelector('.blogs-wrapper')
const postData = JSON.parse(wrapper.querySelector('#post-data').textContent)
const checkboxes = [...wrapper.querySelectorAll('.category-filter')]
const selectAllBox = document.querySelector('.select-all')
const dropdown = document.querySelector('.dropdown')
const allCheckboxes = [selectAllBox, ...checkboxes]
const dropdownOpenButton = document.querySelector('.dropdown-toggle')
const dropdownCloseButton = document.querySelector('.dropdown-close')
const elementsCache = []

// create post links
const createAnchor = (postData) => {
  const anchor = document.createElement('a')
  anchor.href = postData.url
  anchor.classList.add('post-link')
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
const selectAllCategories = () => {
  if (selectAllBox.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true
    })

    updatePosts(filterPosts(elementsCache, checkboxes), postsWrapper)
  }
}

dropdownOpenButton.addEventListener('click', function () {
  dropdown.classList.toggle('active')

  // Toggle aria-expanded attribute
  const isExpanded = this.getAttribute('aria-expanded') === 'true'
  this.setAttribute('aria-expanded', !isExpanded)
})

// Close the dropdown if clicked outside
window.addEventListener('click', function (evt) {
  if (!dropdown.contains(evt.target)) {
    dropdown.classList.remove('active')
    dropdownOpenButton.setAttribute('aria-expanded', 'false')
  }
})

// Handle the "All" button functionality
selectAllBox.addEventListener('click', selectAllCategories)

dropdownCloseButton.addEventListener('click', function () {
  const dropdown = this.closest('.dropdown')
  dropdown.classList.remove('active')
  document
    .querySelector('.dropdown-toggle')
    .setAttribute('aria-expanded', 'false')
})

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    // debugger
    // If every box is either checked or none are, set all categories on
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

const filterPosts = (elementsCache, checkboxes) => {
  // if all categories is selected, bypass filter check
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

const makeElements = (elementsCache, postData) => {
  for (let i = 0; i < postData.length; i++) {
    elementsCache.push({
      data: postData[i],
      elemenet: createAnchor(postData[i]),
    })
  }

  return elementsCache
}

const updatePosts = (posts, postsWrapper) => {
  postsWrapper.innerHTML = ''
  for (let post of posts) {
    postsWrapper.appendChild(post.elemenet)
  }
}

makeElements(elementsCache, postData)
updatePosts(filterPosts(elementsCache, checkboxes), postsWrapper, postsWrapper)
