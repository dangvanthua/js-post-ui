import postApi from "./api/postApi"
import { resgiterLightbox, setTextContent } from "./utils"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function renderPostDetail(post) {
    if (!post) return
    // render title post 
    // render author
    // render description
    // render updatedAt

    setTextContent(document, '#postDetailTitle', post.title)
    setTextContent(document, '#postDetailAuthor', post.author)
    setTextContent(document, '#postDetailDescription', post.description)
    const postTimeUpdated = dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm')
    setTextContent(document, '#postDetailTimeSpan', `- ${postTimeUpdated}`)

    // render hero image (imgUrl)
    const heroImage = document.getElementById('postHeroImage')
    if (heroImage) {
        heroImage.style.backgroundImage = `url("${post.imageUrl}")`

        heroImage.addEventListener('error', () => {
            heroImage.style.backgroundImage = `url${'https://placehold.co/1368x400/EEE/31343C'}`
        })
    }

    const editPageLink = document.getElementById('goToEditPageLink')
    if (editPageLink) {
        editPageLink.href = `/add-edit-post.html?id=${post.id}`
        editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post'
    }



}

(async () => {
    try {
        resgiterLightbox({
            modalId: 'lightbox',
            imgSelector: 'img[data-id="lightboxImg"]',
            prevSelector: 'button[data-id="lightboxPrev"]',
            nextSelector: 'button[data-id="lightboxNext"]',
        })

        // get post id form url
        // fetch post detail API
        // render post detail

        const searchParams = new URLSearchParams(window.location.search)
        const postId = searchParams.get('id')

        if (postId) {
            const post = await postApi.getById(postId)
            renderPostDetail(post)
        }
    } catch (error) {
        console.log('failed fetch API post', error)
    }

})()