function isStringNotEmpty(string) {
    return string.trim() !== "";
}

function passwordValidation(password) {
    return password.trim().length > 5
}

function validEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export default {
    isStringNotEmpty,
    passwordValidation,
    validEmail
};