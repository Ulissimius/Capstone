// ******************** Title Sections with this template comments ********************
// Example:
// ******************** Recipe Card JS ********************
// This JS handles filling out the data for the recipe cards.

// ******************** Test JS ********************
// For testing purposes
const subURL = document.querySelector('#sub_URL')

subURL.addEventListener('click', e => {
    const inputURL = document.querySelector('#in-url')
    let recipeURL = inputURL.value

    fetch('/scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({recipeURL})
    })
    .catch((err) => {console.log(err)})
})

//Don't forget to save the URL
//Match URL to regEx
//Some websites have multiple layouts. Make objects that hold site/layout data.
/* const allrecipesObj = {
    layout_1: {
        regExIng: /.../g,
        regExDir: /.../g,
        ...
    },
    layout_2: {
        regExIng: /.../g,
        regExDir: /.../g,
        ...
    }
} 
Then put an if that tries to find ingredients with each layout.
If ingredients are found, then it stops and continues the rest of the function.*/

// ******************** General JS ********************
// General or Misc JS running on the page

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

addBtn.addEventListener('click', e => {
    /* addBtn click listener clones an existing element (in the footer) that allows
    the user to input ingredients. */

    cloneIngHTML = ingredientHTML.cloneNode(true);
    target[0].insertAdjacentElement('beforebegin', cloneIngHTML);
});