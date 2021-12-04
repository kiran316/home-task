const db = require("../models");
const Birthday = db.birthday;
const Op = db.Sequelize.Op;

// Create and Save a new Birthday
exports.saveOrUpdate = (req, res) => {
  // Validate request
  if (!req.body.dateOfBirth) {
    res.status(400).send({
      message: "DOB can not be empty!"
    });
    return;
  }
  const bdayStr = req.body.dateOfBirth.split('-');
  const bday = new Date(bdayStr[0], bdayStr[1], bdayStr[2]);
  if (bday > new Date()) {
    res.status(400).send({
      message: "DOB can not be future date!"
    });
    return;
  }
  const username = req.params.username;
  if (!(/^[a-zA-Z]+$/.test(username))) {
    res.status(400).send({
      message: "Username can only contains alphabets"
    });
    return;
  }
  // Create/Update a Birthday
  const birthday = {
    username: username,
    dob: req.body.dateOfBirth
  };

  Birthday.update(req.body, {
    where: { username: username }
  })
    .then(num => {
      if (num == 1) {
        res.sendStatus(204);
      } else {
        Birthday.create(birthday)
          .then(data => {
            res.sendStatus(204);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Birthday."
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Birthday with username=" + username
      });
    });
};

// Retrieve 1 Birthday from the database.
exports.findOne = (req, res) => {
  const username = req.params.username;

  Birthday.findByPk(username)
    .then(data => {
      const dateStr = data.dateOfBirth;
      const bday = new Date(bdayStr[0], bdayStr[1], bdayStr[2]);
      const today = new Date().setHours(0,0,0,0);
      if (bday === today) {
        res.send(`Hello, ${username}! Happy birthday!`)
      } else {
        const difference = bday.getTime() - today.getTime();
        res.send(`Hello, ${username}! Your birthday is in ${difference} day(s)`)
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Birthday with username=" + username
      });
    });
};
