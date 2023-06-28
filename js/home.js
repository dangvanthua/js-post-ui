import postApi from "./api/postApi";
import { setTextContent, truncateText } from "./utils";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
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


    postList.forEach((post) => {
        const liElement = createPostElement(post)
        ulElement.appendChild(liElement)
    })
}

function handleFilterChange(filterName, filterValue) {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)

    // fetch api
    // re-render api

}


function initPagination() {
    const ulPagination = document.getElementById('postsPagination')
    if (!ulPagination) return

    const prevLink = ulPagination.firstElementChild.firstElementChild
    if (prevLink) prevLink.addEventListener('click', handlePrevClick)

    const nextLink = ulPagination.lastElementChild.lastElementChild
    if (nextLink) nextLink.addEventListener('click', handleNextClick)
}

function handlePrevClick(e) {
    e.preventDefault()
    console.log('prev click')
}

function handleNextClick(e) {
    e.preventDefault()
    console.log('next click')
}

function initURL() {
    const url = new URL(window.location)

    // upadated queryParams if need
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
}

(async () => {
    try {
        // call function init default url if it don't have 
        initURL()

        const queryParams = new URLSearchParams(window.location.search)

        // set default queryParams

        const { data, pagination } = await postApi.getAll(queryParams)

        // call function init paginantion 
        initPagination()

        // call function to render list of post 
        renderPostList(data)

    } catch (error) {
        console.log('get all failed', error)
    }
})()