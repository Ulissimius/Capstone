

// ******************** Title Sections with this template comments ********************
// Example:
// ******************** Recipe Card JS ********************
// This JS handles filling out the data for the recipe cards.

// ******************** Test JS ********************
// For testing purposes
const cardArr = document.querySelectorAll('.card.flex')
const mainContainer = document.querySelector('#container')

document.querySelectorAll('.card.flex').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.nodeName != 'IMG') {
            // console.log(document.querySelector(`div.nr-container.fl-col.rel.wrapper-child[data-id='${card.dataset.id}']`))
            openView(`div.nr-container.fl-col.rel.wrapper-child[data-id='${card.dataset.id}']`)
        }
    })
});


// ******************** General JS ********************
// General or Misc JS running on the page

// Declarations
const cuisineSel = document.querySelector('.cuisine');
const cuisineArr = ['Mexican', 'Italian', 'Indian', 'Cajun', 'Soul', 'Thai', 'Greek', 'Chinese', 'Lebanese', 'Japanese', 'American', 'Moroccan', 'Mediterranean', 'French', 'Spanish', 'German', 'Korean', 'Vietnamese', 'Turkish', 'Caribbean', 'British'];
const filterSel = document.querySelector('#filter')
const filterArr = ['Old', 'New', 'A-Z', 'Z-A', 'Cuisine', 'Author']
const ERROR = "Something went wrong!\nYou could try:\n- Entering a full recipe URL from a valid website.\n- Creating you're own recipe from scratch."

cuisineArr.sort()
filterArr.sort()

function fillOptions(arr, local) {
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

fillOptions(cuisineArr, cuisineSel);
if (filterSel) {
    fillOptions(filterArr, filterSel)
}

// ******************** Button JS ********************
// Gives functionality to the various buttons on the page.

// Declarations
const wrapper = document.querySelector('#wrapper'); // The wrapper is special div that holds floating windows.
var prevView = null; // prevView holds the previous view id so it can be closed when you open a new view.
const recCont = document.querySelector('#nr-container') // Container for new/edit recipe

function openView(view) { 
/*  openView opens the passed view by setting display back to default.
    openView also closes the previous view by saving the last view passed to it. 
*/
    let curView = document.querySelector(view); // Finds the current view element to open
    resetFields(view)

    if (prevView) { // Looks for a previous view and closes it if one is found.
        closeView(prevView);
        prevView = null
    }

    if (wrapper.classList.contains('hide')) { // Opens the wrapper div if it is closed.
        wrapper.classList.remove("hide");
    }

    prevView = view; // sets the new previous view for the next call of openView

    curView.classList.remove("hide"); // Opens the current view
}

function closeView(view, exit) {
/*  closeView closes the passed view by setting display to none.
    closeView will also close the wrapper if exit is passed in as true 
*/
    if (typeof view == 'string') {
        view = document.querySelector(view)
    }

    view.classList.add("hide"); // Closes the current view

    if (exit == true) { // Closes the wrapper div if the x button was used.
        wrapper.classList.add("hide");
    } 
}

if (wrapper) {
    wrapper.addEventListener('click', e => {
        if (e.target.id == 'wrapper') {
            wrapper.classList.add("hide");
            // document.querySelector('#wrapper > div:not(.hide)').classList.add("hide")
        }
    })
}

function resetFields(view) {
    const formReset = document.querySelector(`${view} form`)
    if (formReset) {
        formReset.reset()
    }
}

// Declarations
const submitURL = document.querySelector('#sub_URL')
const inputURL = document.querySelector('#in-url')
// const tempTA = document.querySelector('#temp-ta')

if (submitURL) {
    submitURL.addEventListener('click', e => {
    /*  Submits a URL to the webscraper
    */
        // let objArr = [];
        // let pointer = 0;
        let recipeURL = inputURL.value
        // let timer = setInterval(placeReplace, 750)

        // tempTA.classList.remove("hide")
        // tempTA.innerHTML = ''
        // closeView('#nr-select', true)

        // function placeReplace() {
        //     if (pointer == 0) {
        //         tempTA.placeholder = "Fetching data."
        //     } else if (pointer == 1) {
        //         tempTA.placeholder = "Fetching data.."
        //     } else {
        //         tempTA.placeholder = "Fetching data..."
        //         pointer = -1
        //     }
        //     pointer++
        // };
        fetchScraper(recipeURL)
    })
}

function editRecipe(id) {
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

if (newRecipeButton) {
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

function deleteRecipe(id) {
    /* id is equal to the unique id of the relevant recipe.
       This function should make it easy to delete both the card and the recipe when called.
    */
    // Cancles the function if the user does not confirm.
    if(!confirm('Are you sure you want to delete this recipe?')) return;
    
    // Request data be delete here
    fetchRemoveRecipe(id)
}

// ******************** Filter Options JS ********************
//js for filtering the recipe cards

const recipeArr = Array.from(document.querySelectorAll('.card'))
let currFilter = 'Old'

function changeFilter() {
    const newFilter = document.querySelector('#filter').value

    if (newFilter != currFilter) {
        switch (newFilter) {
            case 'Old':
                console.log('click')
                applySort(recipeArr)
                break;
            case 'New':
                applySort(recipeArr.reverse())
                break;
            case 'A-Z':
                alphabetical(recipeArr)
                break;
            case 'Z-A':
                reversAlphabetical(recipeArr)
                break;
            case 'Cuisine':
                cuisineSort(recipeArr)
                break;
            case 'Author':
                authorSort(recipeArr)
                break;
            default:
                break;
        }
        currFilter = newFilter
    }
}

function alphabetical(items) {
    items.sort(function(a, b) {
        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
    applySort(items)
}

function reversAlphabetical(items) {
    items.sort(function(a, b) {
        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }

        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }
        return 0
    });
    applySort(items)
}

function cuisineSort(items) {
    items.sort(function(a, b) {
        if(a.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase() > b.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase() < b.children[1].children[1].firstElementChild.children[1].innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
    applySort(items)
}

function authorSort(items) {
    items.sort(function(a, b) {
        if(a.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
    applySort(items)
}

function applySort (items) {
    items.forEach(item => {
        document.querySelector('#main-left').appendChild(item);
    });
}

changeFilter()

// ******************** Fetch Request JS ********************
// Contains all Fetch() requests performed on list.hbs

function fetchCreateRecipe(recipeObj) {
    fetch('/recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeObj)
    }).then((response) => response.json()).then((data) => {
        if (!data.error) {
            console.log("Recipe created successfully")
            window.location.replace("/list")
        } else {
            console.log(data.message)
            alert("Recipe creation failed!")
        }
    }).catch((error) => {
        console.error(error)
        alert("Recipe creation failed!")
    })
}

function fetchRemoveRecipe(id) {
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

function fetchScraper(newURL) {
    fetch('/scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newURL})
    })
    .then((response) => response.json() )
    .then((data) => {
        if (!data.error) {
            fetchCreateRecipe(data.results)
        } else {
            console.log(data.message)
            alert(ERROR)
        }
    })
    .catch((error) => {
        console.error(error)
        alert(ERROR)
    })
}

function fetchEditRecipe(recipeObj, id) {
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