

exports.randomAlphabetic = async (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


exports.getHeaders = (headers, keyname) => {
        if (headers && keyname) {
            if (Array.isArray(headers)){
            for (var i = 0; i < headers.length; i++) {
                if (headers[i].toLowerCase() === keyname.toLowerCase() ) {
                    return headers[i+1];
                }
            }
        } else if (typeof headers === "object") {
            for (var key in headers) {
                if (key.toLowerCase() == keyname.toLowerCase()){
                    console.log(headers[key]);
                    return headers[key]
                }
            }
        }
}
    
}