// Add JS here
// let creRecView = document.querySelector(); //Creating a new recipe
// let oldRecView = document.querySelector(); //Viewing a saved recipe
// let selRecView = document.querySelector('#nr-select'); //Choosing how to create a recipe
function openView(view) {
    //if view is already open, do not open again.
    let curView = document.querySelector(view); // Dynamically choose a view
    curView.style.display = ""
}

function closeView(view) {
    //if view is closed, do not close again.
}

// Test Button JS
var tButt = document.querySelector('#test-butt');
var reveal = document.querySelectorAll('.click-me');
var x = 0;

tButt.addEventListener('click', e => {
    if (x == 0) {
        reveal[3].style.display = "none";
        reveal[0].style.display = "block";
        console.log(x);
        x++;
    } else if (x == 1) {
        reveal[0].style.display = "none";
        reveal[1].style.display = "block";
        console.log(x);
        x++;
    } else if (x == 2) {
        reveal[1].style.display = "none";
        reveal[2].style.display = "block";
        console.log(x);
        x++;
    } else if (x == 3) {
        reveal[2].style.display = "none";
        reveal[3].style.display = "block";
        console.log(x);
        x = 0;
    }
});