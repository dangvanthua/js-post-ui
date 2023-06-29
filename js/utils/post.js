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