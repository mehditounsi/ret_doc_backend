const genericModel = require('./model');

const name = 'Retenue';
const tableName = 'type_de_retenue';
const selectableProps = [
    'id',
    'nom',
    'libelle',
    'retenue'
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
