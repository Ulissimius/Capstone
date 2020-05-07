// ******************** Title Sections with this template comments ********************
// Example:
// ******************** Recipe Card JS ********************
// This JS handles filling out the data for the recipe cards.

// ******************** Test JS ********************
// For testing purposes
recipeURL = 'https://www.fifteenspatulas.com/crispy-baked-chicken-wings-yup-no-deep-fryer-in-sight/'
recipeURL2 = 'https://www.allrecipes.com/recipe/245362/chef-johns-shakshuka/?internalSource=user%20pref&referringContentType=Homepage'
fetch('/scraper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({recipeURL})
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
// fetch('https://cors-anywhere.herokuapp.com/https://www.allrecipes.com/recipe/16822/cake-mix-cinnamon-rolls/')
// .then(response => response.text())
// .then(data => {
//     // console.log(data)
//     scrapeData(data) //Search Ingredients
// });
// const testextarea = document.getElementById('testtextarea')
// function scrapeData(info) {
//     const allRecipesObj = {
//         "layout_1": {
//             "regExTitle": /<h1 class="headline heading-content">([\s\S]*?)<\/h1>/g,
//             "regExAuth": /<a class="author-name link"[\s\S]*?>([\s\S]*?)<\/a>/g,
//             "regExPrep": /prep:[\s\S]*?<div class="recipe-meta-item-body" >([\s\S]*?)<\/div>/g,
//             "regExCook": /cook:[\s\S]*?<div class="recipe-meta-item-body" >([\s\S]*?)<\/div>/g,
//             "regExServ": /Servings:[\s\S]*?<div class="recipe-meta-item-body" >([\s\S]*?)<\/div>/g,
//             "regExCuis": null,
//             "regExIng": /<span class="ingredients-item-name">([\s\S]*?)<\/span>/g,
//             "regExDir": /<div class="section-body">[\s\S]*?<p>([\s\S]*?)<\/p>/g,
//             "regExNote": /<div class="recipe-note container">[\s\S]*?<p>([\s\S]*?)<\/p>/g
//         },
//         "layout_2": {
//             "regExTitle": /<h1 id="recipe-main-content" class="recipe-summary__h1" itemprop="name">([\s\S]*?)<\/h1>/g,
//             "regExAuth": /<span class="submitter__name" itemprop="author">([\s\S]*?)<\/span>/g,
//             "regExPrep": /p/g,
//             "regExCook": /c/g,
//             "regExServ": /S/g,
//             "regExCuis": /S/g,
//             "regExIng": /</g,
//             "regExDir": /</g,
//             "regExNote": /</g
//         }
//     }
//     regExIng = /<span class="ingredients-item-name">([\s\S]*?)<\/span>/g
//     regExDir = /<div class="section-body">[\s\S]*?<p>([\s\S]*?)<\/p>/g
//     regExNote = /<div class="recipe-note container">[\s\S]*?<p>([\s\S]*?)<\/p>/g
//     regExPrep = /prep:[\s\S]*?<div class="recipe-meta-item-body" >([\s\S]*?)<\/div>/g
//     regExCook = /cook:[\s\S]*?<div class="recipe-meta-item-body" >([\s\S]*?)<\/div>/g
//     regExServ = /Servings:[\s\S]*?<div class="recipe-meta-item-body" >([\s\S]*?)<\/div>/g
//     regExCuis = null
//     regExTitle = /<h1 class="headline heading-content">([\s\S]*?)<\/h1>/g
//     regExAuth = /<a class="author-name link"[\s\S]*?>([\s\S]*?)<\/a>/g
//     regExArr = [[regExTitle, '- Title:\n'], [regExAuth, '- Author:\n'], [regExPrep, '- Prep Time:\n'], [regExCook, '- Cook Time:\n'], [regExServ, '- # of Servings:\n'], 
//     [regExCuis, '- Cuisine:\n'], [regExIng, '- Ingredients:\n'], [regExDir, '- Directions:\n'], [regExNote, '- Notes:\n']]

//     regExArr.forEach(regEx => {
//         if (regEx[0] != null) {
//             let dataArr = info.matchAll(regEx[0])
//             dataArr = Array.from(dataArr)
//             console.log(regEx[1])
//             // console.log(dataArr)
//             // console.log(regEx[0])

//             if (dataArr.length > 0) {
//                 dataArr.forEach(elem => {
//                     elem[1] = elem[1].replace(/\n/, '')
//                     elem[1] = elem[1].trim()

//                     console.log(elem[1]) // This is where dataArr would be saved to the DB or stored for later
//                     testextarea.append(elem[1]+'\n') 
//                 });
//             } else {
//                 console.log('**********\nEmpty array found: skipping.\n**********')
//             }
//         } else {
//             console.log(regEx[1] + "\n**********\nNull found: skipping.\n**********")
//         }
//     });
// }

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