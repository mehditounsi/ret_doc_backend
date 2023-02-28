/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("type_de_retenue", (t) => {
        t.increments("id").primary();
        t.string("libelle", 100);
        t.string("nom", 100);
        t.decimal("retenue", 10, 4);
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("type_de_retenue")
};
