const genericModel = require('./model');

const name = 'Compteur';
const tableName = 'compteur';
const selectableProps = [
    'id',
    'visiteur',
    'partage',
    'impression'
];

module.exports = (knex) => {
    const model = genericModel({
        knex,
        name,
        tableName,
        selectableProps,
    });


    return {
        ...model,
    };
};
