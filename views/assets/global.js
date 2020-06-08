function isEmptyObj(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function logout() {
    document.cookie = "authentication=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    window.location.replace("/")
}

function deleteNode(node) {
    node.remove();
}

function cleanUpText(text) {
    try {
        if (typeof text === 'undefined' || isEmptyObj(text) || text.length === 0 || text === null || text === '') return text = 'N/A';

        let returnArr = []

        if (Array.isArray(text)) {
            let newText = []

            text.forEach(e => {
                if (typeof e === 'object') {
                    cleanUpText(e)
                    if (e === 'N/A') newText.push(e);
                } else {
                    if (typeof e === 'undefined' || isEmptyObj(e) || e.length === 0 || e === null || e === '') {
                        e = 'N/A'
                    } else {
                        e = e.trim()
                        e = e.replace(/  +/g, ' ')
                        e = e.replace(/\xa0/g, ' ')
                    }
                    newText.push(e)
                }
            });

            returnArr = newText
        } else if (typeof text == 'object') {
            let keys = Object.keys(text)
            Object.values(text).forEach((val, i) => {
                if (typeof val === 'object') {
                    cleanUpText(val)
                    if (val === 'N/A') text[keys[i]] = val;
                } else {
                    if (typeof val === 'undefined' || isEmptyObj(val) || val.length === 0 || val === null || val === '') {
                        val = 'N/A'
                    } else {
                        val = val.trim()
                        val = val.replace(/  +/g, ' ')
                        val = val.replace(/\xa0/g, ' ')
                    }
                    text[keys[i]] = val
                }
            });
        } else {
            text = text.trim()
            text = text.replace(/  +/g, ' ')
            text = text.replace(/\xa0/g, ' ')
        }

        if (Array.isArray(text)) {
            return returnArr
        } else {
            return text
        }
    } catch (error) {
        console.error(error)
        console.log(text)
        console.log(newText)
    }
}

const wrapper = document.querySelector('#wrapper'); // The wrapper is special div that holds floating windows.
var prevView = null; // prevView holds the previous view id so it can be closed when you open a new view.
const stopScroll = document.querySelector('body')

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

    stopScroll.style.overflow = 'hidden'

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
    stopScroll.style.overflow = 'auto'
    if (typeof view == 'string') {
        view = document.querySelector(view)
    }

    if (view) {
        view.classList.add("hide"); // Closes the current view
    }

    if (exit == true) { // Closes the wrapper div if the x button was used.
        wrapper.classList.add("hide");
    } 
}

document.querySelectorAll('.card').forEach(card => { // ##A1F1
    card.addEventListener('click', e => {
        if (e.target.nodeName != 'IMG') {
            openView(`div.nr-container.fl-col.rel.wrapper-child[data-id='${card.dataset.id}']`)
        }
    })
});

if (wrapper) { // ##A2F2
    wrapper.addEventListener('click', e => {
        if (e.target.id == 'wrapper') {
            closeView('#wrapper')
        }
    })
}

function resetFields(view) { // ##A2F3
    const formReset = document.querySelector(`${view} form`)
    if (formReset) {
        formReset.reset()
    }

    images = { // Reset image to default if window was closed but not submitted
        large: 'https://i.ibb.co/xJhWBQz/e1e674b44610.jpg',
        medium: 'https://i.ibb.co/J5nVGPr/e1e674b44610.jpg',
        thumb: 'https://i.ibb.co/3B12jHS/e1e674b44610.jpg' 
    }

    if (typeof recCont !== 'undefined') {
        recCont.dataset.edit = ''
        recCont.dataset.name = ''
        document.querySelector('#nr-he').style.backgroundImage = 'url("' + images.large + '")'
    }
}

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
            if (window.location.pathname == '/list') {
                alert("Recipe Created Successfully!\nThe page will now reload.")
                window.location.replace("/list")
            } else {
                alert("Recipe Copied Successfully!")
            }
        } else {
            console.error(data.error)
            alert("Recipe creation failed!")
        }
    }).catch((error) => {
        console.error(error)
        alert("Recipe creation failed!")
    })
}

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
    var sortDirection = document.querySelector('#filter-direction').value
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

function directionBtnValue(elem) {
    if (elem.value == 'Des ∨') {
        elem.value = 'Asc ∧'
    } else {
        elem.value = 'Des ∨'
    }
}

function changeDirection(recipes, elemValue) { // ##A3F1
    if(elemValue == 'Des ∨') {
        recipes.reverse()
    } else {
        recipes.sort()
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

var images = {
    large: 'https://i.ibb.co/xJhWBQz/e1e674b44610.jpg',
    medium: 'https://i.ibb.co/J5nVGPr/e1e674b44610.jpg',
    thumb: 'https://i.ibb.co/3B12jHS/e1e674b44610.jpg' 
}

/** 
 * Knocked out webscraper img support. It not works in all my test cases, but likely is not fool-proof.
 * To do:
 * Pass images to edit recipe view
 * Make sure create/edit recipe work when uploading for the image.
 * Currently setting in img (create, probably edit too) and submitting data causes an error. Try breaking up the fetchUploadImg() func to block sumbitting until it is finished.
*/

function fetchUploadImg(img) { // ##A4F0
    fetch('/uploadImg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({img})
    }).then((response) => response.json()).then((data) => {
        if (!data.error) {
            images = {
                large: data.data.data.image.url,
                thumb: data.data.data.thumb.url
            }
        } else {
            console.error(data.error)
        }
    }).catch((error) => {
        console.error(error)
    })
}

function  trimTitle() {
    var titleLen = document.querySelectorAll('.ctl h3:first-child')
    for (let i = 0; i < Object.keys(titleLen).length; i++) {
        console.log(titleLen[i].innerText.length)
        if (titleLen[i].innerText.length > 100) {
            titleLen[i].innerText = titleLen[i].innerText.substring(0, 100) + '...'
        }
        
    }
}