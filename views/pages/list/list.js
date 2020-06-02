// ******************** Title Sections with this template comments ********************
// Example:
// ******************** Recipe Card JS (##A0) ********************
// This JS handles filling out the data for the recipe cards.

/**
* Search Index:
* ##A0 - Test JS
* 
* ##A1 - General JS
*      - ##A1F0 - fillOptions()
*      - ##A1F1 - card.addEventListener------------- Moved to global
*      - ##A1F2 - setStatus()
*      - ##A1F3 - stopStatus()
*      - ##A1F4 - window.addEventListener('load')
*      - ##A1F5 - favoriteOnLoad(stars)
*      - ##A1F6 - favoriteRecipe(elem, id)
* 
* ##A2 - Button JS
*      - ##A2F0 - openView()------------------------ Moved to global
*      - ##A2F1 - closeView()----------------------- Moved to global
*      - ##A2F2 - wrapper.addEventListener---------- Moved to global
*      - ##A2F3 - resetFields()--------------------- Moved to global
*      - ##A2F4 - submitURL.addEventListener
*      - ##A2F5 - editRecipe()
*      - ##A2F6 - newRecipeButton.addEventListener
*      - ##A2F7 - deleteRecipe()
* 
* ##A3 - Filter Options JS
*      - ##A3F0 - changeFilter()
*      - ##A3F1 - alphabetical()
*      - ##A3F2 - reversAlphabetical()
*      - ##A3F3 - cuisineSort()
*      - ##A3F4 - authorSort()
*      - ##A3F5 - applySort()
*      - ##A3F6 - pathBuilder()
*      - ##A3F7 - buildFilterListAlpha()
* 
* ##A4 - Fetch Request JS
*      - ##A4F0 - fetchCreateRecipe() -------------- Moved to global
*      - ##A4F1 - fetchRemoveRecipe()
*      - ##A4F2 - fetchScraper()
*      - ##A4F3 - fetchEditRecipe
* 
* ##A5 - Function Calls
*      - ##A5F0 - window.addEventListener()
* 
*/

// ******************** Test JS (##A0) ********************
// For testing purposes

// ******************** General JS (##A1) ********************
// General or Misc JS running on the page

// Declarations
const cuisineSel = document.querySelector('.cuisine');
const cuisineArr = ['Mexican', 'Italian', 'Indian', 'Cajun', 'Soul', 'Thai', 'Greek', 'Chinese', 'Lebanese', 'Japanese', 'American', 'Moroccan', 'Mediterranean', 'French', 'Spanish', 'German', 'Korean', 'Vietnamese', 'Turkish', 'Caribbean', 'British'];
const ERROR = "Something went wrong!\nYou could try:\n- Entering a full recipe URL from a valid website.\n- Creating you're own recipe from scratch."
const cardArr = document.querySelectorAll('.card')
const mainContainer = document.querySelector('#container')
const recCont = document.querySelector('#nr-container') // Container for new/edit recipe
const submitURL = document.querySelector('#sub_URL')
const inputURL = document.querySelector('#in-url')
const statusElem = document.querySelector('#status-update')
var myStatus = () => {}
var pointer = -1

cuisineArr.sort()

function fillOptions(arr, local) { // ##A1F0
    arr.forEach(elem => {
        let newOp = document.createElement('option');
        newOp.value = elem;
        newOp.innerHTML = elem;

        local.append(newOp);
    });

    if (arr == cuisineArr) {
        let newOp = document.createElement('option');
        newOp.value = 'Other';
        newOp.innerHTML = 'Other';
        newOp.selected = true;

        local.append(newOp);
    }
}

function setStatus() { // ##A1F2
    if (pointer == -1) {
        pointer = 3;
        statusElem.classList.remove('hide');
        submitURL.setAttribute('disabled', true);
        inputURL.setAttribute('disabled', true);
    }

    if (pointer == 3) {
        statusElem.innerText = "Fetching data"
        pointer = 0
    } else {
        statusElem.innerText += "."
        pointer++
    } 
};

function stopStatus() { // ##A1F3
    statusElem.classList.add('hide')
    submitURL.removeAttribute('disabled')
    inputURL.removeAttribute('disabled')
    pointer = -1
    clearInterval(myStatus)
}

// ******************** Button JS (##A2) ********************
// Gives functionality to the various buttons on the page.

if (submitURL) { // ##A2F4
    submitURL.addEventListener('click', e => {
    /*  Submits a URL to the webscraper
    */
        let recipeURL = inputURL.value

        fetchScraper(recipeURL)

        stopStatus()
    })
}

