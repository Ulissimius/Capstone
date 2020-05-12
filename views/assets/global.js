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