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
    const srcBlackList = ['https://images.media-allrecipes.com/images/79590.png']
    const defaultImg = {
        large: 'https://i.ibb.co/xJhWBQz/e1e674b44610.jpg',
        medium: 'https://i.ibb.co/J5nVGPr/e1e674b44610.jpg',
        thumb: 'https://i.ibb.co/3B12jHS/e1e674b44610.jpg' 
    }
    
    // console.log(parse.tld); // 'com'
    // console.log(parse.sld); // 'google'
    // console.log(parse.domain); // 'google.com'
    // console.log(parse.subdomain); // 'www' */

    var sws = {} // Object collection of supported websites this function can parse. 
    
    switch (parsed_URL) { // Only loads JQuery for the matching website
        case 'allrecipes':
            if ($('body').hasClass('.template-recipe')) {
                sws = {
                    allrecipes: {
                        layout_1: { // Checkboxes on page
                            parent: "allrecipes",
                            self: "layout_1",
                            url: {
                                short_url: hostname,
                                full_url: url
                            },
                            title: ($('h1.headline.heading-content').text()).trim(),
                            images: allRecipesGetImg($('.lead-media > noscript:nth-child(1)')),
                            author: ($('.author-name:not(.author-name-title)').text()).trim(),
                            prep_time: ($('div.recipe-meta-item-header:contains(prep:)').next().text()).trim(),
                            cook_time: ($('div.recipe-meta-item-header:contains(cook:)').next().text()).trim(),
                            servings: ($('div.recipe-meta-item-header:contains(Servings:)').next().text()).trim(),
                            cuisine: '', // Not present on page
                            ingredients: getArray('span.ingredients-item-name'),
                            directions: getArray('div.paragraph'),
                            notes: getArray($('span.icon.icon-chef.default-icon.section-icon').next())
                        }
                    }
                }
            } else {
                sws = {
                    allrecipes: {
                        layout_2: { // Plus buttons on page
                            parent: "allrecipes",
                            self: "layout_2",
                            url: {
                                short_url: hostname,
                                full_url: url
                            },
                            title: ($('#recipe-main-content').text()).trim(),
                            images: recipeGetImage($('.rec-photo')),
                            author: ($('.submitter__name').text()).trim(),
                            prep_time: $('time[itemprop|="prepTime"]').text(),
                            cook_time: $('time[itemprop|="cookTime"]').text(),
                            servings: $('#servings').val(),
                            cuisine: '', // Not present on page
                            ingredients: getArray('span.recipe-ingred_txt.added:not(.white)'),
                            directions: getArray('span.recipe-directions__list--item'),
                            notes: getArray($('h4.recipe-footnotes__h4:contains(Footnotes)').next().children().toArray())
                        }
                    }
                }
            }
            break;
        case 'fifteenspatulas':
            sws = {
                fifteenspatulas: {
                    layout_1: {
                        parent: "fifteenspatulas",
                        self: "layout_1",
                        url: {
                            short_url: hostname,
                            full_url: url
                        },
                        title: ($('h2.wprm-recipe-name.wprm-block-text-bold').text()).trim(),
                        images: fifteenspatulaGetImg(($('body noscript:first-of-type').text())),
                        author: 'FifteenSpatulas',
                        prep_time: $('div.wprm-recipe-block-container.wprm-recipe-block-container-columns.wprm-block-text-normal.wprm-recipe-time-container.wprm-recipe-prep-time-container').children('.wprm-recipe-time.wprm-block-text-normal').text(),
                        cook_time: $('div.wprm-recipe-block-container.wprm-recipe-block-container-columns.wprm-block-text-normal.wprm-recipe-time-container.wprm-recipe-cook-time-container').children('.wprm-recipe-time.wprm-block-text-normal').text(),
                        servings: '', // Can't grab dynamic data
                        cuisine: ($('span.wprm-recipe-cuisine.wprm-block-text-normal').text()).trim(),
                        ingredients: fifteenspatulaGetIng(),
                        directions: getArray('div.wprm-recipe-instruction-text'),
                        notes: getArray('div.wprm-recipe-notes')
                    }
                }
            }
            break;
        case 'foodnetwork':
            sws = {
                foodnetwork: {
                    layout_1: {
                        parent: "foodnetwork",
                        self: "layout_1",
                        url: {
                            short_url: hostname,
                            full_url: url
                        },
                        title: foodNetworkAuthTitle(true),
                        images: 'https:' + recipeGetImage([$('.m-RecipeMedia__m-MediaBlock > div:nth-child(1) > img:nth-child(1)'), $('.m-MediaBlock__VideoButton > img:nth-child(1)')]),
                        author: foodNetworkAuthTitle(false),
                        prep_time: ($($('ul.o-RecipeInfo__m-Time li span.o-RecipeInfo__a-Description').get(0)).text()).trim(),
                        cook_time: ($($('ul.o-RecipeInfo__m-Time li span.o-RecipeInfo__a-Description').get(1)).text()).trim(),
                        servings: ($($('ul.o-RecipeInfo__m-Yield li span.o-RecipeInfo__a-Description').get(0)).text()).trim(),
                        cuisine: '', // Not Found
                        ingredients: getArray('p.o-Ingredients__a-Ingredient'),
                        directions: getArray('li.o-Method__m-Step'),
                        notes: getArray('p.o-ChefNotes__a-Description')
                    }
                }
            }
            break;
        default:
            sws = {}
            break;
    }

    // ******************** Generic Functions ********************

    function getArray(route) {
        //Takes in a jquery selector or an array and returns a new trimmed array.
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

    function nullEmpty(obj) {
        let keys = Object.keys(obj)
        Object.values(obj).forEach((val, i) => {
            if (val === '' || val.length === 0 || isEmptyObj(val) || val === null || typeof val === 'undefined') {
                obj[keys[i]] = 'N/A'
            }
        }); 
        return obj
    }

    function recipeGetImage(images) {
        if (Array.isArray(images)) {
            for (let i = 0; i < images.length; i++) {
                if ($(images[i]).attr('src')) {
                    if (srcBlackList.indexOf(images[i].src) == -1) {
                        console.log('recipeGetImage() -> isArray -> img src saved.')
                        return $(images[i]).attr('src')
                    } else {
                        break
                    }
                }
            }
        } else if (typeof images == 'object') {
            if ($(images).attr('src') && srcBlackList.indexOf($(images).attr('src')) == -1) {
                console.log('recipeGetImage() -> typeof object -> node img src saved.')
                return $(images).attr('src')
            }
        }

        console.log('recipeGetImage() -> default img saved')
        return defaultImg // Default stock image
    }

    function isEmptyObj(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    // ******************** Specific Functions ********************

    function allRecipesGetImg(elem) { // When the img has to be grabbed from <noscript>
        try {
            if (elem) {
                var splity = (elem.text()).split('"')
                return splity[1].trim()
            }
            return defaultImg
        } catch (error) {
            console.error(error)
            return defaultImg
        }
    }   

    function foodNetworkAuthTitle(toggle) {
        var res = ($('title').text()).trim().split(' | ')
        if (toggle == true) {
            return res[0] // Title
        } else {
            return res[1] // Author
        }
        
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

    function fifteenspatulaGetImg(elem) { // More <noscript> nonsense
        try {
            if (typeof elem !== 'undefined') {
                var splity = elem.split('src=')
                splity = splity[1].split('"')
                return splity[1]
            }
            return defaultImg
        } catch (error) {
            console.error(error)
            return defaultImg
        }
    }

    // Return results

    if (parsed_URL in sws) {
        try {
            if (sws[parsed_URL].layout_1) {
                if (sws[parsed_URL].layout_1.ingredients.length > 0) {
                    console.log(sws[parsed_URL].layout_1)
                    return nullEmpty(sws[parsed_URL].layout_1);
                }
            } else if (sws[parsed_URL].layout_2) {
                if (sws[parsed_URL].layout_2.ingredients.length > 0) {
                    console.log(sws[parsed_URL].layout_2)
                    return nullEmpty(sws[parsed_URL].layout_2);
                }
            }

            console.log("Website is valid, but no recipe was found.")
            return "Website is valid, but no recipe was found."
        } catch (error) {
            console.log("doItAgain() EoF Try/Catch Error Report")
            console.error(error)
            return "Website is valid, but no recipe was found."
        }
    } else {
        return "URL Rejected."
    }
}

module.exports = {doItAgain}