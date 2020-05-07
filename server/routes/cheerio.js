// Add comments.
const cheerio = require('cheerio');

function doItAgain(data, url) {
    const $ = cheerio.load(data);

    vws = {
        allrecipes: {
            layout_1: {
                title: ($('h1.headline.heading-content').text()).trim(),
                author: ($('a.author-name.link').text()).trim(),
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
        let arr = [];
        let newArr = [];

        if (Array.isArray(route)) {
            arr = route;
        } else {
            arr = $(route).toArray();
        }

        arr.forEach(elem => {
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

    return vws.fifteenspatulas.layout_1;
}

module.exports = {doItAgain}