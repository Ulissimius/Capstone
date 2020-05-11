// ******************** Title Sections with this template comments ********************
// Example:
// ******************** Recipe Card JS ********************
// This JS handles filling out the data for the recipe cards.

// ******************** General JS ********************
// General or Misc JS running on the page

fetch('/list', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => response.json()).then((data) => {
    if (!data.error) {
        console.log(data.data)
        console.log("Recipes loaded succesfully")
    } else {
        console.log(`Error loading Recipes: ${data.message}`)
    }
}).catch((error) => {
    console.error(error)
})

// Declarations
const cuisineSel = document.querySelector('.cuisine');
const cusineArr = ['Mexican', 'Italian', 'Indian', 'Cajun', 'Soul', 'Thai', 'Greek', 'Chinese', 'Lebanese', 'Japanese', 'American', 'Moroccan', 'Mediterranean', 'French', 'Spanish', 'German', 'Korean', 'Vietnamese', 'Turkish', 'Caribbean', 'British'];
const unitSel = document.querySelector('.units');
const unitArr = ['tsp','Tbsp','fl oz','cup','pt','qt','gal','Gill','ml','l','oz','lb','pk','bu','g','drops','dash','grains','pinch']

cusineArr.sort()

function fillOptions(arr, local) {
    arr.forEach(elem => {
        let newOp = document.createElement('option');
        newOp.value = elem;
        newOp.innerHTML = elem;

        local.append(newOp);
    });

    if (arr == cusineArr) {
        let newOp = document.createElement('option');
        newOp.value = 'other';
        newOp.innerHTML = 'Other';
        newOp.selected = true;

        local.append(newOp);
    }
}

fillOptions(cusineArr, cuisineSel);
fillOptions(unitArr, unitSel);

// ******************** Button JS ********************
// Gives functionality to the various buttons on the page.

// Declarations
const wrapper = document.querySelector('#wrapper'); // The wrapper is special div that holds floating windows.
let prevView = null; // prevView holds the previous view id so it can be closed when you open a new view.

function openView(view) { 
    /* openView opens the passed view by setting display back to default.
    openView also closes the previous view by saving the last view passed to it. */

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
    /* closeView closes the passed view by setting display to none.
    closeView will also close the wrapper if exit is passed in as true */

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
    /* addBtn click listener clones an existing element (in the footer) that allows
    the user to input ingredients. */

    cloneIngHTML = ingredientHTML.cloneNode(true);
    target[0].insertAdjacentElement('beforebegin', cloneIngHTML);
});

if (newRecipeButton) {
    newRecipeButton.addEventListener('click', e => {
        e.preventDefault()
    
        const title = document.querySelector('#name').value
        const author = document.querySelector('#author').value
        const url = document.querySelector('#url').value
        const prep = document.querySelector("input[name='prep_time']").value
        const cooking = document.querySelector("input[name='cook_time']").value
        const servings = document.querySelector("input[name='servings']").value
        const cuisine = document.querySelector("select[name='cuisine']").value
        const directions = document.querySelector("textarea[name='directions']").value
        const notes = document.querySelector("textarea[name='notes']").value
        const amountObj = document.querySelectorAll("input[name='amount']")
        const unitObj = document.querySelectorAll("select[name='unit']")
        const nameObj = document.querySelectorAll("input[name='name']")
        
        const amount = []
        const unit = []
        const name = []
        for (let i = 0; i < nameObj.length - 1; i++) {
            amount.push(amountObj[i].value)
            unit.push(unitObj[i].value)
            name.push(nameObj[i].value)
        }

        console.log(amount)
        console.log(unit)
        console.log(name)
    
        if (title && author && directions) {
            fetch('/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, author, url, prep, cooking, servings, cuisine, amount, unit, name, directions, notes})
            }).then((response) => response.json()).then((data) => {
                if (!data.error) {
                    console.log("Recipe created successfully")
                } else {
                    console.log(`Error creating Recipe: ${data.message}`)
                }
            }).catch((error) => {
                console.error(error)
            })
        } else {
            // Maybe eventually use this section to display a message on screen to fill out required information
        }
    })
}