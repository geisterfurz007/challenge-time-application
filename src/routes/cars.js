import express from "express";
import jose from "jose";
import Sequelize from "sequelize";

import config from "../config/index.js";
import { Car } from "../orm/index.js";
import adminActions from "./adminActions.js";

const validationKey = config.jwt.key;
const router = express.Router();

// General authorization filter
router.use("/", (req, res, next) => {
  const headerPrefix = "Bearer ";
  const header = req.headers["authorization"];

  if (!header || !header.startsWith(headerPrefix)) {
    res.status(400).send("Missing Bearer token");
    return;
  }

  const token = header.substr(headerPrefix.length);

  try {
    const claims = jose.JWT.verify(token, validationKey, {
      algorithms: ["RS512"],
    });
    if (claims) {
      res.locals.isAdmin = claims.admin;
      next();
    } else {
      res.status(401).send("Unauthorized!");
    }
  } catch (error) {
    if (error instanceof jose.errors.JWSVerificationFailed) {
      res.status(401).send("Unauthorized!");
    } else {
      let errorMessage = "";

      if (error instanceof jose.errors.JOSEError) {
        errorMessage = `${error.name}: ${error.message}`;
      }

      res.status(500).send(`Server Error ${errorMessage}`);
      console.log(error);
    }
  }
});

// GET car by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const car = await Car.findByPk(id);
    res.send(car);
  } catch (error) {
    console.log(error);
    res.status(404).send(`Car with ID ${id} not found.`);
  }
});

// GET cars filtered by parameters
router.get("/", async (req, res) => {
  const possibleParams = [
    { col: "year", isString: false },
    { col: "name", isString: true },
    { col: "model", isString: true },
  ];

  const constraints = [];
  possibleParams.forEach(({ col, isString }) => {
    const value = req.query[col];
    if (value && !isString) constraints.push({ [col]: req.query[col] });
    if (value && isString) {
      constraints.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.col(col)), {
          [Sequelize.Op.like]: `%${req.query[col].toLowerCase()}%`,
        })
      );
    }
  });

  const matchingCars = await Car.findAll({ where: constraints });

  res.send(matchingCars);
});

router.use("/", adminActions);

export default router;
