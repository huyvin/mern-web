/*  fonction globale
    fonction isEmpty() générique
*/

// const isEmpty = value =>
//   value === undefined ||
//   value === null ||
//   (typeof value === 'object' && Object.keys(value).length === 0) ||
//   (typeof value === 'string' && value.trim().length === 0);

const isEmpty = function(value) {
    value === undefined || //checke si valeur indéfinie
    value === null || // checke si valeur nulle
    (typeof value === 'object' && Object.keys(value.length === 0)) || // checke si objet vide
    (typeof value === 'String' && value.trim().length === 0) //checke si string vide
}

module.exports = isEmpty;