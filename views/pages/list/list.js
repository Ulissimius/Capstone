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
 *      - ##A4F0 - fetchCreateRecipe()
 *      - ##A4F1 - fetchRemoveRecipe()
 *      - ##A4F2 - fetchScraper()
 *      - ##A4F3 - fetchEditRecipe
 * 
 * ##A5 - Function Calls
 * 
 */

// ******************** Test JS (##A0) ********************
// For testing purposes


// ******************** General JS (##A1) ********************
// General or Misc JS running on the page

// Declarations
const cuisineSel = document.querySelector('.cuisine');
const cuisineArr = ['Mexican', 'Italian', 'Indian', 'Cajun', 'Soul', 'Thai', 'Greek', 'Chinese', 'Lebanese', 'Japanese', 'American', 'Moroccan', 'Mediterranean', 'French', 'Spanish', 'German', 'Korean', 'Vietnamese', 'Turkish', 'Caribbean', 'British'];
const filterSel = document.querySelector('#filter')
const filterArr = ['Old', 'New', 'A-Z', 'Z-A', 'Cuisine', 'Author']
const ERROR = "Something went wrong!\nYou could try:\n- Entering a full recipe URL from a valid website.\n- Creating you're own recipe from scratch."
const cardArr = document.querySelectorAll('.card.flex')
const mainContainer = document.querySelector('#container')
const recCont = document.querySelector('#nr-container') // Container for new/edit recipe
const submitURL = document.querySelector('#sub_URL')
const inputURL = document.querySelector('#in-url')
const statusElem = document.querySelector('#status-update')
var myStatus = () => {}
var pointer = -1

cuisineArr.sort()
filterArr.sort()

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

    recCont.dataset.edit = id // data-edit is passed the unique ID of the target recipe

    openView('#nr-container') // create_recipe partial is reset and displayed

    const editInfo = document.querySelectorAll('#nr-container .recipe-info') // Reference all non-textarea fillable elements on create_recipe
    const taArr = document.querySelectorAll('#nr-container textarea') // Reference all textareas on create_recipe

    // Copies data from target view_recipe to matching fields on create_recipe
    recipeInfo.forEach((elem, i) => {
        if (i+1 == recipeInfo.length) {
            let optionArr = document.querySelectorAll('.cuisine option')
            for (let ii = 0; ii < optionArr.length; ii++) {
                if ((optionArr[ii].innerHTML).localeCompare(elem.innerHTML) == 0) {
                    editInfo[i].value = optionArr[ii].value
                    break
                } else if (ii+1 == optionArr.length) {
                    editInfo[i].value = 'Other'
                }
            }
        } else {
            editInfo[i].value = elem.innerHTML
        }
    });

    // Copies ingredient, direction, and note data from target view_recipe to create_recipe
    recipeIngredients.forEach(ing => {
        taArr[0].value += ing.innerHTML + '\n'
    });

    recipeDirections.forEach(dir => {
        taArr[1].value += dir.innerHTML + '\n'
    });

    recipeNotes.forEach(note => {
        taArr[2].value += note.innerHTML + '\n'
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

        const cleanObj = cleanUpText({title, author, url, prep_time, cook_time, servings, cuisine, ingredients, directions, notes})

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

// ******************** Filter Options JS (##A3) ********************
//js for filtering the recipe cards

// Declarations
const contBody = document.querySelector('#main-left')
const recipeArr = Array.from(document.querySelectorAll('.card'))
let currFilter = 'Old'

function changeFilter() { // ##A3F0
    const newFilter = document.querySelector('#filter').value

    if (newFilter != currFilter) {
        contBody.innerHTML = '' // Clears the dynamic elements created by previous sort
        switch (newFilter) {
            case 'Old':
                console.log('click')
                applySort(recipeArr)
                break;
            case 'New':
                applySort(recipeArr.reverse())
                break;
            case 'A-Z':
                alphabetical(recipeArr, newFilter)
                break;
            case 'Z-A':
                reversAlphabetical(recipeArr, newFilter)
                break;
            case 'Cuisine':
                cuisineSort(recipeArr, newFilter)
                break;
            case 'Author':
                authorSort(recipeArr, newFilter)
                break;
            default:
                break;
        }
        currFilter = newFilter
    }
}

function alphabetical(items, filter) { // ##A3F1
    items.sort(function(a, b) {
        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }
        return 0
    });

    items = buildFilterListAlpha(items, pathBuilder(items, filter))
    applySort(items)
}

function reversAlphabetical(items, filter) { // ##A3F2
    items.sort(function(a, b) {
        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }

        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }
        return 0
    });
    items = buildFilterListAlpha(items, pathBuilder(items, filter))
    applySort(items)
}

