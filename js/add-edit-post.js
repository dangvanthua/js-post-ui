import postApi from "./api/postApi"
import { initPostForm } from "./utils/post-form.js"

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
            onSubmit: (formValue) => console.log('submit', formValue)
        })
    } catch (error) {
        console.log('failed fetch post from api', error)
    }

})()