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
                cuisine: null,
                ingredients: getArray('span.recipe-ingred_txt.added:not(.white)'),
                directions: getArray('span.recipe-directions__list--item'),
                notes: getArray($('h4.recipe-footnotes__h4:contains(Footnotes)').next().children().toArray())
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

    return vws.allrecipes.layout_1;
}

module.exports = {doItAgain}