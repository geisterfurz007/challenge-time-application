import Sequelize from "sequelize";
import config from "../config/index.js";

const { orm } = config;

const sequelize = new Sequelize(orm.databaseName, orm.username, orm.password, {
  host: orm.host,
  dialect: "mariadb",
  define: {
    timestamps: false,
  }
});

sequelize.authenticate().then(() => console.log("Successful connection")).catch(console.error);

export default sequelize;
