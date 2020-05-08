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
const cusineArr = ['Mexican', 'Italian', 'Indian', 'Cajun', 'Soul', 'Thai', 'Greek', 'Chinese', 'Lebanese', 'Japanese', 'American', 'Moroccan', 'Mediterranean', 'French', 'Spanish', 'German', 'Korean', 'Vietnamese', 'Turkish', 'Caribbean', 'British'];
const unitSel = document.querySelector('.units');
const unitArr = ['tsp','Tbsp','fl oz','cup','pt','qt','gal','Gill','ml','l','oz','lb','pk','bu','g','drops','dash','grains','pinch']
const ERROR = "Something went wrong! You could try:\n- Entering a full recipe URL from a valid website.\n- Creating you're own recipe from scratch. (Saving recipes not implemented yet.)"

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
const tempTA = document.querySelector('#temp-ta')

subURL.addEventListener('click', e => {
/*  Submits a URL for the webscraper code 
*/
    let objArr = [];
    let pointer = 0;
    let recipeURL = inputURL.value
    let timer = setInterval(placeReplace, 750)

    tempTA.classList.remove("hide")
    tempTA.innerHTML = ''
    closeView('#nr-select', true)

    function placeReplace() {
        if (pointer == 0) {
            tempTA.placeholder = "Fetching data."
        } else if (pointer == 1) {
            tempTA.placeholder = "Fetching data.."
        } else {
            tempTA.placeholder = "Fetching data..."
            pointer = -1
        }
        pointer++
    };

    fetch('/scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({recipeURL})
    })
    .then((response) => response.json() )
    .then((data) => {
        console.log(data)
        if (data.error != true) {
            let output = ''
            objArr = Object.keys(data.results)
            Object.values(data.results).forEach((e, i) => {
                if (e == null) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `${objArr[i]}: Not Found\n`
                } else if (i == 0 || i == 1) {
                } else if (i == 2) {
                    output = '*************************************************************\nThis is placeholder until we get database insertion in place!\n*************************************************************\n'
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Title: ${e}\n`
                } else if (i == 3) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Author: ${e}\n`
                } else if (i == 4) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Prep Time: ${e}\n`
                } else if (i == 5) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Cook Time: ${e}\n`
                } else if (i == 6) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Servings: ${e}\n`
                } else if (i == 7) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Cuisine: ${e}\n`
                } else if (i == 8) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Ingredients:\n`
                    e.forEach(ing => {
                        output += `- ${ing}\n`
                    });
                } else if (i == 9) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Directions:\n`
                    e.forEach((dir, i) => {
                        output += `${i+1}. ${dir}\n`
                    });
                } else if (i == 10) {
                    output += '----------------------------------------------------------------------------------------------------\n'
                    output += `Notes:\n`
                    if (!Array.isArray(e)) {
                        output += `${e}\n`
                        output += '----------------------------------------------------------------------------------------------------\n'
                    } else {
                        e.forEach(note => {
                            output += `${note}\n`
                        });
                        output += '----------------------------------------------------------------------------------------------------\n'
                    }
                } else {
                    console.log(`Something went wrong. e: ${e} | i: ${i}`)
                }
            });
            tempTA.innerHTML = output
            tempTA.style.height = tempTA.scrollHeight + 'px'
        } else {
            tempTA.innerHTML = ERROR
        }
        clearInterval(timer)
    })
    .catch((error) => {
        console.error(error)
        tempTA.innerHTML = ERROR
    })
})