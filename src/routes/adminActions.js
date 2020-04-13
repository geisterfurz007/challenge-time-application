import express from 'express';
import { Car } from "../orm/index.js";

const router = express.Router();

// General Admin filter for all following requests
router.use("/", async (req, res, next) => {
  const admin = res.locals.isAdmin;

  if (!admin) {
    res.status(403).send("Forbidden");
    return;
  }

  next();
});

const carFromBody = (body, partialAllowed = false) => {
  const requiredValues = ["year", "model", "make", "name"];
  const car = {};

  for (let i = 0, n = requiredValues.length; i < n; ++i) {
    const current = requiredValues[i];
    if (!body[current] && !partialAllowed) {
      throw Error(`Bad request! Value ${current} is missing.`);
    }

    car[current] = body[current];
  }

  return car;
};

// POST to create a full car
router.post("/", async (req, res) => {
  try {
    const car = carFromBody(req.body);
    const persistedCar = await Car.create(car);
    res.send(persistedCar);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const carUpdateRequest = (partial) => {
  return async (req, res) => {
    const id = req.params.id;

    try {
      const car = carFromBody(req.body, partial);
      await Car.update(car, { where: { id } });
      res.send("OK");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!");
    }
  };
};

// PUT to override a full car
router.put("/:id", carUpdateRequest(false));

// PATCH to update parts of the car
router.patch("/:id", carUpdateRequest(true));

// DELETE to remove a car by ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  try {
    Car.destroy({ where: { id } });
    res.send("OK");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error!");
  }
});

export default router;
