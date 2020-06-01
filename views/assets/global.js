function logout() {
    document.cookie = "authentication=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    window.location.replace("/")
}

function deleteNode(node) {
    node.remove();
}

function cleanUpText(text) {
    try {
        if (text == {} || text == [] || text == null || text == '') return text = 'N/A';

        if (typeof text == 'array') {
            let newText = []

            text.forEach(e => {
                if (typeof e == 'array' || typeof e == 'object') {
                    cleanUpText(e)
                    if (e == 'N/A') newText.push(e);
                } else {
                    if (e == {} || e == [] || e == null || e == '') {
                        e = 'N/A'
                    } else {
                        e = e.trim()
                        e = e.replace(/  +/g, ' ')
                    }
                    newText.push(e)
                }
            });
        } else if (typeof text == 'object') {
            let keys = Object.keys(text)
            Object.values(text).forEach((val, i) => {
                if (typeof val == 'array' || typeof val == 'object') {
                    cleanUpText(val)
                    if (val == 'N/A') text[keys[i]] = val;
                } else {
                    if (val == {} || val == [] || val == null || val == '') {
                        val = 'N/A'
                    } else {
                        val = val.trim()
                        val = val.replace(/  +/g, ' ')
                    }
                    text[keys[i]] = val
                }
            });
        } else {
            text = text.trim()
            text = text.replace(/  +/g, ' ')
        }

        if (typeof text == 'array') {
            return newText
        } else {
            return text
        }
    } catch (error) {
        console.error(error)
        console.log(text)
    }
}

const wrapper = document.querySelector('#wrapper'); // The wrapper is special div that holds floating windows.
var prevView = null; // prevView holds the previous view id so it can be closed when you open a new view.