function editRecipe(id) { // ##A2F5
    /* Pulls data from a unique view_recipe to the create_recipe view
       The create_recipe view can then be submitted to the /editRecipe function
    */

    // recipe* variables reference recipe data from the targeted view_recipe
    const recipeInfo = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-info`)
    const recipeIngredients = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-ingredients`)
    const recipeDirections = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-directions`)
    const recipeNotes = document.querySelectorAll(`.nr-container.fl-col.rel.wrapper-child[data-id="${id}"] .recipe-notes`)
    const nameValue = (document.querySelector(`.card[data-id="${id}"] .card-info-left.fl-col-fl p:nth-child(2)`).innerText).split(': ')

    recCont.dataset.edit = id // data-edit is passed the unique ID of the target recipe
    recCont.dataset.name = nameValue[1]

    openView('#nr-container') // create_recipe partial is reset and displayed

    const editInfo = document.querySelectorAll('#nr-container .recipe-info') // Reference all non-textarea fillable elements on create_recipe
    const taArr = document.querySelectorAll('#nr-container textarea') // Reference all textareas on create_recipe

    // Copies data from target view_recipe to matching fields on create_recipe
    recipeInfo.forEach((elem, i) => {
        if (i+1 == recipeInfo.length) {
            let optionArr = document.querySelectorAll('.cuisine option')
            for (let ii = 0; ii < optionArr.length; ii++) {
                if ((optionArr[ii].innerText).localeCompare(elem.innerText) == 0) {
                    editInfo[i].value = optionArr[ii].value
                    break
                } else if (ii+1 == optionArr.length) {
                    editInfo[i].value = 'Other'
                }
            }
        } else {
            editInfo[i].value = elem.innerText
        }
    });

    editInfo[1].value = splitAuth(editInfo)

    function splitAuth(info) {
        let auth = info[1].value.split(': ')
        return auth[1]
    }

    // Copies ingredient, direction, and note data from target view_recipe to create_recipe
    recipeIngredients.forEach(ing => {
        taArr[0].value += ing.innerText + '\n'
    });

    recipeDirections.forEach(dir => {
        taArr[1].value += dir.innerText + '\n'
    });

    recipeNotes.forEach(note => {
        taArr[2].value += note.innerText + '\n'
    });
}

// Declarations
const newRecipeButton = document.querySelector('#post-recipe')

if (newRecipeButton) { // ##A2F6
    newRecipeButton.addEventListener('click', e => {
        e.preventDefault()
    
        const title = document.querySelector('#name').value
        const author = document.querySelector('#author').value
        const url = document.querySelector('#url').value
        const prep_time = document.querySelector("input[name='prep_time']").value
        const cook_time = document.querySelector("input[name='cook_time']").value
        const servings = document.querySelector("input[name='servings']").value
        const cuisine = document.querySelector("select[name='cuisine']").value
        const directions = document.querySelector("textarea[name='directions']").value
        const notes = document.querySelector("textarea[name='notes']").value
        const ingredients = document.querySelector("textarea[name='ingredients']").value
        const auth_user = recCont.dataset.name
        const cleanObj = cleanUpText({title, auth_user, author, url, prep_time, cook_time, servings, cuisine, ingredients, directions, notes})

        if (title && author && directions && ingredients) {
            if (recCont.dataset.edit == '') {
                console.log('Create Recipe')
                fetchCreateRecipe(cleanObj)
            } else {
                console.log('Edit Recipe')
                fetchEditRecipe(cleanObj, recCont.dataset.edit)
            }
        } else {
            alert('Recipes must have:\n- A Title\n- An Author\n- At Least 1 Ingredient\n- Directions')
        }
    })
}

function deleteRecipe(id) { // ##A2F7
    /* id is equal to the unique id of the relevant recipe.
       This function should make it easy to delete both the card and the recipe when called.
    */
    // Cancles the function if the user does not confirm.
    if(!confirm('Are you sure you want to delete this recipe?')) return;
    
    // Request data be delete here
    fetchRemoveRecipe(id)
}

var favoriteArr = [] // This is the array of favorite recipes collected on page load
var updateFavArr = [] // This is the array that gets checked against on page exit/refresh
var favDidRun = false;
window.addEventListener('load', () => { // ##A1F4
    /**
    * On Load create a reference to the users existing favorites
    * and create a copy that gets updated as the user marks/removes favorites
    */
    fetch('/getFavorites')
    .then((response) => response.json())
    .then((data) => {
        if (data.error == true) {
            console.error(data.error)
        } else {
            favoriteArr = Array.from(data.favorites)
            let newObj = JSON.parse(JSON.stringify(data.favorites))
            updateFavArr = Array.from(newObj)
        }
    }).catch((e) => {
        console.log(e)
        console.error('Unable to fetch favorite data.')
    })
})

function favoriteOnLoad(stars) { // ##A1F5
    /**
    * Toggles the fav button on if the respective recipe is a favorite
    */
    stars.forEach(setFav => {
        let isFav = (setFav.dataset.favorite === 'true')
        if (isFav == true) {
            // Switch to full star
            setFav.src = '/assets/images/star-24px.svg'
        }
    });
}

function favoriteRecipe(elem, id) { // ##A1F6
    /**
    * The fav button (star) will toggle between empty and full
    * Then the change is saved to an array for use on page unload
    */
    let isFav = (elem.dataset.favorite === 'true')
    if (isFav == false) {
        // Switch to full star
        elem.src = '/assets/images/star-24px.svg'
        elem.dataset.favorite = 'true'
    } else {
        // Switch to empty star
        elem.src = '/assets/images/star_border-24px.svg'
        elem.dataset.favorite = 'false'
    }

    if (id) {
        for (let i = 0; i < updateFavArr.length; i++) {
            if (updateFavArr[i]._id == id) {
                updateFavArr[i].favorite = (!isFav)
                break
            }
        }

        favDidRun = true
    }
}

// ******************** Fetch Request JS (##A4) ********************
// Contains all Fetch() requests performed on list.hbs

function fetchRemoveRecipe(id) { // ##A4F1
    fetch('/removeRecipe', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    }).then((response) => response.json()).then((data) => {
        if (!data.error) {
            console.log("Recipe removed successfully")
            // If all cards are deleted, refresh the page.
            let recInfoArr = document.querySelectorAll(`[data-id="${id}"]`)
            recInfoArr.forEach(elem => {
                elem.remove() 
            });
            recipeArr = Array.from(document.querySelectorAll('.card'))
            if (!document.querySelector('.card')) {
                window.location.replace("/list")
            }
        } else {
            console.log(data.message)
            alert("Recipe removal failed!")
        }
    }).catch((error) => {
        console.error(error)
    })
}

function fetchScraper(newURL) { // ##A4F2
    let request = fetch('/scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newURL})
    })

    myStatus = setInterval(setStatus, 750)

    request.then((response) => response.json() )
    .then((data) => {
        if (!data.error) {
            cleanResults = cleanUpText(data.results)
            fetchCreateRecipe(cleanResults)
        } else {
            console.log(data.message)
            stopStatus()
            alert(ERROR)
        }
    })
    .catch((error) => {
        console.error(error)
        stopStatus()
        alert(ERROR)
    })
}

function fetchEditRecipe(recipeObj, id) { // ##A4F3
    Object.assign(recipeObj, {id})

    fetch('/editRecipe', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeObj)
    }).then((response) => response.json()).then((data) => {
        if (!data.error) {
            alert("Recipe edit successfully")
            window.location.replace("/list")
        } else {
            console.log(data.message)
            alert("Recipe edit failed!")
        }
    }).catch((error) => {
        console.error(error)
        alert("Recipe edit failed!")
    })
    recCont.dataset.edit = '' // Reset data-edit so edit is not called by accident.
}

// ******************** Function Calls (##A5) ********************
// All function calls happening on page load - happens last so variables can be fully declared

fillOptions(cuisineArr, cuisineSel);
if (filterSel) {
    fillOptions(filterArr, filterSel)
}

changeFilter() // Sets the page to the default filter on load

favoriteOnLoad(Array.from(document.querySelectorAll('[data-favorite]')))

window.addEventListener("beforeunload", function(e){ // ##A5F0
    /**
    * Only prevents the user from exiting if they interacted with the favorite button.
    * On page unload (refresh / exit) the user is prompted if they are sure and their selection
    * of favorites are updated in the DB.
    * This function may be changed to run every... 30 seconds or so instead of on page unload.
    * Maybe have it track the last favorite input from the user and after so many seconds makes a call to update.
    */
    // Do something
    if (favDidRun) {
        e.preventDefault()
        diffArr = []
        for (let i = 0; i < updateFavArr.length; i++) {
            if (updateFavArr[i].favorite != favoriteArr[i].favorite) {
                // console.log(`Array position: ${i}\nupdateFavArr value: ${updateFavArr[i].favorite}\nfavoriteArr value: ${favoriteArr[i].favorite}`)
                // Do a fetch for each array change

                // Or do one fetch with an array of the changes
                diffArr.push(updateFavArr[i])
            }
        }
        fetch('/updateFavorites', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diffArr)
        }).then((response) => response.json())
        .then((data) => {
            if (data.error == true) {
                console.error(data.error)
            }
        }).catch((e) => {
            console.log(e)
            console.error('Unable to update favorites')
        })
    } else {
        return false;
    }
});