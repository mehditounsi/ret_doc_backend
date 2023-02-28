/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("annonce", (t) => {
        t.increments("id").primary();
        t.text("contenu", "longtext")
        t.string("type");
        t.enu("statut", ['Activer', 'Désactiver'])
      })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("annonce")
}
