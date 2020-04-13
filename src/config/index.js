import jose from "jose";

const config = {
  jwt: {
    key: jose.JWK.generateSync("RSA"),
  },
  orm: {
    host: "localhost",
    port: "3306",
    databaseName: "",
    username: "",
    password: ""
  },
  rounds: 100000,
};

export default config;
