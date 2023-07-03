import postApi from "./api/postApi"
import { initPostForm } from "./utils/post-form.js"
import { toast } from "./utils/toasts"


async function handlePostFormSubmit(formValue) {
    try {
        // check id edit add/update
        const savePost = formValue.id ?
            await postApi.update(formValue) :
            await postApi.add(formValue)


        toast.success('Save post success')
        // redirect post detail page
        setTimeout(() => {
            window.location.assign(`/post-detail.html?id=${savePost.id}`)
        }, 1600)
    } catch (error) {
        console.log('failed to fetch API', error)
        toast.error(`Error: ${error.message}`)
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