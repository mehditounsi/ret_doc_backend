const genericModel = require('./model');

const name = 'Annonce';
const tableName = 'annonce';
const selectableProps = [
    'id',
    'contenu',
    'type',
    'statut'
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
