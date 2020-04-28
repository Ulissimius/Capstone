// Add JS here
// let creRecView = document.querySelector(); //Creating a new recipe
// let oldRecView = document.querySelector(); //Viewing a saved recipe
// let selRecView = document.querySelector('#nr-select'); //Choosing how to create a recipe
let testView = '';
const wrapper = document.querySelector('#rp-wrapper');
wrapper.parentElement.id
function openView(view) {
    //if view is already open, do not open again.
    if (testView != '') {
        closeView(testView);
    }
    testView = view;

    if (wrapper.style.display == "none") {
        wrapper.style.display = "";
    }
    let curView = document.querySelector(view); // Dynamically choose a view
    curView.style.display = "";
}

function closeView(view, exit) {
    //if view is closed, do not close again.
    let curView = document.querySelector(view); // Dynamically choose a view
    curView.style.display = "none";
    if (exit == true) {
        wrapper.style.display = "none"     
    } 
}

// Test Button JS
var tButt = document.querySelector('#test-butt');
var reveal = document.querySelectorAll('.click-me');
var x = 0;