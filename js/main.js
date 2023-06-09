import postApi from "./api/postApi";

function createPostElement(post) {
    if (!post) return;

    try {
        // find and clone template
        const postTemplate = document.getElementById('postItemTemplate')
        if (!postTemplate) return

        const liElement = postTemplate.content.firstElementChild.cloneNode(true)
        if (!liElement) return

        const tilteElement = liElement.querySelector('[data-id="title"]')
        if (tilteElement) tilteElement.textContent = post.title

        const descElement = liElement.querySelector('[data-id="description"]')
        if (descElement) descElement.textContent = post.description

        const authorElement = liElement.querySelector('[data-id="author"]')
        if (authorElement) authorElement.textContent = post.author

        return liElement
    } catch (error) {
        console.log('Error create post element', error)
    }
}

function renderPostList(postList) {
    if (!Array.isArray(postList) || postList.length === 0) return;

    const ulElement = document.getElementById('postList')
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