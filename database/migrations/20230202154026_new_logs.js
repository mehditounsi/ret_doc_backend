/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('log_retenue', t => {
        t.string("agent",1000);
        t.string("pays", 1000);
        t.string("cf_requete", 1000);
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('log_retenue', t => {
        t.dropColumn('agent')
        t.dropColumn('pays')
        t.dropColumn('cf_requete')
    })
}
