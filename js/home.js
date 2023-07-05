import postApi from "./api/postApi";
import { initPagination, initSearch, renderPagination, renderPostList, setTextContent, toast } from './utils'

function registerPostDeleteEvent() {
    document.addEventListener('post-delete', async (event) => {
        try {
            const post = event.detail
            const message = `Are you want to remove post have title "${post.title}"`

            setRemoveModal(message, async onRemove => {
                await postApi.remove(post.id)
                await handleFilterChange()

                // notice toast success after remove post
                toast.success('Remove post success')
            })

        } catch (error) {
            console.log('fail to remove post', error)
            toast.error(error.message)
        }
    })
}

function showModal(modalElement) {
    const modal = new window.bootstrap.Modal(modalElement)
    if (modal) modal.show()
}


function setRemoveModal(message, onRemove) {
    setTextContent(document, '[data-name="titleContent"]', message)
    const modalElement = document.getElementById('removeBox')
    if (!modalElement) return

    showModal(modalElement)

    const removeElement = document.querySelector('button[data-id="removeModal"]')
    if (removeElement) {
        removeElement.addEventListener('click', () => onRemove())
    }

}

async function handleFilterChange(filterName, filterValue) {
    try {
        const url = new URL(window.location)
        if (filterName) url.searchParams.set(filterName, filterValue)
        // reset page if it is searched
        if (filterName === 'title_like') url.searchParams.set('_page', 1)

        history.pushState({}, '', url)


        // fetch api
        // const queryParams = new URLSearchParams(window.location.search)
        const { data, pagination } = await postApi.getAll(url.searchParams)
        // re-render api
        renderPostList(data)
        renderPagination('postsPagination', pagination)
    } catch (error) {
        console.log('failed to fetch post list', error)
    }

}


(async () => {
    try {
        const url = new URL(window.location)

        // upadated queryParams if need
        if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
        if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)

        history.pushState({}, '', url)
        const queryParams = url.searchParams;

        registerPostDeleteEvent()

        // call function init search post
        initSearch({
            elementId: 'searchInput',
            defaultParams: queryParams,
            onChange: (value) => handleFilterChange('title_like', value)
        })

        // call function init paginantion 
        initPagination({
            elementId: 'postsPagination',
            defaultParams: queryParams,
            onChange: (page) => handleFilterChange('_page', page),
        })

        handleFilterChange()

    } catch (error) {
        console.log('get all failed', error)
    }
})()