"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Board);
      User.hasMany(models.Markdata);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "名前は必ず入力してください",
          },
        },
      },
      pass: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "パスワードは必ず入力してください",
          },
        },
      },
      mail: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: "メールアドレスを入力してください",
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "整数を入力ください" },
          min: { args: [0], msg: "ゼロ以上の値を入力してください" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
