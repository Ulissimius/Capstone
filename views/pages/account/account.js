const newUserButton = document.querySelector('#update-user')
if (newUserButton) {
    newUserButton.addEventListener('click', e => {
        e.preventDefault()
    
        const email = document.querySelector('#new-email').value
        const username = document.querySelector('#new-username').value
        const password = document.querySelector('#new-password').value
        const confirmPassword = document.querySelector('#confirm-new-password').value
        const currentPassword = document.querySelector('#current-password').value

        if (password) {
            if (email && username && password && password === confirmPassword && currentPassword) {
                fetch('/modifyPassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, username, password})
                }).then((response) => response.json()).then((data) => {
                    console.log(data)
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
                // Maybe eventually use this section to display a message on screen to fill out all information
            }
        } else {
            if (email && username && currentPassword) {
            fetch('/modify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, username})
            }).then((response) => response.json()).then((data) => {
                console.log(data)
                if (email && password) {
                    fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email, password, currentPassword})
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
                // Maybe eventually use this section to display a message on screen to fill out all information
            }
        }
    })
}