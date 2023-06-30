function showModal(modal) {
    if (modal) modal.show()
}

export function resgiterLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
    const modalElement = document.getElementById(modalId)
    if (!modalElement) return

    // check if modalElement have register return 
    if (Boolean(modalElement.dataset.registered)) return


    // selector
    const imageElement = document.querySelector(imgSelector)
    const prevElement = document.querySelector(prevSelector)
    const nextElement = document.querySelector(nextSelector)
    if (!imageElement || !prevElement || !nextElement) return

    let imgList = []
    let currentIndex = 0
    let modal

    function showImageAtIndex(index) {
        imageElement.src = imgList[index].src
    }

    // handle click for all imgs -> Event Delagation
    document.addEventListener('click', (event) => {
        const { target } = event
        if (target.tagName !== 'IMG' || !target.dataset.album) return

        imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
        currentIndex = Array.from(imgList).findIndex(x => x === target)
        modal = new bootstrap.Modal(modalElement)
        showImageAtIndex(currentIndex)
        showModal(modal)
    })

    prevElement.addEventListener('click', () => {
        currentIndex = ((currentIndex - 1) + imgList.length) % imgList.length
        showImageAtIndex(currentIndex)
        showModal(modal)
    })

    nextElement.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imgList.length
        showImageAtIndex(currentIndex)
        showModal(modal)
    })

    // mark this is already register
    modalElement.dataset.registered = 'true'
}