/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("compteur", (t) => {
        t.increments("id").primary();
        t.bigInteger("visiteur");
        t.bigInteger("partage");
        t.bigInteger("impression");
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("compteur")
};