function cuisineSort(items, filter) { // ##A3F3
    items.sort(function(a, b) {
        if(a.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase() > b.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase() < b.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
    items = buildFilterListAlpha(items, pathBuilder(items, filter))
    applySort(items)
}

function authorSort(items, filter) { // ##A3F4
    items.sort(function(a, b) {
        if(a.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
    items = buildFilterListAlpha(items, pathBuilder(items, filter))
    applySort(items)
}

function applySort (items) { // ##A3F5
    items.forEach(item => {
        contBody.appendChild(item);
    });
}

function pathBuilder(pathArr, filter) { // ##A3F6
    /* Returns an array of all relative reference paths for the current filter
    */
    let newPathArr = []

    switch (filter) {
        case 'Old':

            break;
        case 'New':

            break;
        case 'A-Z':
            pathArr.forEach(path => {
                newPathArr.push(path.children[1].firstElementChild.firstElementChild.innerText.toUpperCase().trim().charAt())
            });
            break;
        case 'Z-A':
            pathArr.forEach(path => {
                newPathArr.push(path.children[1].firstElementChild.firstElementChild.innerText.toUpperCase().trim().charAt())
            });
            break;
        case 'Cuisine':
            pathArr.forEach(path => {
                newPathArr.push(path.children[1].children[1].firstElementChild.children[1].innerText.toUpperCase().trim().charAt(9))
            });
            break;
        case 'Author':
            pathArr.forEach(path => {
                newPathArr.push(path.children[1].children[1].firstElementChild.firstElementChild.innerText.toUpperCase().trim().charAt(8))
            });
            break;
        default:
            break;
    }
    return newPathArr
}

function buildFilterListAlpha(arr, path) { // ##A3F7
    /* buildFilterList(arr [Filtered node array], path [pathBuilder() array])
       Takes in a filtered array and wraps each result in html for page display based on similar letters.
       path provides the reference location for the letter comparison.
    */
    let newItems = []

    for (let i = 0; i < arr.length;) {
        let curLetter = path[i]
        let prevLetter = path[i]

        let topDiv = document.createElement('div')
        let innerDiv = document.createElement('div')
        let lettH1 = document.createElement('h1')
        let lettHr = document.createElement('hr')

        topDiv.classList.add('filter-box')
        innerDiv.classList.add('box-content','flex','fw-w')
        lettH1.innerText = curLetter

        topDiv.append(lettH1)
        topDiv.append(lettHr)
        topDiv.append(innerDiv)

        while (curLetter == prevLetter) {
            innerDiv.append(arr[i])

            i++
            if (i+1 <= arr.length) {
                prevLetter = path[i]
            } else {
                prevLetter = 'END'
            }
        }//End while
        newItems.push(topDiv)
    }//End for
    return newItems
}//End buildFilterListAlpha

// ******************** Fetch Request JS (##A4) ********************
// Contains all Fetch() requests performed on list.hbs

function fetchCreateRecipe(recipeObj) { // ##A4F0
    fetch('/recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeObj)
    }).then((response) => response.json()).then((data) => {
        if (!data.error) {
            console.log("Recipe created successfully")
            stopStatus()
            window.location.replace("/list")
        } else {
            console.log(data.message)
            stopStatus()
            alert("Recipe creation failed!")
        }
    }).catch((error) => {
        console.error(error)
        stopStatus()
        alert("Recipe creation failed!")
    })
}

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
            if (!document.querySelector('.card.flex')) {
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
            fetchCreateRecipe(data.results)
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
            recCont.dataset.edit = ''
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