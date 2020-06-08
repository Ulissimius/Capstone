function copyRecipe(id, name) { // ##A2F5
    /**
     * Sends a fetch request to find an existing recipe and copy it.
     */
    if(!confirm('Are you sure you want to copy this recipe?')) return;

    fetch('/copyRecipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    }).then((response) => response.json())
    .then((data) => {
        if (!data.error) {
            alert("Recipe copied successfully!")
        } else {
            console.error(data.error)
            alert("Recipe copy failed!")
        }
    }).catch((error) => {
        console.error(error)
    })
}

if (contBody) {
    applyFilters()
}