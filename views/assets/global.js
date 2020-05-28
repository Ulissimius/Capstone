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
            console.log(data.message)
            alert("Recipe creation failed!")
        }
    }).catch((error) => {
        console.error(error)
        alert("Recipe creation failed!")
    })
}