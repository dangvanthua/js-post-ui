import { setTextContent, truncateText } from "./common.js";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


export function createPostElement(post) {
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

    // attach events
    // go to post detail if it is clicked post-item
    const divElement = liElement.firstElementChild
    if (divElement) {
        divElement.addEventListener('click', (event) => {
            const menu = liElement.querySelector('[data-id="menu"]')
            // S2: if event click menu --> ingnore
            if (menu && menu.contains(event.target)) return
            window.location.assign(`/post-detail.html?id=${post.id}`)
        })
    }

    // add click for edit button
    const editButton = liElement.querySelector('[data-id="edit"]')
    editButton.addEventListener('click', (event) => {
        // S1: Use stopPropagation to prevent event bubling
        // event.stopPropagation()
        window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })

    // add click for remove button
    const removeButton = liElement.querySelector('[data-id="remove"]')
    removeButton.addEventListener('click', (event) => {
        const customEvent = new CustomEvent('post-delete', {
            bubbles: true,
            detail: post,
        })

        removeButton.dispatchEvent(customEvent)
    })

    return liElement
}

export function renderPostList(postList) {
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