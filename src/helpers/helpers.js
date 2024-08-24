function isStringNotEmpty(string) {
  return string.trim() !== "";
}

function passwordValidation(password) {
  return password.trim().length > 5;
}

function validEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function filterUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return JSON.parse(decodeURIComponent(parts.pop().split(";").shift()));
  }
  return null;
}

export default {
  isStringNotEmpty,
  passwordValidation,
  validEmail,
  filterUnique,
  getCookie,
};
