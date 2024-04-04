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
