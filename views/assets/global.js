function logout() {
    document.cookie = "authentication=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    window.location.replace("/")
}

function deleteNode(node) {
    node.remove();
}

function cleanUpText(text) {
    try {
        if (text == {} || text == [] || text == null || text == '') return;

        if (typeof text == 'array') {
            let newText = []

            text.forEach(e => {
                if (typeof e == 'array' || typeof e == 'object') {
                    cleanUpText(e)
                } else {
                    e = e.trim()
                    e = e.replace(/  +/g, ' ')
                    newText.push()
                }
            });
        } else if (typeof text == 'object') {
            console.log('found object')
            let keys = Object.keys(text)
            Object.values(text).forEach((val, i) => {
                if (typeof val == 'array' || typeof val == 'object') {
                    cleanUpText(val)
                } else {
                    val = val.trim()
                    val = val.replace(/  +/g, ' ')
                    text[keys[i]] = val
                }
            });
        } else {
            text = text.trim()
            text = text.replace(/  +/g, ' ')
        }
        
        return text
    } catch (error) {
        console.error(error)
        console.log(text)
    }
}