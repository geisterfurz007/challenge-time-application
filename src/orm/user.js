import Sequelize from "sequelize";
import instance from "./setup.js";

const Model = Sequelize.Model;
class User extends Model {}

User.init(
  {
    username: {
      type: Sequelize.STRING({length: 75}),
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT({length: "medium"}),
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: instance,
  }
);

export default User;
