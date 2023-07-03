export function setTextContent(parent, selector, text) {
    if (!parent) return

    const element = parent.querySelector(selector)
    if (element) {
        element.textContent = text
    }
}

export function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text

    return `${text.slice(0, maxLength - 1)}…`
}

export function getPagination() {
    return document.getElementById('postsPagination')
}

export function setFieldValue(form, selector, value) {
    if (!form) return
    const field = form.querySelector(selector)
    field.value = value
}

export function setBackgroundImage(parent, selector, imageUrl) {
    const imageHero = parent.querySelector(selector)
    if (imageHero) {
        imageHero.style.backgroundImage = `url("${imageUrl}")`
    }
}

export function randomImage(number) {
    const randomNumber = Math.random() * number
    return Math.round(randomNumber)
}