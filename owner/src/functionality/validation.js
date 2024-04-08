export function validatePrice(price) {
    var regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(price)) {
        return false;
    }
    return true;
}


export function validateIntegers(number) {
    var regex = /^(0|[1-9]\d*)(\.\d+)?$/;

    if (!regex.test(number)) {
        return false;
    }
    else {
        return true;
    }
}

export function nameValidation(name) {
    var regex = /^[a-zA-Z0-9\s_-]+$/;
    if (!regex.test(name)) {
        return false;
    }
    return true;
}
