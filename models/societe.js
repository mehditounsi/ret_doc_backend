const genericModel = require('./model');

const name = 'Societe';
const tableName = 'societe';
const selectableProps = [
    'id',
    'mf',
    'rc',
    'nom_fr',
    'adresse_fr',
    'nom_ar',
    'adresse_ar',
    'type',
    'date_maj'
];

module.exports = (knex) => {
    const model = genericModel({
        knex,
        name,
        tableName,
        selectableProps,
    });

    const searchmf = async (mf) => {
        try {
            let societe = await knex.select().from(tableName).where('mf', 'like', `%${mf}%`).limit(20)
            return societe
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }


    const searchrc = async (rc) => {
        try {
            let societe = await knex.select().from(tableName).where('rc', 'like', `%${rc}%`).limit(20)
            return societe
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }

    const findWithMF = async (mf) => {
        try {
            let societe = await knex.select().from(tableName).where({mf : mf})
            return societe[0]
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }

    const ifExists = async (rc_array) =>{
        try {
            let existant_rc = []
            let existant_societe = await knex.select().from(tableName).whereIn('rc', rc_array)
            for (var i = 0; i < existant_societe.length; i++){
                existant_rc.push(existant_societe[i].rc)
            }
            return existant_rc
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }


    return {
        ...model,
        searchmf,
        searchrc,
        findWithMF,
        ifExists
    };
};
