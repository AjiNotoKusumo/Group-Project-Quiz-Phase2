'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const dataCategory = require('../categories.json').map(category => {
    category.createdAt = new Date();
    category.updatedAt = new Date();
    return category;
   });
   await queryInterface.bulkInsert('Categories', dataCategory, {});

   const dataQuestion = require('../questions.json').map(question => {
    question.choices = JSON.stringify(question.choices);
    question.createdAt = new Date();
    question.updatedAt = new Date();
    return question;
   });
   await queryInterface.bulkInsert('Questions', dataQuestion, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Questions', null, {truncate: true, cascade: true, restartIdentity: true});
    await queryInterface.bulkDelete('Categories', null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
