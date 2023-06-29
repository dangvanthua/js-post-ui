import postApi from "./api/postApi";
import { initPagination, initSearch, renderPagination, renderPostList } from './utils'

async function handleFilterChange(filterName, filterValue) {
    try {
        const url = new URL(window.location)
        url.searchParams.set(filterName, filterValue)

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

        // call function init search post
        initSearch({
            elementId: 'searchInput',
            defaultParams: queryParams,
            onChange: (value) => handleFilterChange('title_like', value)
        })

        const { data, pagination } = await postApi.getAll(queryParams)

        // call function init paginantion 
        initPagination({
            elementId: 'postsPagination',
            defaultParams: queryParams,
            onChange: (page) => handleFilterChange('_page', page),
        })

        // call function to render list of post 
        renderPostList(data)

        renderPagination('postsPagination', pagination)

    } catch (error) {
        console.log('get all failed', error)
    }
})()