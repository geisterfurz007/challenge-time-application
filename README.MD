# Challenge Time Car Shop

This project was written as part of an application to [ChallengeTime](https://challengetime.com).  
It contains a Node.JS Express based REST-API for a carshop to allow users to search cars as well as admins to add, edit and delete them.

## Table of contents

1. [Run](#run)
2. [Requirements](#requirements)
3. [Example setup](#example-setup)
4. [Documentation](#documentation)

## Run

To run the project first clone it:

```
git clone https://github.com/geisterfurz007/challenge-time-application.git
```

Then install the dependencies using yarn:

```
yarn
```

And finally run it:

```
yarn start
```

## Requirements

The project requires a Node version >= 13 because of module support (see https://stackoverflow.com/a/45854500/6707985).

The project further requires a MariaDB database for storage. The configuration of the database can be done in `src/config/index.js` under the key `orm`.

## Example setup

To add dummy data into the database you can use the following snippet.
Place it in a file called `exampleSetup.js` in the `src` folder and call it using `node src/exampleSetup.js`.

Note: This will clear all cars and users before adding the dummy data!

```js
import pbfdk from "pbkdf2";
import { Car, User, instance } from "./orm/index.js";
import config from "./config/index.js";
import crypto from "crypto";

const cars = [
  {year: 2022, model: "E-Buzz", make: "Volkswagen", name: "E-Buzz 3000"},
  {year: 2012, model: "Fiesta", make: "Ford", name: "Harry"},
  {year: 1985, model: "DeLorean", make: "DMC", name: "DMC DeLorean"}
];

const createUser = (firstname, lastname, username, password, isAdmin) => {
  const salt = crypto.randomBytes(24).toString("hex");
  const hash = pbfdk
    .pbkdf2Sync(password, salt, config.rounds, 64, "sha512")
    .toString("base64");

  return {
    firstname, lastname, username, password: hash, salt, admin: isAdmin
  };
};

const users = [
  createUser("Michel", "von Varendorff", "geisterfurz007", "password", true),
  createUser("Emmet", "Brown", "Emmet'D'Brown", "bttf1985", false),
  createUser("Isagani", "Gladwyn", "i-gladwyn97", "kjha%/664,-ds", false),
];

(async () => {
  await instance.sync({force: true});
  await Car.destroy({where: {}});
  await User.destroy({where: {}});

  await Car.bulkCreate(cars);
  await User.bulkCreate(users);
})();
```

## Documentation

The API documentation created through Postman docs can be found [here](https://documenter.getpostman.com/view/11048576/SzezdCaT?version=latest).
