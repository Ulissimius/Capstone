function copyRecipe(id, name) { // ##A2F5
    /* Pulls data from a unique view_recipe to the create_recipe view
    The create_recipe view can then be submitted to the /editRecipe function
    */

    // recipe* variables reference recipe data from the targeted view_recipe
    const recipeInfo = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-info`)
    const recipeIngredients = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-ingredients`)
    const recipeDirections = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-directions`)
    const recipeNotes = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-notes`)

    let ingArr = []
    let directArr = []
    let notesArr = []

    recipeIngredients.forEach(e => {
        ingArr.push(e.innerText)
    });

    recipeDirections.forEach(e => {
        directArr.push(e.innerText)
    });

    recipeNotes.forEach(e => {
        notesArr.push(e.innerText)
    });

    recipeObj = {
        url: recipeInfo[2].innerText,
        title: recipeInfo[0].innerText,
        auth_user: name,
        author: recipeInfo[1].innerText,
        prep_time: recipeInfo[3].innerText,
        cook_time: recipeInfo[4].innerText,
        servings: recipeInfo[5].innerText,
        cuisine: recipeInfo[6].innerText,
        ingredients: ingArr,
        directions: directArr,
        notes: notesArr
    }

    cleanObj = cleanUpText(recipeObj)

    fetchCreateRecipe(cleanObj)
}

applyFilters()