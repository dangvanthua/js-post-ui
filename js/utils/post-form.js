import { setFieldValue, setBackgroundImage } from "./common"

function setFormValue(form, formValues) {
    setFieldValue(form, '[name="title"]', formValues.title)
    setFieldValue(form, '[name="author"]', formValues.author)
    setFieldValue(form, '[name="description"]', formValues.description)

    // set background image of hero image 
    setFieldValue(form, '[name="imageUrl"]', formValues.imageUrl)
    setBackgroundImage(document, '#postHeroImage', formValues.imageUrl)
}

function getFormValues(form) {
    const formValues = {}

    // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
    //     const field = form.querySelector(`[name="${name}"]`)
    //     if (field) values[name] = field.value
    // })

    // S2: using form data
    const data = new FormData(form)
    for (const [key, value] of data) {
        formValues[key] = value
    }

    return formValues
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
    const form = document.getElementById(formId)
    if (!form) return

    setFormValue(form, defaultValues)

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        // get form values
        const formValues = getFormValues(form)
        if (formValues) console.log(formValues)
    })
}