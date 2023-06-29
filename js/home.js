import postApi from "./api/postApi";
import { getPagination, setTextContent, truncateText } from "./utils";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'
dayjs.extend(relativeTime)


function createPostElement(post) {
    if (!post) return;

    // find and clone template
    const postTemplate = document.getElementById('postItemTemplate')
    if (!postTemplate) return

    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return

    setTextContent(liElement, '[data-id="title"]', post.title)
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
    setTextContent(liElement, '[data-id="author"]', post.author)

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
    if (thumbnailElement) {
        thumbnailElement.src = post.imageUrl

        thumbnailElement.addEventListener('error', () => {
            console.log('load image default when image of api error')
            thumbnailElement.src = 'https://placehold.co/1368x400/EEE/31343C'
        })
    }

    let timeSpan = dayjs(post.updatedAt).fromNow()
    setTextContent(liElement, '[data-id="timeSpan"]', `- ${timeSpan}`)
    return liElement
}

function renderPostList(postList) {
    if (!Array.isArray(postList) || postList.length === 0) return;


    const ulElement = document.getElementById('postsList')
    if (!ulElement) return

    // clear current list 
    ulElement.textContent = ''

    postList.forEach((post) => {
        const liElement = createPostElement(post)
        ulElement.appendChild(liElement)
    })
}

async function handleFilterChange(filterName, filterValue) {
    try {
        const url = new URL(window.location)
        url.searchParams.set(filterName, filterValue)

        // reset page if it is searched
        if (filterName === 'title_like') url.searchParams.set('_page', 1)

        history.pushState({}, '', url)


        // fetch api
        // const queryParams = new URLSearchParams(window.location.search)
        const { data, pagination } = await postApi.getAll(url.searchParams)
        // re-render api
        renderPostList(data)
        renderPagination(pagination)
    } catch (error) {
        console.log('failed to fetch post list', error)
    }

}


function initPagination() {
    const ulPagination = getPagination()
    if (!ulPagination) return

    const prevLink = ulPagination.firstElementChild.firstElementChild
    if (prevLink) prevLink.addEventListener('click', handlePrevClick)

    const nextLink = ulPagination.lastElementChild.lastElementChild
    if (nextLink) nextLink.addEventListener('click', handleNextClick)
}

function handlePrevClick(e) {
    e.preventDefault()
    const ulPagination = getPagination()
    if (!ulPagination) return

    const page = ulPagination.dataset.page
    if (page <= 1) return


    handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
    e.preventDefault()
    const ulPagination = getPagination()
    if (!ulPagination) return

    const page = Number.parseInt(ulPagination.dataset.page) || 1
    const totalRows = ulPagination.dataset.totalPages

    if (page >= totalRows) return
    handleFilterChange('_page', page + 1)
}

function initURL() {
    const url = new URL(window.location)

    // upadated queryParams if need
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)

    history.pushState({}, '', url)
}

function renderPagination(pagination) {
    const ulPagination = getPagination()
    if (pagination || ulPagination) {
        const { _page, _limit, _totalRows } = pagination

        const totalPages = Math.ceil(_totalRows / _limit)

        // set totalPages into dataset ulPagination
        ulPagination.dataset.page = _page
        ulPagination.dataset.totalPages = totalPages

        // check if it disabled
        if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled')
        else ulPagination.firstElementChild.classList.remove('disabled')

        if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled')
        else ulPagination.lastElementChild.classList.remove('disabled')
    }
}

function initSearch() {
    const searchInput = document.getElementById('searchInput')
    if (!searchInput) return

    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('title_like')) {
        searchInput.value = queryParams.get('title_like')
    }

    const debounceSearch = debounce((event) => handleFilterChange('title_like', event.target.value), 500)
    searchInput.addEventListener('input', debounceSearch)
}

(async () => {
    try {
        // call function init default url if it don't have 
        initURL()

        // call function init search post
        initSearch()

        const queryParams = new URLSearchParams(window.location.search)

        // set default queryParams

        const { data, pagination } = await postApi.getAll(queryParams)

        // call function init paginantion 
        initPagination()

        // call function to render list of post 
        renderPostList(data)

        renderPagination(pagination)

    } catch (error) {
        console.log('get all failed', error)
    }
})()