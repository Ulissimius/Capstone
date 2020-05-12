

// ******************** Title Sections with this template comments ********************
// Example:
// ******************** Recipe Card JS ********************
// This JS handles filling out the data for the recipe cards.

// ******************** Test JS ********************
// For testing purposes

// ******************** General JS ********************
// General or Misc JS running on the page

// Declarations
const cuisineSel = document.querySelector('.cuisine');
const cuisineArr = ['Mexican', 'Italian', 'Indian', 'Cajun', 'Soul', 'Thai', 'Greek', 'Chinese', 'Lebanese', 'Japanese', 'American', 'Moroccan', 'Mediterranean', 'French', 'Spanish', 'German', 'Korean', 'Vietnamese', 'Turkish', 'Caribbean', 'British'];
const unitSel = document.querySelector('.units');
const unitArr = ['tsp','Tbsp','fl oz','cup','pt','qt','gal','Gill','ml','l','oz','lb','pk','bu','g','drops','dash','grains','pinch']
const ERROR = "Something went wrong! You could try:\n- Entering a full recipe URL from a valid website.\n- Creating you're own recipe from scratch."

cuisineArr.sort()

function fillOptions(arr, local) {
    arr.forEach(elem => {
        let newOp = document.createElement('option');
        newOp.value = elem;
        newOp.innerHTML = elem;

        local.append(newOp);
    });

    if (arr == cuisineArr) {
        let newOp = document.createElement('option');
        newOp.value = 'other';
        newOp.innerHTML = 'Other';
        newOp.selected = true;

        local.append(newOp);
    }
}

fillOptions(cuisineArr, cuisineSel);
fillOptions(unitArr, unitSel);

// ******************** Button JS ********************
// Gives functionality to the various buttons on the page.

// Declarations
const wrapper = document.querySelector('#wrapper'); // The wrapper is special div that holds floating windows.
let prevView = null; // prevView holds the previous view id so it can be closed when you open a new view.

function openView(view) { 
/*  openView opens the passed view by setting display back to default.
    openView also closes the previous view by saving the last view passed to it. 
*/
    let curView = document.querySelector(view); // Finds the current view element to open

    if (wrapper.style.display == "none") { // Opens the wrapper div if it is closed.
        wrapper.style.display = "";
    }

    if (prevView) { // Looks for a previous view and closes it if one is found.
        closeView(prevView);
    }

    prevView = view; // sets the new previous view for the next call of openView

    curView.style.display = ""; // Opens the current view
}

function closeView(view, exit) {
/*  closeView closes the passed view by setting display to none.
    closeView will also close the wrapper if exit is passed in as true 
*/
    let curView = document.querySelector(view); // Finds the current view element to close

    curView.style.display = "none"; // Closes the current view

    if (exit == true) { // Closes the wrapper div if the x button was used.
        wrapper.style.display = "none";
    } 
}

// Declarations
const addBtn = document.querySelector('.add-elem'); // The click listener target
const target = document.querySelectorAll('.target'); // The position to prepend cloned elements to
const ingredientHTML = document.querySelector('.li-div.flex'); // The HTML to be cloned.
const newRecipeButton = document.querySelector('#post-recipe')

addBtn.addEventListener('click', e => {
/*  addBtn click listener clones an existing element (in the footer) that allows
    the user to input ingredients. 
*/
    cloneIngHTML = ingredientHTML.cloneNode(true);
    target[0].insertAdjacentElement('beforebegin', cloneIngHTML);
});


// Declarations
// Don't forget to save the URL
const subURL = document.querySelector('#sub_URL')
const inputURL = document.querySelector('#in-url')
// const tempTA = document.querySelector('#temp-ta')

subURL.addEventListener('click', e => {
/*  Submits a URL for the webscraper code 
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
        const amountObj = document.querySelectorAll("input[name='amount']")
        const unitObj = document.querySelectorAll("select[name='unit']")
        const nameObj = document.querySelectorAll("input[name='name']")
        const ingredientArr = []

        for (let i = 0; i < nameObj.length - 1; i++) {
            ingredientArr.push((`${amountObj[i]} ${unitObj[i]} ${nameObj[i]}`).toString())
        }

        const cleanObj = cleanUpText({title, author, url, prep_time, cook_time, servings, cuisine, ingredientArr, directions, notes})
        if (title && author && directions && ingredientArr) {
            fetchCreateRecipe(cleanObj)
        } else {
            alert('Recipes must have:\n- A Title\n- An Author\n- At Least 1 Ingredient\n- Directions')
        }
    })
}

function editRecipe(id) {
    // Edit the existing recipe
    console.log(id)
}

function deleteRecipe(id) {
    /* id is equal to the unique id of the relevant recipe.
       This function should make it easy to delete both the card and the recipe when called.
    */

    // Cancles the function if the user does not confirm.
    if(!confirm('Are you sure you want to delete this recipe?')) return;
    
    let parent = document.querySelector(`[data-id*="${id}"]`)
    parent.remove()

    // Request data be delete here
    fetchRemoveRecipe(id)
}

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