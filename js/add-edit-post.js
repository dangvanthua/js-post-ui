import postApi from "./api/postApi"
import { initPostForm } from "./utils/post-form.js"

async function handlePostFormSubmit(formValue) {
    try {
        // check id edit add/update
        const savePost = formValue.id ?
            await postApi.update(formValue) :
            await postApi.add(formValue)

        // redirect post detail page
        window.location.assign(`/post-detail.html?id=${savePost.id}`)
    } catch (error) {
        console.log('failed to fetch API', error)
    }
}

(async () => {

    try {
        const queryParams = new URLSearchParams(window.location.search)

        const postId = queryParams.get('id')

        const defaultValues = Boolean(postId) ? await postApi.getById(postId) : {
            title: '',
            description: '',
            author: '',
            imageUrl: '',
        }

        initPostForm({
            formId: 'postForm',
            defaultValues,
            onSubmit: handlePostFormSubmit
        })
    } catch (error) {
        console.log('failed fetch post from api', error)
    }

})()