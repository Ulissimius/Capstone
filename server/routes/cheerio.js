const cheerio = require('cheerio'); // Stages data in a DOM structure, allows jQuery parsing of data.
const psl = require('psl'); // Takes in a domain name and parses it.

function doItAgain(data, url) {
/*  doItAgain(data[Text HTML], url[URL])
    Takes in the HTML data from the URL and parses key data using the Supported Website(sws) object.
*/
    const $ = cheerio.load(data); // Cheerio stages the data for parsing
    const hostname = (new URL(url)).hostname; // Shortens the URL to just the hostname (https://www.website.com/page1/content -> www.website.com)
    const parse = psl.parse(hostname); // Parses the hostname and returns an object of all pieces of the hostname.
    const parsed_URL = parse.sld;
    
    // console.log(parse.tld); // 'com'
    // console.log(parse.sld); // 'google'
    // console.log(parse.domain); // 'google.com'
    // console.log(parse.subdomain); // 'www' */

    let sws = { // Object collection of supported websites this function can parse. 
        allrecipes: {
            layout_1: {
                title: ($('h1.headline.heading-content').text()).trim(),
                author: ($('.author-name:not(.author-name-title)').text()).trim(),
                prep_time: ($('div.recipe-meta-item-header:contains(prep:)').next().text()).trim(),
                cook_time: ($('div.recipe-meta-item-header:contains(cook:)').next().text()).trim(),
                servings: ($('div.recipe-meta-item-header:contains(Servings:)').next().text()).trim(),
                cuisine: null,
                ingredients: getArray('span.ingredients-item-name'),
                directions: getArray('div.section-body > p'),
                notes: ($('span.icon.icon-chef.default-icon.section-icon').next().text()).trim()
            },
            layout_2: {
                title: ($('#recipe-main-content').text()).trim(),
                author: ($('.submitter__name').text()).trim(),
                prep_time: $('time[itemprop|="prepTime"]').text(),
                cook_time: $('time[itemprop|="cookTime"]').text(),
                servings: $('#servings').val(),
                cuisine: null, // Not present on page
                ingredients: getArray('span.recipe-ingred_txt.added:not(.white)'),
                directions: getArray('span.recipe-directions__list--item'),
                notes: getArray($('h4.recipe-footnotes__h4:contains(Footnotes)').next().children().toArray())
            }
        },
        fifteenspatulas: {
            layout_1: {
                title: ($('h2.wprm-recipe-name.wprm-block-text-bold').text()).trim(),
                author: 'FifteenSpatulas',
                prep_time: $('div.wprm-recipe-block-container.wprm-recipe-block-container-columns.wprm-block-text-normal.wprm-recipe-time-container.wprm-recipe-prep-time-container').children('.wprm-recipe-time.wprm-block-text-normal').text(),
                cook_time: $('div.wprm-recipe-block-container.wprm-recipe-block-container-columns.wprm-block-text-normal.wprm-recipe-time-container.wprm-recipe-cook-time-container').children('.wprm-recipe-time.wprm-block-text-normal').text(),
                servings: null, // Can't grab dynamic data
                cuisine: ($('span.wprm-recipe-cuisine.wprm-block-text-normal').text()).trim(),
                ingredients: fifteenspatulaGetIng(),
                directions: getArray('div.wprm-recipe-instruction-text'),
                notes: getArray('div.wprm-recipe-notes')
            }
        }
    };

    function getArray(route) {
        //Takes in a jquery selector or an array and returns a new trimed array.
        let newArr = [];

        if (!Array.isArray(route)) {
            route = $(route).toArray();
        }

        route.forEach(elem => {
            if (($(elem).text()).length > 0) {
                newArr.push(($(elem).text()).trim());
            }
        });

        return newArr;
    }

    function fifteenspatulaGetIng() {
        let h4Arr = getArray('h4.wprm-recipe-group-name.wprm-recipe-ingredient-group-name.wprm-block-text-bold')
        let cloneArr = []
        cloneArr = cloneArr.concat(h4Arr)
        let len = h4Arr.length
        let point = -Math.abs(len)

        if (h4Arr.length < 1) {
            // No h4, grab each li and output the ingredients
            return getArray('li.wprm-recipe-ingredient')
        } else {
            // h4 exists, grab each h4 and append the ingredients
            h4Arr.forEach((elem, i) => { 
                (getArray($(`h4:contains(${elem})`).next().children().toArray())).forEach((element) => {
                    if (len == (i+1)) {
                        cloneArr.push(element);
                    } else {
                        cloneArr.splice((point+1), 0, element);
                    }
                });
                point += 1
            });
            return cloneArr
        }
    }

    if (parsed_URL in sws) {
        if (sws[parsed_URL].layout_1.ingredients.length > 0) {
            return sws[parsed_URL].layout_1;
        } else {
            return sws[parsed_URL].layout_2;
        }
    } else {
        return "URL Rejected."
    }
}

module.exports = {doItAgain}