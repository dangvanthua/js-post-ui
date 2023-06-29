import { getPagination } from "./common.js";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function initPagination({ elementId, defaultParams, onChange }) {
    const ulPagination = document.getElementById(elementId)
    if (!ulPagination) return

    const prevLink = ulPagination.firstElementChild.firstElementChild
    if (prevLink) {
        prevLink.addEventListener('click', (e) => {
            e.preventDefault()
            const ulPagination = document.getElementById(elementId)
            if (!ulPagination) return

            const page = ulPagination.dataset.page

            if (page >= 2) onChange(page - 1)
        })
    }

    const nextLink = ulPagination.lastElementChild.lastElementChild
    if (nextLink) {
        nextLink.addEventListener('click', (e) => {
            e.preventDefault()

            const ulPagination = document.getElementById(elementId)
            if (!ulPagination) return

            const page = Number.parseInt(ulPagination.dataset.page) || 1
            const totalRows = ulPagination.dataset.totalPages

            if (page < totalRows) onChange(page + 1)
        })
    }
}


export function renderPagination(elementId, pagination) {
    const ulPagination = document.getElementById(elementId)
    if (pagination || ulPagination) {
        const { _page, _limit, _totalRows } = pagination

        const totalPages = Math.ceil(_totalRows / _limit)

        // set totalPages into dataset ulPagination
        ulPagination.dataset.page = _page
        ulPagination.dataset.totalPages = totalPages

        // check if it disabled
        if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled')
        else ulPagination.firstElementChild.classList.remove('disabled')

        if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled')
        else ulPagination.lastElementChild.classList.remove('disabled')
    }
}