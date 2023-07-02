import { setFieldValue, setBackgroundImage, setTextContent } from "./common"
import * as yup from 'yup'


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

// function getTitleError(form) {
//     const titleElement = form.querySelector('[name="title"]')
//     if (!titleElement) return

//     if (titleElement.validity.valueMissing) {
//         return 'Please enter title'
//     }

//     if (titleElement.value.split(' ').filter(x => !!x && x.length >= 3).length < 2) {
//         return 'Please enter at least two words of three characters'
//     }

//     return ''
// }

// function getAuthorError(form) {
//     const authorElement = form.querySelector('[name="author"]')
//     if (!authorElement) return

//     if (!authorElement.validity.valueMissing) {
//         return 'Please enter author name'
//     }

//     return ''
// }

function getPostSchema() {
    return yup.object().shape({
        title: yup.string().required('Please enter title'),
        author: yup.string().required('Please enter author')
            .test('at-least-two-words',
                'Please enter at least two words of three characters',
                (value) => value.split(' ').filter(x => !!x && x.length >= 3).length >= 2),
        description: yup.string(),
    })
}

function setFieldError(form, name, error) {
    const element = form.querySelector(`[name="${name}"]`)
    if (element) {
        element.setCustomValidity(`${error}`)
        setTextContent(element.parentElement, '.invalid-feedback', error)
    }
}

async function validatePostForm(form, formValues) {
    // get errors
    // const errors = {
    //     title: getTitleError(form),
    //     author: getAuthorError(form),
    // }

    // // get error into validate
    // for (const key in errors) {
    //     const element = form.querySelector(`[name="${key}"]`)
    //     if (element) {
    //         element.setCustomValidity(`${errors[key]}`)
    //         setTextContent(element.parentElement, '.invalid-feedback', errors[key])
    //     }
    // }

    try {
        // reset previous errors
        ['title', 'author'].forEach(name => setFieldError(form, name, ''))

        const schema = getPostSchema()
        await schema.validate(formValues, { abortEarly: false })
    } catch (error) {
        const errorLog = {}

        if (error.name === 'ValidationError') {
            for (const validationError of error.inner) {
                const name = validationError.path
                if (errorLog[name]) continue
                setFieldError(form, name, validationError.message)
                errorLog[name] = true
            }
        }

    }

    const isValid = form.checkValidity()
    if (!isValid) {
        form.classList.add('was-validated')
    }

    return isValid
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
    const form = document.getElementById(formId)
    if (!form) return

    setFormValue(form, defaultValues)

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        // get form values
        const formValues = getFormValues(form)
        formValues.id = defaultValues.id

        // if triggered submit callback
        // Otherwise it will show error validate
        const isValid = await validatePostForm(form, formValues)
        if (!isValid) return

        onSubmit(formValues)
    })
}