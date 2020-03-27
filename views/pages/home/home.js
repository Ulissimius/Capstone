var newUserButton = document.querySelector('#post-user')
newUserButton.addEventListener('click', function(e) {
    e.preventDefault()

    var email = document.querySelector('#new-email').value
    var username = document.querySelector('#new-username').value
    var password = document.querySelector('#new-password').value

    if (email && username && password) {
        fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, username, password})
        }).then((response) => response.json()).then((data) => {
            console.log(data)
        }).catch((error) => {
            console.error(error)
        })
    } else {
        // Maybe eventually use this section to display a message on screen to fill out all information
    }
})

var loginButton = document.querySelector('#post-login')
loginButton.addEventListener('click', function(e) {
    e.preventDefault()

    var email = document.querySelector('#login-email').value
    var password = document.querySelector('#login-password').value

    if (email && password) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        }).then((response) => response.json()).then((data) => {
            console.log(data)
            document.cookie = `authentication=${data.token}`
        }).catch((error) => {
            console.error(error)
        })
    } else {
        // Maybe eventually use this section to display a message on screen to fill out all information
    }
})