function openView(view) { // ##A2F0
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
    
function closeView(view, exit) { // ##A2F1
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

document.querySelectorAll('.card.flex').forEach(card => { // ##A1F1
    card.addEventListener('click', e => {
        if (e.target.nodeName != 'IMG') {
            openView(`div.nr-container.fl-col.rel.wrapper-child[data-id='${card.dataset.id}']`)
        }
    })
});

if (wrapper) { // ##A2F2
    wrapper.addEventListener('click', e => {
        if (e.target.id == 'wrapper') {
            wrapper.classList.add("hide");
        }
    })
}

function resetFields(view) { // ##A2F3
    const formReset = document.querySelector(`${view} form`)
    if (formReset) {
        formReset.reset()
    }
}

var favoriteArr = [] // This is the array of favorite recipes collected on page load
var updateFavArr = [] // This is the array that gets checked against on page exit/refresh
var favDidRun = false;
window.addEventListener('load', () => {
    fetch('/getFavorites')
    .then((response) => response.json())
    .then((data) => {
        if (data.error == true) {
            console.error(data.error)
        } else {
            favoriteArr = Array.from(data.favorites)
            favoriteOnLoad(Array.from(document.querySelectorAll('[data-favorite]')))
            let newObj = JSON.parse(JSON.stringify(data.favorites))
            updateFavArr = Array.from(newObj)
        }
    }).catch((e) => {
        console.log(e)
        console.error('Unable to fetch favorite data.')
    })
})

function favoriteOnLoad(stars) {
    stars.forEach(setFav => {
        isFav = (setFav.dataset.favorite === 'true')
        if (isFav == true) {
            // Switch to full star
            setFav.src = '/assets/images/star-24px.svg'
        }
    });
}

function favoriteRecipe(elem, id) {
    // If you click this it updates the DB with favorite = true
    // If you click it again it updates the DB with favorite = false
    // On page load if favorite = true star loads filled in
    // Store fav recipes until page exit/reload then update the db based on changes.
    isFav = (elem.dataset.favorite === 'true')
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

window.addEventListener("beforeunload", function(e){
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


// ******************** Filter Select Populate (##A3) ********************

const sortSel = document.querySelector('#sortList')
const sortArr = ['Date Added', 'Alphabetical', 'Cuisine', 'Author']

function fillOptions(arr, local) {
    arr.forEach(elem => {
        let newOp = document.createElement('option');
        newOp.value = elem;
        newOp.innerHTML = elem;

        local.append(newOp);
    });
}

sortArr.sort()

if(sortSel) {
    fillOptions(sortArr, sortSel)
}


// ******************** Filter Options JS (##A3) ********************
//js for filtering the recipe cards

var recipeArr = Array.from(document.querySelectorAll('.card'))
const contBody = document.querySelector('#main-left')

function applyFilters() {
    contBody.innerHTML = ''
    
    var recipes = Array.from(recipeArr)
    var sortMethod = document.querySelector('#sortList').value
    var sortDirection = document.querySelector('#filter-direction')
    var favoritesOnly = document.querySelector('#favorite').checked

    switch (sortMethod) {
        case 'Date Added':
            dateSort(recipes, sortMethod)
            break;
        case 'Alphabetical':
            alphabeticalSort(recipes, sortMethod)
            break;
        case 'Cuisine':
            cuisineSort(recipes, sortMethod)
            break;
        case 'Author':
            authorSort(recipes, sortMethod)
            break;
        default:
            break;
    }
    
    changeDirection(recipes, sortDirection)

    if(favoritesOnly) {
        favoriteSort(recipes)
    }

    recipes = buildFilterListAlpha(recipes, pathBuilder(recipes, sortMethod))
    applySort(recipes)
    
}

function directionBtnValue() {
    let btnValue = document.querySelector('#filter-direction').value

    if (btnValue == 'Filter ∨') {
        document.querySelector('#filter-direction').value = 'Filter ∧'
    } else {
        document.querySelector('#filter-direction').value = 'Filter ∨'
    }
}

function changeDirection(recipes) { // ##A3F1
    let elemValue = document.querySelector('#filter-direction').value

    if(elemValue == 'Filter ∨') {
        recipes.sort(function(a, b) {
            if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
                return 1
            }
    
            if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
                return -1
            }
            return 0
        });
    } else {
        recipes.sort(function(a, b) {
            if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
                return 1
            }
    
            if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
                return -1
            }
            return 0
        });
    }
}

function favoriteSort(recipes) {
    let recipeCopy = Array.from(recipes)
    let i = 0
    recipeCopy.forEach(element => {
        if (element.children[1].firstElementChild.children[1].firstElementChild.dataset.favorite != 'true') {
            recipes.splice(i, 1)
        } else {
            i++
        }
    });
}

function alphabeticalSort(items) { // ##A3F2
    items.sort(function(a, b) {
        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
}

function cuisineSort(items) { // ##A3F3
    items.sort(function(a, b) {
        if(a.children[1].children[1].children[1].children[3].innerText.toLowerCase() > b.children[1].children[1].children[1].children[3].innerText.toLowerCase()) {
            return 1
        }
        
        if(a.children[1].children[1].children[1].children[3].innerText.toLowerCase() < b.children[1].children[1].children[1].children[3].innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
}

function authorSort(items) { // ##A3F4
    items.sort(function(a, b) {
        if(a.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase() > b.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return 1
        }

        if(a.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase() < b.children[1].children[1].firstElementChild.firstElementChild.innerText.toLowerCase()) {
            return -1
        }
        return 0
    });
}

function dateSort(items) { // ##A3F5
    items.sort(function(a, b) {
        if(a.dataset.date > b.dataset.date) {
            return 1
        }

        if(a.dataset.date < b.dataset.date) {
            return -1
        }
        return 0
    });
}

function applySort (items) { // ##A3F7
    items.forEach(item => {
        contBody.appendChild(item);
    });
}

function pathBuilder(pathArr, filter) { // ##A3F8
    /* Returns an array of all relative reference paths for the current filter */
    let newPathArr = []

    switch (filter) {
        case 'Date Added':
            pathArr.forEach(path => {
                const dateArr = path.dataset.date.toUpperCase().trim().split('-')
                let month = ''
                switch (dateArr[1]) {
                    case '1':
                        month = 'January'
                        break;
                    case '2':
                        month = 'February'
                        break;
                    case '3':
                        month = 'March'
                        break;
                    case '4':
                        month = 'April'
                        break;
                    case '5':
                        month = 'May'
                        break;
                    case '6':
                        month = 'June'
                        break;
                    case '7':
                        month = 'July'
                        break;
                    case '8':
                        month = 'August'
                        break;
                    case '9':
                        month = 'September'
                        break;
                    case '10':
                        month = 'October'
                        break;
                    case '11':
                        month = 'November'
                        break;
                    case '12':
                        month = 'December'
                        break;
                    default:
                        break;
                }
                let fulldate = ''
                fulldate = fulldate.concat(month, ' ', dateArr[2], ', ', dateArr[0])
                newPathArr.push(fulldate.trim())
            });
            break;
        case 'Alphabetical':
            pathArr.forEach(path => {
                newPathArr.push(path.children[1].firstElementChild.firstElementChild.innerText.toUpperCase().trim().charAt())
            });
            break;
        case 'Cuisine':
            pathArr.forEach(path => {
                newPathArr.push(path.children[1].children[1].children[1].children[3].innerText.toUpperCase().trim().charAt(9))
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

function buildFilterListAlpha(arr, path) { // ##A3F9
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

applyFilters()