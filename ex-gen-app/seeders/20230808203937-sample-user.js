"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "John Doe",
        pass: "john-doe4444",
        mail: "john@gamil.com",
        age: 32,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hanako Yamada",
        pass: "hanako3254",
        mail: "hanako@gamil.com",
        age: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hikaru Suzuki",
        pass: "hikaru1111",
        mail: "suzuki@gamil.com",
        age: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Yuki Michimon",
        pass: "michimon9987",
        mail: "yuki@gamil.com",
        age: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
