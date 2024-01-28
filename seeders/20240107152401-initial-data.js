"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const hash = await bcrypt.hash("password", 10);
      await queryInterface.bulkInsert(
        "users",
        {
          id: 1,
          name: "root",
          email: "root@example.com",
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          transaction,
        }
      );
      await queryInterface.bulkInsert(
        "todos",
        Array.from({ length: 10 }).map((_, i) => {
          return {
            userId: 1,
            name: `todo-${i}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
        {
          transaction,
        }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null);
  },
};
