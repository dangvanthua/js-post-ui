import postApi from "./api/postApi"
import { initPostForm } from "./utils/post-form.js"
import { toast } from "./utils/toasts"

function removeUnusedFields(formValues) {
    if (!formValues) return

    const payload = { ...formValues }
    // --> if imageSource: picsum remove image
    // --> if imageSource: upload remove imageUrl

    if (payload.imageSource === 'upload') {
        delete payload.imageUrl
    } else {
        delete payload.image
    }

    if (!payload.id) delete payload.id

    delete payload.imageSource

    return payload
}

function jsonToFormData(jsonObject) {
    const formData = new FormData()

    for (const key in jsonObject) {
        formData.set(key, jsonObject[key])
    }
    return formData
}

async function handlePostFormSubmit(formValues) {
    const payload = removeUnusedFields(formValues)
    const formData = jsonToFormData(payload)

    try {
        // check id edit add/update
        const savePost = formValues.id ?
            await postApi.updateFormData(formData) :
            await postApi.addFormData(formData)


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