import { setFieldValue, setBackgroundImage, setTextContent, randomImage } from "./common"
import * as yup from 'yup'

const ImageSource = {
    PICSUM: 'picsum',
    UPLOAD: 'upload',
}

function setFormValue(form, formValues) {
    setFieldValue(form, '[name="title"]', formValues.title)
    setFieldValue(form, '[name="author"]', formValues.author)
    setFieldValue(form, '[name="description"]', formValues.description)

    // set background image of hero image 
    setFieldValue(form, '[name="imageUrl"]', formValues.imageUrl)
    setBackgroundImage(document, '#postHeroImage', formValues.imageUrl)
}


function initRandomImage(form) {
    const randomButton = document.getElementById('postChangeImage')
    if (!randomButton) return

    randomButton.addEventListener('click', () => {
        const urlImage = `https://picsum.photos/id/${randomImage(1000)}/1368/400`
        setFieldValue(form, '[name="imageUrl"]', urlImage)
        setBackgroundImage(document, '#postHeroImage', urlImage)
    })
}

function renderImageSource(form, value) {
    const controlList = form.querySelectorAll('[data-id="imageSource"]')
    if (!controlList) return

    controlList.forEach((control) => {
        control.hidden = control.dataset.imageSource !== value
    })
}

function initRadioImage(form) {
    if (!form) return

    const radioList = form.querySelectorAll('[name="imageSource"]')
    if (!radioList) return

    radioList.forEach((radio) => {
        radio.addEventListener('change', (event) => {
            renderImageSource(form, event.target.value)
        })
    })
}

function initFormImage(form) {
    const uploadImage = form.querySelector('[name="image"]')
    if (!uploadImage) return

    uploadImage.addEventListener('change', (event) => {
        const file = URL.createObjectURL(event.target.files[0])
        if (file) {
            setBackgroundImage(document, '#postHeroImage', file)
        }
    })
}

function getFormValues(form) {
    const formValues = {}

    // S2: using form data
    const data = new FormData(form)
    for (const [key, value] of data) {
        formValues[key] = value
    }

    return formValues
}

function getPostSchema() {
    return yup.object().shape({
        title: yup.string().required('Please enter title'),
        author: yup.string().required('Please enter author')
            .test('at-least-two-words',
                'Please enter at least two words of three characters',
                (value) => value.split(' ').filter(x => !!x && x.length >= 3).length >= 2),
        description: yup.string(),
        imageSource: yup.string().required('Please select an image source').oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
        image: yup.mixed().when('imageSource', {
            is: ImageSource.UPLOAD,
            then: yup.mixed().test('required', 'Please select image to upload', (value) => Boolean(value.name))
        }),
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

    try {
        // reset previous errors
        ['title', 'author', 'imageUrl'].forEach(name => setFieldError(form, name, ''))

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

function showLoading(form) {
    const button = form.querySelector('[name="submit"]')
    if (!button) return

    button.disabled = true
    button.textContent = 'Saving...'
}

function hideLoading(form) {
    const button = form.querySelector('[name="submit"]')
    if (!button) return

    button.disabled = false
    button.textContent = 'Save'
}



export function initPostForm({ formId, defaultValues, onSubmit }) {
    const form = document.getElementById(formId)
    if (!form) return

    let isSubmit = false
    setFormValue(form, defaultValues)

    initRadioImage(form)
    initRandomImage(form)
    initFormImage(form)

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        if (isSubmit) return


        showLoading(form)

        isSubmit = true

        // get form values
        const formValues = getFormValues(form)
        formValues.id = defaultValues.id

        // if triggered submit callback
        // Otherwise it will show error validate
        const isValid = await validatePostForm(form, formValues)
        if (isValid) await onSubmit(formValues)

        // hide submiting and prevent submit consecutive
        hideLoading(form)
        isSubmit = true
    })
}