import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export const toast = {
    info(message) {
        Toastify({
            text: message,
            duration: 1500,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            close: true,
            style: {
                background: "linear-gradient(to right, #1c7ed6, #228be6)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    },

    success(message) {
        Toastify({
            text: message,
            duration: 1500,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            close: true,
            style: {
                background: "linear-gradient(to right, #51cf66, #69db7c)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    },

    error(message) {
        Toastify({
            text: message,
            duration: 1500,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            close: true,
            style: {
                background: "linear-gradient(to right, #f03e3e, #fa5252)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    },
}