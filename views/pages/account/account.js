const updateUserButton = document.querySelector('#update-user')
const deleteUserButton = document.querySelector('#deleteAcc')

if (updateUserButton) {
    updateUserButton.addEventListener('click', e => {
        e.preventDefault()

        const email = document.querySelector('#new-email').value.toLowerCase()
        const username = document.querySelector('#new-username').value
        const password = document.querySelector('#new-password').value
        const confirmPassword = document.querySelector('#confirm-new-password').value
        const currentPassword = document.querySelector('#current-password').value

        if (password) {
            if (email && username && password && password === confirmPassword && currentPassword) {
                fetch('/modifyPassword', {
                    method: 'PUT',
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
                    }else {
                        // Maybe eventually use this section to display a message on screen to fill out all information
                    } 
                }).catch((error) => {
                    console.error(error)
                })
            }else {
                // Maybe eventually use this section to display a message on screen to fill out all information
            }
        }else {
            if (email && username && currentPassword) {
                fetch('/modify', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, username})
                }).then((response) => response.json()).then((data) => {
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


if (deleteUserButton) {
    deleteUserButton.addEventListener('click', e => {
        e.preventDefault()

        if (confirm('Are you sure you would like to delete your account?')) {
            const password = prompt('Please enter your password to delete your account.')
            if(password != '') {
                fetch('/deleteAccount', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({password})
                }).then((response) => response.json()).then((data) => {
                    if (!data.error) {
                        console.log('Account deleted successfully')
                        location.reload()
                    } else {
                        console.log(`Error deleting account: ${data.message}`)
                    }
                }).catch((error) => {
                    console.error(error)
                })
            }
        }
    })
}