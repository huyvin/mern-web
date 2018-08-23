const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    // remplace le champ vide par '' (string vide) pour que ce soit compatible avec la fonction isempty()
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!validator.isEmail(data.email)) {
        errors.email = 'email is not valid';
    }

    if(validator.isEmpty(data.email)) {
        errors.email = 'email is required';
    }

    if(validator.isEmpty(data.password)) {
        errors.password = 'password is required';
    }

    return {
        errors, // errors: errors
        isValid: isEmpty(errors)
    };
}