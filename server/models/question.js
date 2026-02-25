'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Category, {foreignKey:"CategoryId"})
    }
  }
  Question.init({
    text: {type: DataTypes.STRING,
      allowNull:false},
    choices: {type: DataTypes.JSON, 
      allowNull:false},
    answer: {type: DataTypes.STRING,
      allowNull:false},
    CategoryId: {type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "Categories",
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {  
    sequelize,
    modelName: 'Question',
  });
  return Question;
};