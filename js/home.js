import postApi from "./api/postApi";
import { setTextContent } from "./utils";

function createPostElement(post) {
    if (!post) return;

    try {
        // find and clone template
        const postTemplate = document.getElementById('postItemTemplate')
        if (!postTemplate) return

        const liElement = postTemplate.content.firstElementChild.cloneNode(true)
        if (!liElement) return

        setTextContent(liElement, '[data-id="title"]', post.title)
        setTextContent(liElement, '[data-id="description"]', post.description)
        setTextContent(liElement, '[data-id="author"]', post.author)

        const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
        if (thumbnailElement) thumbnailElement.src = post.imageUrl

        return liElement
    } catch (error) {
        console.log('Error create post element', error)
    }
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

(async () => {
    try {
        const queryParams = {
            _page: 1,
            _limit: 6,
        }

        const { data, pagination } = await postApi.getAll(queryParams)

        // call function to render list of post 
        renderPostList(data)

    } catch (error) {
        console.log('get all failed', error)
    }
})()