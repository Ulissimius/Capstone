const newUserButton = document.querySelector('#post-user')
if (newUserButton) {
    newUserButton.addEventListener('click', e => {
        e.preventDefault()
    
        const email = document.querySelector('#new-email').value
        const username = document.querySelector('#new-username').value
        const password = document.querySelector('#new-password').value
    
        if (email && username && password) {
            if (password.length > 8) {
                // var hasUpperCase = /[A-Z]/.test(password);
                // var hasLowerCase = /[a-z]/.test(password);
                // var hasNumbers = /\d/.test(password);
                // var hasNonalphas = /\W/.test(password);

                if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
                    fetch('/user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email, username, password})
                    }).then((response) => response.json()).then((data) => {
                        console.log(data)
                        if (email && password && data.error == false) {
                            fetch('/login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({email, password})
                            }).then((response) => response.json()).then((data) => {
                                console.log(data)
                                document.cookie = `authentication=${data.token}`
                                location.reload();
                            }).catch((error) => {
                                console.error(error)
                            })
                        } else {
                            // Maybe eventually use this section to display a message on screen to fill out all information
                        } 
                    }).catch((error) => {
                        console.error(error)
                    })
                } else {
                    alert("Password does not meet complexity requirements.\nPassword must:\n  - Have at least 1 uppercase letter\n  - Have at least 1 lowercase letter\n  - Have at least 1 number\n  - Have at least 1 symbol")
                }
            } else {
                alert("Password must be more than 8 characters long")
            }
        } else {
            // Maybe eventually use this section to display a message on screen to fill out all information
            alert('Please fill out Email, Username, and Password.')
        }
    })
}

const loginButton = document.querySelector('#post-login')
if (loginButton) {
    loginButton.addEventListener('click', e => {
        e.preventDefault()
    
        const email = document.querySelector('#login-email').value
        const password = document.querySelector('#login-password').value
    
        if (email && password) {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            }).then((response) => response.json()).then((data) => {
                if (!data.error) {
                    document.cookie = `authentication=${data.token}`
                    location.reload();
                } else {
                    console.log(`Error logging in: ${data.message}`)
                }
            }).catch((error) => {
                console.error(error)
            })
        } else {
            // Maybe eventually use this section to display a message on screen to fill out all information
        }
    })
}