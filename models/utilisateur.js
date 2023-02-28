const genericModel = require('./model');

const name = 'Utilisateur';
const tableName = 'utilisateur';
const selectableProps = [
    'id',
    'utilisateur',
    'mdp'
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
