export function validateName(name) {
    // Check if the name is not empty
    if (!name) {
      return { isValid: false, errorMessage: "Name is required" };
    }
  
    // Check if the name contains only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return { isValid: false, errorMessage: "Name can only contain letters and spaces" };
    }
  
    // Check if the name is at least 2 characters long
    if (name.length < 2) {
      return { isValid: false, errorMessage: "Name must be at least 2 characters long" };
    }
  
    // Check if the name is not too long
    if (name.length > 50) {
      return { isValid: false, errorMessage: "Name must be less than 50 characters long" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }
  
 export function validateEmail(email) {
    // Check if the email is not empty
    if (!email) {
      return { isValid: false, errorMessage: "Email is required" };
    }
  
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
      return { isValid: false, errorMessage: "Invalid email format" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }
  
 export function validatePhoneNumber(phoneNumber) {
    // Check if the phone number is not empty
    if (!phoneNumber) {
      return { isValid: false, errorMessage: "Phone number is required" };
    }
  
    // Regular expression to validate phone numbers
    const phoneRegex = /^(\+94)?(0)?\d{9}$/;
  
    // Check if the phone number matches the regular expression
    if (!phoneRegex.test(phoneNumber)) {
      return { isValid: false, errorMessage: "Invalid phone number format" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }

 export function validateAddress(address) {
    // Check if the address is not empty
    if (!address) {
      return { isValid: false, errorMessage: "Address is required" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }

 export function validatePassword(password) {
    // Check if the password is not empty
    if (!password) {
      return { isValid: false, errorMessage: "Password is required" };
    }
  
    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      return { isValid: false, errorMessage: "Password must be at least 6 characters long" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }
  