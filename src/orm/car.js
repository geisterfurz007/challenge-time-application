import Sequelize from "sequelize";
import instance from "./setup.js";

const Model = Sequelize.Model;
class Car extends Model {}

Car.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  model: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  make: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  sequelize: instance,
});

export default Car;
