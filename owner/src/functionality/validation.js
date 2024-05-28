export function validatePrice(price) {//allows only 2 decimal places
    var regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(price)) {
        return false;
    }
    return true;
}


export function validateIntegers(number) {//allows only positive integers
    var regex = /^(0|[1-9]\d*)(\.\d+)?$/;

    if (!regex.test(number)) {
        return false;
    }
    else {
        return true;
    }
}

export function nameValidation(name) {//allows only alphabets, numbers, spaces, underscores and hyphens
    var regex = /^[a-zA-Z0-9\s_-]+$/;
    if (!regex.test(name)) {
        return false;
    }
    return true;
}

export function validateEmail(email) {//allows only valid email addresses
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(emailRegex.test(email)){
        return true;
    }else{
        return false;
    }
}

export function validatePassword(password) {//allows only valid passwords.Contains at least one number, one special character and one alphabet. Minimum length is 7
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{7,}$/;
    if(passwordRegex.test(password)){
        return true;
    }else{
        return false;
    }
}

export function convertToPriceFormat(price) {//converts a number to price format
    return price.toFixed(2);
}
export function validatePhoneNumber(phoneNumber) {
    // Define the regular expression for phone number validation
    const phoneRegex = /^(?:\+94|0)\d{9}$/;
    
    // Test the phone number against the regex
    if(phoneRegex.test(phoneNumber)){
        return true;
    }else{
        return false;
    }
  }
export function validateWeight(weight){//allows only positive integers or decimal numbers exept 0
    var regex = /^(0|[1-9]\d*)(\.\d+)?$/;
    if (!regex.test(weight)) {
        return false;
    }
    return true;
}