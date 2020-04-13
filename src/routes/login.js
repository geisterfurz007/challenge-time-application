import express from "express";
import jose from "jose";
import pbkdf from "pbkdf2";

import { User } from "../orm/index.js";
import config from "../config/index.js";

const router = express.Router();
const key = config.jwt.key;

router.post("/", async (req, res) => {
  const headerPrefix = "Basic ";
  const header = req.headers["authorization"];

  if (!header || !header.startsWith(headerPrefix)) {
    res.status(400).send("Missing Basic authentication");
    return;
  }

  const details = header.substr(headerPrefix.length);
  const split = Buffer.from(details, "base64").toString("ascii").split(":");

  if (split.length !== 2) {
    res.status(400).send("Bad authentication header");
    return;
  }

  const [username, password] = split;
  const user = await User.findByPk(username);
  
  try {
    const validCredentials = await hashPromise(password, user.salt, user.password);

    if (!validCredentials) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const jwtToken = jose.JWT.sign({username, admin: user.admin}, key, {
      algorithm: "RS512",
      expiresIn: "2 weeks"
    });
  
    res.send(jwtToken);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

const hashPromise = (password, salt, storedHash) =>
  new Promise((resolve, reject) => {
    pbkdf.pbkdf2(
      password,
      salt,
      config.rounds,
      64,
      "sha512",
      (err, derived) => {
        if (err) {
          reject(err);
          return;
        }

        const derivedBase64 = derived.toString("base64");
        resolve(derivedBase64 === storedHash);
      }
    );
  });

export default router;
