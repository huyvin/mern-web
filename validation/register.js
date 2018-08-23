const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // remplace le champ vide par '' (string vide) pour que ce soit compatible avec la fonction isempty()
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    

    if(!validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 & 30 characters';
    }

    if(validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(validator.isEmpty(data.email)) {
        errors.email = 'email is required';
    }

    if(!validator.isEmail(data.email)) {
        errors.email = 'email is not valid';
    }

    if(validator.isEmpty(data.password)) {
        errors.password = 'password is required';
    }

    if(!validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'password must be between 6 & 30 characters';
    }

    if(validator.isEmpty(data.password2)) {
        errors.password2 = 'confirm password field is required';
    }

    if(!validator.equals(data.password, data.password2)) {
        errors.password2 = 'passwords must match';
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    };
}