import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Sequilize connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to Sequelize", err);
  });

//? pravi Modele(tabele u bazi) ako ne postoje
sequelize.sync();

export default sequelize;
