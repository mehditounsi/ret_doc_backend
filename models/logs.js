const genericModel = require('./model');

const name = 'Logs';
const tableName = 'log_retenue';
const selectableProps = [
    'id',
    'ip_client',
    'mf_payeur',
    'mf_beneficiaire',
    'body',
    'action',
    'cf_requete',
    'pays',
    'agent',
    'created_at'
];


module.exports = (knex) => {
    const model = genericModel({
        knex,
        name,
        tableName,
        selectableProps,
    });


    const create = async (props) => {
        try {
            let rs = await knex.insert(props).into(tableName).returning(selectableProps)
            if (rs && rs.length > 0) {
                return rs[0]
            }
            return null
        } catch (error) {
            console.error(error)
        }
    }

    let modelFunctions = Object.keys(model).
    filter(function (key) {
        return (!key.includes('create'));
    }).
    reduce((cur, key) => { 
      return Object.assign(cur, { [key]: model[key] })}, {});

    return {
        ...modelFunctions,
        create
    };
};
