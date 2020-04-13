// const navButtons = document.querySelectorAll('.nav-btn')
// navButtons.forEach(button => {
//     button.addEventListener('click', e => {
//         e.preventDefault()

//         const target = document.querySelector(`#${e.target.dataset.target}.modal`)

//         if (target) {
//             target.style.display = 'flex'
//         }
//     })
// })

// const closeButtons = document.querySelectorAll('.modal-cancel')
// closeButtons.forEach(button => {
//     button.addEventListener('click', e => {
//         e.preventDefault()

//         const target = e.target.parentElement

//         target.style.display = 'none'
//     })
// })

// const newUserButton = document.querySelector('#post-user')
// if (newUserButton) {
//     newUserButton.addEventListener('click', e => {
//         e.preventDefault()
    
//         const email = document.querySelector('#new-email').value
//         const username = document.querySelector('#new-username').value
//         const password = document.querySelector('#new-password').value
    
//         if (email && username && password) {
//             fetch('/user', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({email, username, password})
//             }).then((response) => response.json()).then((data) => {
//                 console.log(data)
//             }).catch((error) => {
//                 console.error(error)
//             })
//         } else {
//             // Maybe eventually use this section to display a message on screen to fill out all information
//         }
//     })
// }

// const loginButton = document.querySelector('#post-login')
// if (loginButton) {
//     loginButton.addEventListener('click', e => {
//         e.preventDefault()
    
//         const email = document.querySelector('#login-email').value
//         const password = document.querySelector('#login-password').value
    
//         if (email && password) {
//             fetch('/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({email, password})
//             }).then((response) => response.json()).then((data) => {
//                 console.log(data)
//                 document.cookie = `authentication=${data.token}`
//             }).catch((error) => {
//                 console.error(error)
//             })
//         } else {
//             // Maybe eventually use this section to display a message on screen to fill out all information
//         }
//     })
// }